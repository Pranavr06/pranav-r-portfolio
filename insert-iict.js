const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function insertExperience() {
  const { data, error } = await supabase.from('experiences').insert([{
    category: 'professional_journey',
    title: 'IICT Summer Internship in AI & ML',
    description: 'Completed a comprehensive 30-day online internship program focused on Artificial Intelligence and Machine Learning, organized by the Indian Institute of Computing and Technology (IICT).',
    bullet_points: [
      'Developed an AI-Powered Fake News Detection pipeline from scratch using text classification, preprocessing, and ensemble models.',
      'Designed an AI-Driven Phishing Email Detection system leveraging Natural Language Processing (NLP), TF-IDF, and Neural Networks.',
      'Gained hands-on experience in feature extraction, model evaluation, and ethical AI practices for cybersecurity.'
    ],
    date_text: 'Experience: Summer 2026',
    highlight_text: 'Completed 30-Day AI & ML Workflow.',
    tags: ['Artificial Intelligence', 'Machine Learning', 'NLP', 'Python'],
    is_published: true,
    display_order: 3
  }]);
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Successfully inserted IICT Internship!');
  }
}

insertExperience();
