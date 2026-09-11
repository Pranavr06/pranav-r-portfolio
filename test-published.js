const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('experiences').select('read_more_url, is_published').eq('read_more_url', '/experiences/professional-journey/my-bharat-budget-quest-2026');
  console.log('Published status:', data);
}
test();
