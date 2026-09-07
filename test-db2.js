const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('experiences').select('*').limit(1);
  console.log('Columns:', data && data.length > 0 ? Object.keys(data[0]) : 'No data');
  if(data && data.length > 0) console.log('Sample:', data[0]);
}
test();
