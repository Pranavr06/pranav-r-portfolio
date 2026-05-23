const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data } = await supabase.from('projects').select('id, content').eq('title', 'Vaultary').single();
  let content = data.content;
  const startStr = '**Backend Framework:** Python Flask';
  const endStr = '**Frontend:** HTML5, CSS3 (Variables), Vanilla JavaScript, Chart.js';
  const startIndex = content.indexOf(startStr);
  const endIndex = content.indexOf(endStr) + endStr.length;
  
  const oldBlock = content.substring(startIndex, endIndex);
  const newBlock = oldBlock.split(/\r?\n/).map(line => '> ' + line).join('\n');
  
  content = content.replace(oldBlock, newBlock);
  await supabase.from('projects').update({ content }).eq('id', data.id);
  console.log('Fixed Database Blockquote!');
}
run();
