const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateURLs() {
  const experiencesToUpdate = [
    { old: '/experiences/aic-nitte-internship', new: '/experiences/professional-journey/aic-nitte-internship' },
    { old: '/experiences/my-bharat-budget-quest-2026', new: '/experiences/professional-journey/my-bharat-budget-quest-2026' },
    { old: '/experiences/IICT-Summer-Internship-in-AI-&-ML', new: '/experiences/professional-journey/IICT-Summer-Internship-in-AI-&-ML' }
  ];

  for (const exp of experiencesToUpdate) {
    const { error } = await supabase.from('experiences').update({ read_more_url: exp.new }).eq('read_more_url', exp.old);
    if (error) console.error('Error updating experience URL:', error);
    else console.log('Updated experience URL from', exp.old, 'to', exp.new);
  }

  // Update certificates that point to the IICT experience
  const oldIictUrl = '/experiences/IICT-Summer-Internship-in-AI-&-ML';
  const newIictUrl = '/experiences/professional-journey/IICT-Summer-Internship-in-AI-&-ML';
  
  const { error: certError } = await supabase.from('certificates').update({ experience_url: newIictUrl }).eq('experience_url', oldIictUrl);
  if (certError) console.error('Error updating certificates:', certError);
  else console.log('Updated certificates pointing to', oldIictUrl);
  
  console.log('All URLs updated!');
}

updateURLs();
