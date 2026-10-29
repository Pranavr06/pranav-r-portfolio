import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getClientIp, hashIp, checkRateLimit, recordRateLimitAttempt } from "@/lib/rateLimiter";
import { logActivity } from "@/lib/activityLogger";
// @ts-ignore
import { isProfane, clean } from "profanity-cleaner";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY!;

const CONTACT_RATE_LIMIT = {
  keyPrefix: "contact_form",
  maxAttempts: 5,
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  lockoutMs: 24 * 60 * 60 * 1000,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, purpose, company, linkedin_url, github_url, source_page, source_type, source_slug, token, bot_field } = body;

    // Honeypot check
    if (bot_field) {
      return NextResponse.json({ error: "Bot detected" }, { status: 400 });
    }

    // Required fields check
    if (!name || !email || !message || !purpose || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify Turnstile Token
    const verifyFormData = new FormData();
    verifyFormData.append("secret", turnstileSecretKey);
    verifyFormData.append("response", token);

    const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: verifyFormData,
    });
    
    const turnstileData = await turnstileRes.json();
    if (!turnstileData.success) {
      return NextResponse.json({ error: "CAPTCHA verification failed." }, { status: 400 });
    }

    // Profanity Filter (sanitize)
    // Normalize and clean whitespace before filtering
    const cleanName = name.trim();
    const cleanMessage = message.trim();
    
    if (isProfane(cleanName) || isProfane(cleanMessage)) {
      return NextResponse.json({ error: "Message contains inappropriate language." }, { status: 400 });
    }

    // Generate Trusted IP Hash (Netlify Edge IP -> SHA-256)
    // Server-side rate limit cannot be reset by altering cookies or localStorage
    const clientIp = getClientIp(req);
    const ip_hash = hashIp(clientIp);

    // Rate Limiting Check (max 5 per IP per 24 hours)
    const rateCheck = await checkRateLimit(req, CONTACT_RATE_LIMIT);
    if (!rateCheck.allowed) {
      return NextResponse.json({ 
        error: rateCheck.error || "Submission limit reached (maximum 5 messages per 24 hours). Please try again later.",
        retryAfterSeconds: rateCheck.retryAfterSeconds 
      }, { status: 429 });
    }

    // Also double check direct submissions in contacts table for extra persistence
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("contacts")
      .select("*", { count: 'exact', head: true })
      .eq("ip_hash", ip_hash)
      .gte("created_at", oneDayAgo);

    if (countError) throw countError;

    if (count !== null && count >= 5) {
      await recordRateLimitAttempt(req, CONTACT_RATE_LIMIT, { reason: "db_count_exceeded" });
      return NextResponse.json({ error: "Rate limit exceeded (maximum 5 messages per 24 hours). Please try again later." }, { status: 429 });
    }

    // Insert into Supabase
    const { error: insertError } = await supabase.from("contacts").insert({
      name: cleanName,
      email: email.trim(),
      message: clean(cleanMessage), // Also clean the message just in case
      purpose,
      company: company ? company.trim() : null,
      linkedin_url: linkedin_url ? linkedin_url.trim() : null,
      github_url: github_url ? github_url.trim() : null,
      source_page,
      source_type,
      source_slug,
      ip_hash
    });

    if (insertError) throw insertError;

    // Log Activity with full attributes
    await logActivity({
      type: "message",
      action: "received",
      title: `New Inquiry: ${cleanName}`,
      email: email.trim(),
      ip_address: clientIp,
      user_agent: req.headers.get("user-agent"),
      status: "info",
      details: {
        purpose: purpose || undefined,
        company: company || undefined,
        source_page: source_page || undefined
      }
    });

    return NextResponse.json({ success: true, message: "Message sent successfully." });
    
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
