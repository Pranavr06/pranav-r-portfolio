import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  
  // Create a temporary client with the user's token to get their user info
  const userClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  const { data: { user }, error } = await userClient.auth.getUser();
  
  if (error || !user || !user.email) return null;

  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (user.email === adminEmail) {
    return user;
  }
  
  return null;
}

export async function GET(req: Request) {
  try {
    const adminUser = await verifyAdmin(req);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .or('is_archived.is.null,is_archived.eq.false')
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminUser = await verifyAdmin(req);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, id, updates } = body;

    if (action === 'delete') {
      const { error } = await supabase.from("testimonials").update({ is_archived: true, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }
    
    if (action === 'create') {
      const { error } = await supabase.from("testimonials").insert({
        ...updates,
        user_id: adminUser.id,
        provider: "admin",
        ip_hash: "admin",
      });
      if (error) throw error;
      return NextResponse.json({ success: true });
    }
    
    if (action === 'update') {
      const { error } = await supabase
        .from("testimonials")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
