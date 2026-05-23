const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('legacy_site/certificates.html', 'utf-8');
const $ = cheerio.load(html);

let sql = 'ALTER TABLE certificates ADD COLUMN IF NOT EXISTS image_url TEXT;\nALTER TABLE certificates ADD COLUMN IF NOT EXISTS skills TEXT[];\n\nDELETE FROM certificates;\n\n';

$('#certificate article.details-container').each((i, el) => {
  const $el = $(el);
  const title = $el.find('.project-title').text().trim().replace(/'/g, "''");
  
  let imageUrl = '/assets/ieee-logo.webp';
  if ($el.find('img.certificate-logo').length) {
    imageUrl = $el.find('img.certificate-logo').attr('src').replace('./', '/').replace('../', '/');
  }
  
  let issuer = 'Unknown', date = 'Unknown';
  const dateRaw = $el.find('.certificate-date').text().replace('Completed: ', '').trim().replace(/'/g, "''");
  if (dateRaw) date = dateRaw;
  
  const highlight = $el.find('.achievement-highlight').text().trim().replace(/'/g, "''");
  if (highlight.startsWith('Organized by ')) {
    issuer = highlight.replace('Organized by ', '');
  } else if ($el.find('.certificate-logo').length) {
    const altText = $el.find('.certificate-logo').attr('alt');
    if (altText) issuer = altText.replace(' logo', '').replace(/'/g, "''");
  }

  const description = $el.find('p').not('.certificate-date, .achievement-highlight').first().text().trim().replace(/'/g, "''");
  
  const skills = [];
  $el.find('.skill-tags .tag').each((_, tag) => {
    skills.push("'" + $(tag).text().trim().replace(/'/g, "''") + "'");
  });
  
  let category = $el.attr('data-status') || 'all';

  const pdfUrl = $el.find('.btn.btn-color-2').attr('href') || '#';
  const cleanPdfUrl = pdfUrl.replace('./', '/').replace('../', '/');

  sql += `INSERT INTO certificates (title, date, issuer, description, category, pdf_url, image_url, skills) VALUES ('${title}', '${date}', '${issuer}', '${description}', '${category}', '${cleanPdfUrl}', '${imageUrl}', ARRAY[${skills.join(',')}]::TEXT[]);\n`;
});

fs.writeFileSync('mega_seed_certificates.sql', sql);
console.log('mega_seed_certificates.sql generated successfully!');
