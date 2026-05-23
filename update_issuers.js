import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
  { title: "Python Course", issuer: "University of Michigan" },
  { title: "MATLAB Course", issuer: "MathWorks" },
  { title: "Cybersecurity Course", issuer: "University of Maryland" },
  { title: "Innovation Ambassador (Foundation)", issuer: "MoE's Innovation Cell & AICTE" },
  { title: "Innovation Ambassador (Advanced)", issuer: "MoE's Innovation Cell & AICTE" },
  { title: "Innovation Ambassador (Re-Skill)", issuer: "MoE's Innovation Cell & AICTE" },
  { title: "AIC Nitte Internship", issuer: "Completed in under 4 months." },
  { title: "Certificate of Presentation - AIDE 2026", issuer: "Organized by IEEE & NMAMIT" },
  { title: "Foundations of Cryptography Workshop", issuer: "Organized by ISE Department" },
  { title: "Road Safety Workshop", issuer: "Organized by Road Safety Club, NMAMIT" },
  { title: "Certificate of Pledge", issuer: "Udupi District Police" },
  { title: "AIML Webinar", issuer: "NMAM Institute of Technology" },
  { title: "MY Bharat Budget Quest 2026", issuer: "Organized by Ministry of Youth Affairs & Sports", matchAll: true },
  { title: "Financial Literacy & Markets", issuer: "SEBI & NISM" },
  { title: "Viksit Bharat 2025 Certification", issuer: "MyGov" },
  { title: "Vande Mataram - 150 Years Quiz", issuer: "Ministry of Culture" },
  { title: "Gyan Vigyan Quiz Certification", issuer: "DST & MyGov" },
  { title: "Energy Conservation Certification", issuer: "BEE & Ministry of Power" },
  { title: "Swachh Bharat Mission", issuer: "Ministry of Jal Shakti" }
];

async function updateDb() {
  for (let u of updates) {
    if (u.matchAll) {
      // For MY Bharat Budget, update all 3 records
      const { data, error } = await supabase.from('certificates').update({ issuer: u.issuer }).ilike('title', `${u.title}%`);
      console.log(`Updated all starting with ${u.title}`);
    } else {
      const { data, error } = await supabase.from('certificates').update({ issuer: u.issuer }).ilike('title', `${u.title}%`);
      if (error) console.error("Error for", u.title, error);
      else console.log("Updated", u.title);
    }
  }
}

updateDb();
