import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase
    .from("projects")
    .update({ status: "Planned" })
    .eq("id", "d34e3fcf-725c-4c26-81ac-3dd4a6235825")
    .select();
    
  console.log("Updated", data, error);
}

run();
