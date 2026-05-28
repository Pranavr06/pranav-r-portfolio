const fs = require('fs');
function extract(file) {
  const html = fs.readFileSync(file, 'utf-8');
  const start = html.indexOf('<div class="post-content">');
  const end = html.indexOf('</article>', start);
  return html.substring(start, end).trim().replace(/'/g, "''");
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

fs.writeFileSync('update_content.sql', sql.trim());
console.log('SQL generated to update_content.sql');
