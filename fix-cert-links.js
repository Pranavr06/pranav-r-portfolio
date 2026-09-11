const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fixCertLinks() {
  // Fix MY Bharat Budget Quest 2026 - Final Round
  await supabase.from('certificates')
    .update({ experience_url: '/experiences/professional-journey/my-bharat-budget-quest-2026' })
    .eq('title', 'MY Bharat Budget Quest 2026 – Final Round');
    
  // Fix AIC Nitte Internship
  await supabase.from('certificates')
    .update({ experience_url: '/experiences/professional-journey/aic-nitte-internship' })
    .eq('title', 'AIC Nitte Internship');
    
  // Update the IICT experience card to point to the actual certificate instead of '#'
  await supabase.from('experiences')
    .update({ certificate_url: '/assets/iict-internship-certificate.webp' })
    .eq('title', 'IICT Summer Internship in AI & ML');
    
  console.log('Fixed all mismatched experience_urls and certificate_urls!');
}

fixCertLinks();
