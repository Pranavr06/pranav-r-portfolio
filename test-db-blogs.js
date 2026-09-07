const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('blogs').select('*').limit(1);
  if (error) {
    console.error('Error querying blogs:', error.message);
    const { data: d2, error: e2 } = await supabase.from('posts').select('*').limit(1);
    console.log('Posts:', d2 ? Object.keys(d2[0] || {}) : e2);
  } else {
    console.log('Columns:', data && data.length > 0 ? Object.keys(data[0]) : 'No data');
    if(data && data.length > 0) console.log('Sample:', data[0]);
  }
}
test();
