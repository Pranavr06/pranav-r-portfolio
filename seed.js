const fs = require('fs');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function seed() {
  const html = fs.readFileSync('legacy_site/index.html', 'utf-8');
  const $ = cheerio.load(html);

  // Parse Projects
  const projects = [];
  $('#projects article.details-container').each((i, el) => {
    const $el = $(el);
    const title = $el.find('.project-title').text().trim();
    const description = $el.find('p').first().text().trim();
    const imageUrl = $el.find('img.project-img').attr('src').replace('./', '/');
    const techStack = [];
    $el.find('.tech-tag').each((_, tag) => techStack.push($(tag).text().trim()));
    const statusClass = $el.attr('data-status');
    let status = 'Completed';
    if (statusClass === 'in-progress') status = 'In Progress';
    if (statusClass === 'collection') status = 'Collection';
    
    let demoUrl = $el.find('.project-btn').attr('href');
    if (demoUrl && !demoUrl.startsWith('http')) demoUrl = null;
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    projects.push({ title, description, image_url: imageUrl, tech_stack: techStack, status, demo_url: demoUrl, repo_url: null, slug });
  });

  // Parse Certificates
  const certificates = [];
  $('#certificate article.details-container').each((i, el) => {
    const $el = $(el);
    const title = $el.find('.project-title').text().trim();
    let issuer = 'Unknown', date = 'Unknown';
    const dateIssuerRaw = $el.find('.certificate-date').text().replace('Completed: ', '').trim();
    if (dateIssuerRaw) date = dateIssuerRaw; // Or parse it if it has issuer
    
    const highlight = $el.find('.achievement-highlight').text().trim();
    if (highlight.startsWith('Organized by ')) issuer = highlight.replace('Organized by ', '');
    
    const description = $el.find('p').not('.certificate-date, .achievement-highlight').first().text().trim();
    const category = $el.find('.tag').first().text().trim() || 'General';
    const pdfUrl = $el.find('.project-btn').attr('href') || '#';

    certificates.push({ title, date, issuer, description, category, pdf_url: pdfUrl });
  });

  // Parse Blogs
  const blogs = [];
  $('#blog article.blog-card').each((i, el) => {
    const $el = $(el);
    const title = $el.find('.blog-title').text().trim();
    const imageUrl = $el.find('img.blog-img').attr('src').replace('./', '/');
    const category = $el.find('.blog-category').text().trim();
    const excerpt = $el.find('.blog-excerpt').text().trim();
    
    // Parse reading time and date
    const metaText = $el.find('.blog-metadata span').last().text().trim(); // e.g. "14 min read • April 21, 2026"
    let readTime = 5;
    if (metaText) {
      const match = metaText.match(/(\d+)\s+min/);
      if (match) readTime = parseInt(match[1]);
    }
    
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    blogs.push({ title, excerpt, content: 'Full blog content goes here.', read_time_minutes: readTime, category, image_url: imageUrl, slug });
  });

  console.log(`Extracted ${projects.length} projects, ${certificates.length} certificates, ${blogs.length} blogs.`);

  // Insert into Supabase
  if (projects.length > 0) {
    const { error } = await supabase.from('projects').insert(projects);
    if (error) console.error('Projects Error:', error.message);
    else console.log('Successfully seeded projects.');
  }

  if (certificates.length > 0) {
    const { error } = await supabase.from('certificates').insert(certificates);
    if (error) console.error('Certificates Error:', error.message);
    else console.log('Successfully seeded certificates.');
  }

  if (blogs.length > 0) {
    const { error } = await supabase.from('blogs').insert(blogs);
    if (error) console.error('Blogs Error:', error.message);
    else console.log('Successfully seeded blogs.');
  }
}

seed().then(() => console.log('Done.')).catch(console.error);
