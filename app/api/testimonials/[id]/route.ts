import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isValidLinkedInUrl, isValidGithubUrl } from "@/lib/validators";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function authenticate(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  
  const userClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  const { data: { user }, error } = await userClient.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    
    // Check ownership
    const { data: existing, error: fetchErr } = await supabase.from("testimonials").select("user_id, linkedin_url, github_url, is_verified, is_github_verified").eq("id", id).single();
    if (fetchErr || !existing) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    if (existing.user_id !== user.id) return NextResponse.json({ error: "Forbidden: You do not own this testimonial." }, { status: 403 });

    const body = await req.json();
    const { name, role, message, linkedin_url, github_url } = body;

    // Validate
    if (!name || !role || !message || !linkedin_url) {
      return NextResponse.json({ error: "Name, Role, Message, and LinkedIn URL are required." }, { status: 400 });
    }
    if (!isValidLinkedInUrl(linkedin_url)) {
      return NextResponse.json({ error: "A valid LinkedIn profile URL is required." }, { status: 400 });
    }
    if (github_url && !isValidGithubUrl(github_url)) {
      return NextResponse.json({ error: "The provided GitHub URL is invalid." }, { status: 400 });
    }

    const linkedinChanged = existing.linkedin_url !== linkedin_url;
    const githubChanged = existing.github_url !== github_url;

    // Un-approve it on edit so admin checks it again
    const { error: updateErr } = await supabase.from("testimonials").update({
      name, role, message, linkedin_url, github_url,
      is_approved: false, // require re-approval
      is_verified: linkedinChanged ? false : existing.is_verified,
      is_github_verified: githubChanged ? false : existing.is_github_verified,
      updated_at: new Date().toISOString()
    }).eq("id", id);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    
    // Check ownership or admin
    const { data: existing, error: fetchErr } = await supabase.from("testimonials").select("user_id").eq("id", id).single();
    if (fetchErr || !existing) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    
    const isAdmin = user.email === process.env.ADMIN_EMAIL;
    if (existing.user_id !== user.id && !isAdmin) {
      return NextResponse.json({ error: "Forbidden: You do not have permission to delete this testimonial." }, { status: 403 });
    }

    // Soft Delete (Archive)
    const { error: deleteErr } = await supabase.from("testimonials").update({
      is_archived: true,
      updated_at: new Date().toISOString()
    }).eq("id", id);

    if (deleteErr) throw deleteErr;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
