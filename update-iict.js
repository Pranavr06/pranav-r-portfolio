const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateExperience() {
  const { data, error } = await supabase.from('experiences').update({
    image_url: 'aiml-webinar.webp',
    read_more_url: '#',
    certificate_url: '#'
  }).eq('title', 'IICT Summer Internship in AI & ML');
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Successfully updated IICT Internship with image and buttons!');
  }
}

updateExperience();
