import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
// @ts-ignore
import { isProfane, clean } from "profanity-cleaner";
import { isValidLinkedInUrl, isValidGithubUrl } from "@/lib/validators";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Normalize string for duplicate detection (removes whitespace, punctuation, sets lowercase)
const normalize = (str: string) => str.toLowerCase().replace(/[\W_]+/g, "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, message, linkedin_url, github_url, avatar_url, provider, token, user_id } = body;

    // 1. Verify Turnstile token
    if (!token) {
      return NextResponse.json({ error: "CAPTCHA token is missing" }, { status: 400 });
    }

    // 1.5 Validate URLs
    if (!linkedin_url || !isValidLinkedInUrl(linkedin_url)) {
      return NextResponse.json({ error: "A valid LinkedIn profile URL is required." }, { status: 400 });
    }
    
    if (github_url && !isValidGithubUrl(github_url)) {
      return NextResponse.json({ error: "The provided GitHub URL is invalid." }, { status: 400 });
    }

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret && turnstileSecret !== "dummy_secret_key") { // Allow bypass if secret is not set properly for dev
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${turnstileSecret}&response=${token}`,
      });
      const verifyData = await verifyRes.json();
      
      if (!verifyData.success) {
        return NextResponse.json({ error: "CAPTCHA verification failed" }, { status: 400 });
      }
    }

    // 2. Hash IP for privacy & rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const ip_hash = crypto.createHash("sha256").update(ip).digest("hex");

    // 3. Rate Limiting (max 3 per 24 hours per IP)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("testimonials")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ip_hash)
      .gte("created_at", twentyFourHoursAgo);

    if (countError) {
      console.error("Rate limit check error:", countError);
    } else if (count !== null && count >= 3) {
      return NextResponse.json({ error: "Rate limit exceeded. Maximum 3 submissions per day." }, { status: 429 });
    }

    // 4. Duplicate Detection
    const normalizedMessage = normalize(message);

    const { data: existingTestimonials, error: existingError } = await supabase
      .from("testimonials")
      .select("message")
      .eq("user_id", user_id);

    if (!existingError && existingTestimonials) {
      for (const t of existingTestimonials) {
        if (normalize(t.message) === normalizedMessage) {
          return NextResponse.json({ error: "Duplicate testimonial detected." }, { status: 400 });
        }
      }
    }

    // 5. Profanity Filtering
    let cleanName = name;
    let cleanRole = role;
    let cleanMessage = message;

    try {
      cleanName = clean(name);
      cleanRole = clean(role);
      cleanMessage = clean(message);
    } catch (e) {
      // bad-words throws if it's completely empty or similar edge cases, fallback to original
    }

    if (cleanMessage !== message) {
      // Found profanity, you can choose to reject it here, but we'll just sanitize it and keep it pending
      // return NextResponse.json({ error: "Inappropriate language detected." }, { status: 400 });
    }

    // 6. Database Insertion
    const { error: insertError } = await supabase.from("testimonials").insert([
      {
        user_id,
        name: cleanName,
        email,
        role: cleanRole,
        message: cleanMessage,
        linkedin_url,
        github_url,
        avatar_url,
        provider,
        ip_hash,
        is_approved: false, // Explicitly set to false (Pending Admin Review)
      }
    ]);

    if (insertError) {
      console.error("DB Insert Error:", insertError);
      return NextResponse.json({ error: "Failed to save testimonial. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Testimonial submitted successfully and is pending review." });

  } catch (error) {
    console.error("Testimonial Submission Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
