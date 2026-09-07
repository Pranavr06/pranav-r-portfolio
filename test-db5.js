const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('experiences').select('title, image_url, read_more_url, certificate_url, content').eq('category', 'professional_journey');
  console.log('Data:', data);
}
test();
