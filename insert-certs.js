const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function insertCerts() {
  const { data, error } = await supabase.from('certificates').insert([
    {
      title: 'IICT AI & ML Summer Internship',
      date: 'July 2026',
      issuer: 'Indian Institute of Computing and Technology (IICT)',
      pdf_url: '/assets/iict-internship-certificate.webp',
      category: 'internship',
      description: 'Completed a 45-Day Summer Internship focused on Artificial Intelligence & Machine Learning, including projects on Fake News and Phishing Email Detection using NLP.',
      image_url: '/assets/aiml-webinar.webp',
      skills: ['Artificial Intelligence', 'Machine Learning', 'NLP'],
      experience_url: '/experiences/IICT-Summer-Internship-in-AI-&-ML',
      status: 'Published',
      display_order: 10
    },
    {
      title: 'Training in Artificial Intelligence and Machine Learning',
      date: 'July 2026',
      issuer: 'Indian Institute of Computing and Technology (IICT)',
      pdf_url: '/assets/iict-completion-certificate.webp',
      category: 'course',
      description: 'Successfully completed comprehensive training in Artificial Intelligence and Machine Learning (AI & ML), covering Data Science, Statistics, and Deep Learning algorithms.',
      image_url: '/assets/aiml-webinar.webp',
      skills: ['Data Science', 'Deep Learning', 'Statistics'],
      experience_url: '/experiences/IICT-Summer-Internship-in-AI-&-ML',
      status: 'Published',
      display_order: 10
    }
  ]);
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Successfully inserted both certificates!');
  }
}

insertCerts();
