import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBlogs() {
  const { data, error } = await supabase
    .from('blogs')
    .select('id, slug, title');
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Existing blogs:');
    console.log(JSON.stringify(data, null, 2));
  }
}

checkBlogs();
