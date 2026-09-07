const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const markdownContent = "During the summer of 2026, I completed a rigorous 30-day online internship with the Indian Institute of Computing and Technology (IICT) focused heavily on Artificial Intelligence, Machine Learning, and Natural Language Processing (NLP). \n\nInstead of just watching tutorials, the program was entirely project-driven. I had to build machine learning pipelines from scratch, handling everything from raw data collection to model evaluation. I decided to tackle two major cybersecurity issues using NLP: Fake News and Phishing Emails.\n\nHere is a deep dive into what I built.\n\n## Project 1: AI-Powered Fake News Detection\n\nWith misinformation spreading like wildfire on social media, I wanted to build a system that could automatically flag fabricated articles. \n\n**The Process:**\nI used the ISOT Fake News dataset, which contains nearly 40,000 real and fake articles. Text data is incredibly messy, so I built a rigorous preprocessing pipeline to lowercase the text, strip punctuation, remove stop-words, and lemmatize the words. \n\nTo make the text understandable for the machine learning models, I converted the articles into a 5,000-dimensional sparse matrix using TF-IDF (Term Frequency-Inverse Document Frequency).\n\n**The Results:**\nI trained and tested several models, including K-Nearest Neighbors, Random Forest, and a Multi-Layer Perceptron (Neural Network). Interestingly, I found that **Logistic Regression** was the absolute sweet spot. It achieved a massive **99.02% accuracy** in just 1.73 seconds of training time, completely outperforming the Neural Network which took over 5 minutes to train for similar results!\n\n[Check out the source code on my GitHub](https://github.com/Pranavr06/ai-fake-news-detection)\n\n## Project 2: Zero-Day Phishing Email Detection\n\nFor my second project, I focused on email security. Traditional spam filters rely on hardcoded rules, which hackers easily bypass. I wanted an AI that actually *understood* the linguistic tricks hackers use.\n\n**The Process:**\nSimilar to the fake news project, I extracted linguistic features and structural patterns (like urgency keywords and HTML indicators) from a dataset of phishing and legitimate emails. \n\n**The Results:**\nOnce again, after testing Naive Bayes and Random Forest, Logistic Regression proved to be the most balanced in terms of speed and accuracy. To make it actually usable, I didn't just leave it in a Jupyter Notebook—I deployed the final trained model into a live web application using **Streamlit**. \n\n[Check out the source code on my GitHub](https://github.com/Pranavr06/phishing-email-detection)\n\n## Key Takeaways\n\nThis internship was a huge turning point for me. It taught me that in the real world, the most complex model (like a deep neural network) isn't always the best choice. Sometimes, a highly optimized parametric model like Logistic Regression combined with excellent data preprocessing is all you need to achieve production-level accuracy.";

async function updateExperience() {
  const { data, error } = await supabase.from('experiences').update({
    read_more_url: '/experiences/IICT-Summer-Internship-in-AI-&-ML',
    content: markdownContent
  }).eq('title', 'IICT Summer Internship in AI & ML');
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Successfully added content and updated read_more_url!');
  }
}

updateExperience();
