const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// 1. Load environment variables manually since we don't have dotenv guaranteed
const envLocal = fs.readFileSync('.env.local', 'utf8');
const env = {};
envLocal.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    env[match[1].trim()] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminEmail = env.ADMIN_EMAIL || 'pranavkundapura06@gmail.com';

const supabase = createClient(supabaseUrl, supabaseKey);

const testimonials = [
  {
    name: "Preethika",
    role: "Peer, ISE'28, NMAMIT",
    message: "Pranav R is constantly chasing growth. His unwavering discipline, consistency, and strong work ethic make him someone truly destined for success.",
    avatar_url: "/assets/client-1.webp"
  },
  {
    name: "Pramukh A Nayak",
    role: "Peer, ISE'28, NMAMIT",
    message: "Working with Pranav R on web projects was highly beneficial. His collaborative spirit and dedication made for excellent teamwork.",
    avatar_url: "/assets/client-2.webp"
  },
  {
    name: "Prathwik Shetty",
    role: "Peer, ISE'28, NMAMIT",
    message: "During our Online Exam System project, Pranav R showed remarkable initiative and strong leadership. He is a dedicated team player with a bright future ahead.",
    avatar_url: "/assets/client-3.webp"
  },
  {
    name: "Pranav Shenoy",
    role: "Peer, ISE'28, NMAMIT",
    message: "Working with Pranav R was a fantastic experience. We collaborated on several team projects and maintained excellent coordination throughout.",
    avatar_url: "/assets/client-4.webp"
  }
];

async function run() {
  console.log('Fetching admin user ID...');
  
  // Try to find the admin user by email using listUsers() 
  // (admin API available because we are using service role key)
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('Error fetching users:', authError);
    return;
  }

  const adminUser = users.find(u => u.email === adminEmail);
  if (!adminUser) {
    console.error(`Admin user ${adminEmail} not found in Supabase Auth. Are you registered?`);
    return;
  }

  const adminId = adminUser.id;
  console.log(`Found Admin ID: ${adminId}`);

  console.log('Inserting testimonials...');
  for (const t of testimonials) {
    const { data, error } = await supabase.from('testimonials').insert({
      user_id: adminId,
      email: "legacy@pranav-r-portfolio",
      provider: "legacy",
      ip_hash: "legacy",
      name: t.name,
      role: t.role,
      message: t.message,
      avatar_url: t.avatar_url,
      linkedin_url: "https://www.linkedin.com/in/pending/", // placeholder required by validation
      github_url: "",
      is_approved: true,
      is_verified: false,
      is_github_verified: false,
      is_archived: false
    });

    if (error) {
      console.error(`Failed to insert ${t.name}:`, error.message);
    } else {
      console.log(`Successfully inserted ${t.name}`);
    }
  }
  
  console.log('Migration complete!');
}

run();
