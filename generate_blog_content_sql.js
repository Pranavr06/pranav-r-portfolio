const fs = require('fs');
const cheerio = require('cheerio');
const TurndownService = require('turndown');

const turndownService = new TurndownService();

const mainHtml = fs.readFileSync('legacy_site/blogs.html', 'utf-8');
const $main = cheerio.load(mainHtml);

let sql = '';

$main('#blog article.blog-card').each((i, el) => {
  const $el = $main(el);
  const title = $el.find('.blog-title').text().trim().replace(/'/g, "''");
  const imageUrl = $el.find('img.blog-img').attr('src').replace('./', '/');
  const category = $el.find('.blog-category').text().trim().replace(/'/g, "''");
  const excerpt = $el.find('.blog-excerpt').text().trim().replace(/'/g, "''");
  const metaText = $el.find('.blog-metadata span').last().text().trim();
  let readTime = 5;
  if (metaText) {
    const match = metaText.match(/(\d+)\s+min/);
    if (match) readTime = parseInt(match[1]);
  }
  
  // Link points to /blogs/filename.html
  const linkHref = $el.find('.blog-link').attr('href');
  if (!linkHref) return;
  const filename = linkHref.split('/').pop(); // e.g. evm-architecture-india.html
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  let markdownContent = 'Markdown content missing...';
  
  const filePath = `legacy_site/blogs/${filename}`;
  if (fs.existsSync(filePath)) {
    const detailHtml = fs.readFileSync(filePath, 'utf-8');
    const $detail = cheerio.load(detailHtml);
    const $post = $detail('#blog-post');
    if ($post.length > 0) {
      $post.find('.blog-banner, .post-metadata').remove();
      const contentHtml = $post.html();
      if (contentHtml) {
        let markdown = turndownService.turndown(contentHtml);
        markdown = markdown.replace(/\.\.\/assets\//g, '/assets/');
        markdownContent = markdown.replace(/'/g, "''");
      }
    }
  }

  sql += `INSERT INTO blogs (title, excerpt, content, read_time_minutes, category, image_url, slug) VALUES ('${title}', '${excerpt}', '${markdownContent}', ${readTime}, '${category}', '${imageUrl}', '${slug}') ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, excerpt = EXCLUDED.excerpt;\n`;
});

fs.writeFileSync('mega_seed_blogs.sql', sql);
console.log('mega_seed_blogs.sql generated successfully!');
