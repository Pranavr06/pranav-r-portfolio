import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function syncCertificateSlugs() {
  console.log("Fetching all certificates from Supabase...");
  const { data: certificates, error } = await supabase
    .from("certificates")
    .select("id, title, slug");

  if (error) {
    console.error("Error fetching certificates:", error.message);
    if (error.message.toLowerCase().includes("slug")) {
      console.log("\n⚠️  The 'slug' column has not been added to your 'certificates' table yet.");
      console.log("Please run this 1-line SQL in your Supabase SQL Editor:\n");
      console.log("  ALTER TABLE certificates ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;\n");
      console.log("After running that SQL in Supabase, re-run 'npm run sync:certs' to populate all certificate slugs!\n");
    }
    return;
  }

  console.log(`Found ${certificates.length} certificates.`);

  let updatedCount = 0;
  for (const cert of certificates) {
    const desiredSlug = slugify(cert.title);
    if (cert.slug !== desiredSlug) {
      const { error: updateError } = await supabase
        .from("certificates")
        .update({ slug: desiredSlug })
        .eq("id", cert.id);

      if (updateError) {
        console.error(`❌ Failed to update "${cert.title}":`, updateError.message);
      } else {
        console.log(`✅ Updated "${cert.title}" -> /certificates/${desiredSlug}`);
        updatedCount++;
      }
    } else {
      console.log(`⏭️  Already has slug "${cert.slug}": ${cert.title}`);
    }
  }

  console.log(`\n🎉 Done! Synchronized ${updatedCount} certificate slugs.`);
}

syncCertificateSlugs();
