const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('legacy_site/index.html', 'utf-8');
const $ = cheerio.load(html);
let sql = '';

$('#projects article.details-container').each((i, el) => {
  const $el = $(el);
  const title = $el.find('.project-title').text().trim().replace(/'/g, "''");
  const description = $el.find('p').first().text().trim().replace(/'/g, "''");
  const imageUrl = $el.find('img.project-img').attr('src').replace('./', '/');
  const techStack = [];
  $el.find('.tech-tag').each((_, tag) => techStack.push("'" + $(tag).text().trim().replace(/'/g, "''") + "'"));
  
  const statusClass = $el.attr('data-status');
  let status = 'Completed';
  if (statusClass === 'in-progress') status = 'In Progress';
  if (statusClass === 'collection') status = 'Collection';
  
  let demoUrl = $el.find('.project-btn').attr('href');
  if (demoUrl && !demoUrl.startsWith('http')) demoUrl = null;
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  sql += `INSERT INTO projects (title, description, image_url, tech_stack, status, demo_url, slug) VALUES ('${title}', '${description}', '${imageUrl}', ARRAY[${techStack.join(',')}], '${status}', ${demoUrl ? "'" + demoUrl + "'" : 'null'}, '${slug}');\n`;
});

$('#certificate article.details-container').each((i, el) => {
  const $el = $(el);
  const title = $el.find('.project-title').text().trim().replace(/'/g, "''");
  let issuer = 'Unknown', date = 'Unknown';
  const dateRaw = $el.find('.certificate-date').text().replace('Completed: ', '').trim().replace(/'/g, "''");
  if (dateRaw) date = dateRaw;
  const highlight = $el.find('.achievement-highlight').text().trim().replace(/'/g, "''");
  if (highlight.startsWith('Organized by ')) issuer = highlight.replace('Organized by ', '');
  const description = $el.find('p').not('.certificate-date, .achievement-highlight').first().text().trim().replace(/'/g, "''");
  const category = $el.find('.tag').first().text().trim().replace(/'/g, "''") || 'General';
  const pdfUrl = $el.find('.project-btn').attr('href') || '#';

  sql += `INSERT INTO certificates (title, date, issuer, description, category, pdf_url) VALUES ('${title}', '${date}', '${issuer}', '${description}', '${category}', '${pdfUrl}');\n`;
});

$('#blog article.blog-card').each((i, el) => {
  const $el = $(el);
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
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  sql += `INSERT INTO blogs (title, excerpt, content, read_time_minutes, category, image_url, slug) VALUES ('${title}', '${excerpt}', 'Full blog content from markdown...', ${readTime}, '${category}', '${imageUrl}', '${slug}');\n`;
});

fs.writeFileSync('seed.sql', sql);
console.log('seed.sql generated!');
