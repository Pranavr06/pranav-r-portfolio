const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('experiences').select('title, display_order').eq('category', 'professional_journey').order('display_order', { ascending: true });
  console.log('Orders:', data);
}
test();
