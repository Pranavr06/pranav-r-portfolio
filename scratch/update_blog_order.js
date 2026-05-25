import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const expectedOrder = [
  'how-evms-work-in-india-architecture--security',
  'database-design-mistakes-that-break-production-systems',
  'india-ai-impact-summit-2026-what-student-developers-should-know',
  'building-vaultary-beyond-password123',
  'getting-started-with-web-development-html-css--javascript-explained',
  'the-importance-of-cybersecurity',
  'git--github-essentials',
  'practical-uiux-principles-for-developers',
  'tech-for-good-how-software-can-drive-energy-conservation'
];

async function updateOrder() {
  console.log('Starting blog order update...');
  for (let i = 0; i < expectedOrder.length; i++) {
    const slug = expectedOrder[i];
    const sortOrder = (i + 1) * 10;
    
    console.log(`Updating ${slug} to sort_order ${sortOrder}...`);
    const { data, error } = await supabase
      .from('blogs')
      .update({ sort_order: sortOrder })
      .eq('slug', slug)
      .select();
      
    if (error) {
      console.error(`Error updating ${slug}:`, error.message);
    } else {
      console.log(`Success:`, data);
    }
  }
  console.log('Done!');
}

updateOrder();
