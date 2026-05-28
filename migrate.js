require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const cheerio = require('cheerio'); // Next.js projects usually don't have this, but I can use regex or simple string manipulation.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function extractContent(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  // Simple extraction: find <div class="post-content"> and everything inside it up to the end of main-content or article
  const startIndex = html.indexOf('<div class="post-content">');
  if (startIndex === -1) return null;
  
  const endMarker = '</article>';
  const endIndex = html.indexOf(endMarker, startIndex);
  
  if (endIndex !== -1) {
    let content = html.substring(startIndex, endIndex).trim();
    // Remove the btn-container block at the top if it exists, since we can render that dynamically in next.js or just keep it
    // Actually, it's safer to just include everything and let Next.js render it!
    return content;
  }
  return null;
}

async function migrate() {
  console.log("Starting migration...");
  
  const aicContent = extractContent('./legacy_site/experiences/aic-nitte.html');
  if (aicContent) {
    const { error } = await supabase
      .from('experiences')
      .update({ content: aicContent })
      .eq('read_more_url', '/experiences/aic-nitte');
      
    if (error) console.error("Error updating AIC Nitte:", error);
    else console.log("Successfully updated AIC Nitte!");
  } else {
    console.log("Could not find AIC Nitte content.");
  }
  
  const myBharatContent = extractContent('./legacy_site/experiences/my-bharat-budget.html');
  if (myBharatContent) {
    const { error } = await supabase
      .from('experiences')
      .update({ content: myBharatContent })
      .eq('read_more_url', '/experiences/my-bharat-budget');
      
    if (error) console.error("Error updating MY Bharat:", error);
    else console.log("Successfully updated MY Bharat!");
  } else {
    console.log("Could not find MY Bharat content.");
  }
  
  console.log("Migration complete!");
}

migrate();
