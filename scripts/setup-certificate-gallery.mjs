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

async function setupGallery() {
  console.log("Checking if 'gallery_images' column exists in certificates table...");

  const { data: testData, error: testError } = await supabase
    .from("certificates")
    .select("id, slug, gallery_images")
    .limit(1);

  if (testError && testError.message?.toLowerCase().includes("gallery_images")) {
    console.log("\n⚠️  The 'gallery_images' column has not been added to your 'certificates' table yet.");
    console.log("Please run this 1-line SQL in your Supabase SQL Editor:\n");
    console.log("  ALTER TABLE certificates ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;\n");
    console.log("After running that SQL in Supabase, re-run this script to update certificate records!\n");
    return;
  }

  console.log("✅ 'gallery_images' column is available in Supabase!");

  const defaultSIHImages = [
    {
      url: "/assets/night-group-selfie.webp",
      caption: "Team at Smart India Hackathon 2026 Internal Ideathon",
    },
    {
      url: "/assets/night-group-seated.webp",
      caption: "Ideathon participants and team collaboration",
    },
    {
      url: "/assets/night-portrait-wide.webp",
      caption: "Internal Ideathon presentation and event session",
    },
  ];

  const { error: updateError } = await supabase
    .from("certificates")
    .update({ gallery_images: defaultSIHImages })
    .eq("slug", "smart-india-hackathon-2026-internal-ideathon");

  if (updateError) {
    console.error("Error updating SIH 2026 certificate gallery:", updateError.message);
  } else {
    console.log("✅ Updated SIH 2026 certificate with gallery pictures in database!");
  }
}

setupGallery();
