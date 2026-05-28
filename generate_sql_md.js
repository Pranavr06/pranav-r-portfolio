const fs = require('fs');
const TurndownService = require('turndown');
const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced'
});

turndownService.keep(['div', 'figure', 'img', 'video', 'source', 'figcaption', 'details', 'summary', 'button', 'svg', 'circle']);

function extract(file) {
  const html = fs.readFileSync(file, 'utf-8');
  const start = html.indexOf('<div class="post-content">') + '<div class="post-content">'.length;
  const end = html.indexOf('</article>', start);
  const contentHtml = html.substring(start, end)
    .replace(/<a href="#contact".*?<\/a>/, '') // remove scroll down
    .trim();
  
  const markdown = turndownService.turndown(contentHtml);
  return markdown.replace(/'/g, "''");
}

let sql = `
-- Update AIC Nitte
UPDATE public.experiences 
SET content = '${extract('./legacy_site/experiences/aic-nitte.html')}' 
WHERE read_more_url = '/experiences/aic-nitte';

-- Update MY Bharat Budget Quest
UPDATE public.experiences 
SET content = '${extract('./legacy_site/experiences/my-bharat-budget.html')}' 
WHERE read_more_url = '/experiences/my-bharat-budget';
`;

fs.writeFileSync('update_content_md.sql', sql.trim());
console.log('Markdown SQL generated to update_content_md.sql');
