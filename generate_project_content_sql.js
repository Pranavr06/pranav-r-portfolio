const fs = require('fs');
const cheerio = require('cheerio');
const TurndownService = require('turndown');

const turndownService = new TurndownService();

// Define the projects we want to scrape
const projects = [
  // Main projects
  { filename: 'projects.html', type: 'index' }, // to extract main project list metadata
  { filename: 'projects/college-projects.html', type: 'collection_index' }, // to extract college project metadata
  { filename: 'projects/3d-aircraft-model.html', slug: '3d-aircraft-model' },
  { filename: 'projects/devcollab-hub.html', slug: 'devcollab-hub' },
  { filename: 'projects/personal-portfolio.html', slug: 'personal-portfolio' },
  { filename: 'projects/sentiment-analysis-ai.html', slug: 'sentiment-analysis-ai' },
  { filename: 'projects/vaultary.html', slug: 'vaultary' },
  { filename: 'projects/college-projects.html', slug: 'college-projects' }, // its own markdown? Wait, it just has a list.
  
  // College projects
  { filename: 'projects/college/classroom-management-project.html', slug: 'classroom-management-project' },
  { filename: 'projects/college/marketing-prediction-project.html', slug: 'marketing-prediction-project' },
  { filename: 'projects/college/mentor-mentees-project.html', slug: 'mentor-mentees-project' },
  { filename: 'projects/college/online-exam-project.html', slug: 'online-exam-project' }
];

let sql = '';
const projectMetadata = {};

// 1. Extract metadata from projects.html
const mainHtml = fs.readFileSync('legacy_site/projects.html', 'utf-8');
const $main = cheerio.load(mainHtml);
$main('#projects article.details-container').each((i, el) => {
  const $el = $main(el);
  const title = $el.find('.project-title').text().trim().replace(/'/g, "''");
  const description = $el.find('p').first().text().trim().replace(/'/g, "''");
  const imageUrl = $el.find('img.project-img').attr('src').replace('../', '/').replace('./', '/');
  const techStack = [];
  $el.find('.tech-tag').each((_, tag) => techStack.push("'" + $main(tag).text().trim().replace(/'/g, "''") + "'"));
  
  const statusClass = $el.attr('data-status');
  let status = 'Completed';
  if (statusClass === 'in-progress') status = 'In Progress';
  if (statusClass === 'collection') status = 'Collection';
  
  let demoUrl = $el.find('.project-btn').attr('data-href') || $el.find('.project-btn').attr('href') || null;
  if (demoUrl && !demoUrl.startsWith('http') && !demoUrl.startsWith('/')) {
    demoUrl = null; // Ignore relative links like './projects/college-projects.html' as demo URL
  }
  
  const linkHref = $el.find('.read-more-link').attr('href');
  if (linkHref) {
    const slug = linkHref.split('/').pop().replace('.html', '');
    projectMetadata[slug] = { title, description, imageUrl, techStack, status, demoUrl };
  }
});

// 2. Extract metadata from college-projects.html
const collegeHtml = fs.readFileSync('legacy_site/projects/college-projects.html', 'utf-8');
const $col = cheerio.load(collegeHtml);
$col('div.details-container').each((i, el) => {
  const $el = $col(el);
  const title = $el.find('.project-title').text().trim().replace(/'/g, "''");
  const description = $el.find('p').first().text().trim().replace(/'/g, "''");
  const imageUrl = $el.find('img.project-img').attr('src').replace('../', '/assets/'); // Wait, if it's ../assets/
  const finalImageUrl = imageUrl.includes('assets') ? imageUrl.substring(imageUrl.indexOf('/assets')) : imageUrl;
  
  const techStack = [];
  $el.find('.tech-tag').each((_, tag) => techStack.push("'" + $col(tag).text().trim().replace(/'/g, "''") + "'"));
  
  let status = 'College'; // Custom status for these
  let demoUrl = $el.find('.project-btn').attr('href') || null; // Usually view report
  if (demoUrl) demoUrl = demoUrl.replace('../', '/');
  
  const linkHref = $el.find('.read-more-link').attr('href');
  if (linkHref) {
    const slug = linkHref.split('/').pop().replace('.html', '');
    projectMetadata[slug] = { title, description, imageUrl: finalImageUrl, techStack, status, demoUrl };
  }
});

// 3. Process each individual HTML file and generate SQL
projects.forEach(p => {
  if (p.type) return; // Skip index files
  
  const filePath = `legacy_site/${p.filename}`;
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);
    
    // Most project content is inside #project-details or #blog-post
    const $post = $('#project-details').length > 0 ? $('#project-details') : $('#blog-post');
    if ($post.length > 0) {
      $post.find('.blog-banner, .post-metadata').remove();
      const contentHtml = $post.html();
      
      let markdown = '';
      if (contentHtml) {
        markdown = turndownService.turndown(contentHtml);
        markdown = markdown.replace(/\.\.\/assets\//g, '/assets/');
        markdown = markdown.replace(/\.\.\/\.\.\/assets\//g, '/assets/');
        markdown = markdown.replace(/'/g, "''");
      }
      
      const meta = projectMetadata[p.slug];
      if (meta) {
        sql += `INSERT INTO projects (title, description, content, image_url, tech_stack, status, demo_url, slug) VALUES ('${meta.title}', '${meta.description}', '${markdown}', '${meta.imageUrl}', ARRAY[${meta.techStack.join(',')}], '${meta.status}', ${meta.demoUrl ? "'" + meta.demoUrl + "'" : 'null'}, '${p.slug}') ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, description = EXCLUDED.description;\n`;
      }
    }
  }
});

fs.writeFileSync('mega_seed_projects.sql', sql);
console.log('mega_seed_projects.sql generated successfully!');
