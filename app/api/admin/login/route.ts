import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, recordRateLimitAttempt, resetRateLimit, getClientIp } from "@/lib/rateLimiter";
import { checkIsAdmin, checkIsAdminByEmail } from "@/lib/admin";
import { logActivity } from "@/lib/activityLogger";

const RATE_LIMIT_CONFIG = {
  keyPrefix: "admin_login",
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes window
  lockoutMs: 15 * 60 * 1000 // 15 minutes lockout if exceeded
};

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const userAgent = req.headers.get("user-agent") || null;

  try {
    // 1. Enforce strict server-side rate limit
    // Cannot be reset by clearing cookies or localStorage
    const rateCheck = await checkRateLimit(req, RATE_LIMIT_CONFIG);
    if (!rateCheck.allowed) {
      await logActivity({
        type: "admin_login",
        action: "lockout_enforced",
        title: `Login Blocked (Rate Limit Active): ${ip}`,
        ip_address: ip,
        user_agent: userAgent,
        status: "blocked",
        details: {
          retryAfterSeconds: rateCheck.retryAfterSeconds,
          endpoint: "admin_login"
        }
      });

      return NextResponse.json(
        { 
          error: rateCheck.error || "Too many failed login attempts. Device locked for 15 minutes.",
          retryAfterSeconds: rateCheck.retryAfterSeconds 
        },
        { 
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfterSeconds || 900)
          }
        }
      );
    }

    const body = await req.json();
    const { email, password, action } = body;

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // 2. Handle Password Reset Request
    if (action === "reset") {
      if (!email || !email.trim()) {
        return NextResponse.json({ error: "Email is required." }, { status: 400 });
      }

      const cleanResetEmail = email.trim();
      const isAdminEmail = await checkIsAdminByEmail(supabase, cleanResetEmail);
      if (!isAdminEmail) {
        await logActivity({
          type: "admin_login",
          action: "reset_unauthorized",
          title: `Password Reset Denied (Non-Admin): ${cleanResetEmail}`,
          email: cleanResetEmail,
          ip_address: ip,
          user_agent: userAgent,
          status: "failed",
          details: { reason: "non_admin_email" }
        });

        // Do not reveal email existence to unauthorized callers
        return NextResponse.json({ error: "Unauthorized: Account does not have admin privileges." }, { status: 403 });
      }

      const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pranavr.netlify.app";
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(cleanResetEmail, {
        redirectTo: `${siteUrl}/admin/update-password`,
      });

      if (resetErr) {
        await logActivity({
          type: "admin_login",
          action: "reset_failed",
          title: `Password Reset Failed: ${cleanResetEmail}`,
          email: cleanResetEmail,
          ip_address: ip,
          user_agent: userAgent,
          status: "failed",
          details: { error: resetErr.message }
        });

        return NextResponse.json({ error: resetErr.message }, { status: 400 });
      }

      await logActivity({
        type: "admin_login",
        action: "reset_requested",
        title: `Password Reset Requested: ${cleanResetEmail}`,
        email: cleanResetEmail,
        ip_address: ip,
        user_agent: userAgent,
        status: "success",
        details: { endpoint: "reset_password" }
      });

      return NextResponse.json({ success: true, message: "Password reset link sent to registered email." });
    }

    // 3. Handle Standard Password Login
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const cleanEmail = email.trim();

    // Verify admin email authorization first
    const isAuthorized = await checkIsAdminByEmail(supabase, cleanEmail);
    if (!isAuthorized) {
      await recordRateLimitAttempt(req, RATE_LIMIT_CONFIG, { email: cleanEmail, reason: "non_admin_email" });
      const currentRate = await checkRateLimit(req, RATE_LIMIT_CONFIG);
      return NextResponse.json(
        { 
          error: `Invalid credentials. ${currentRate.remainingAttempts} attempt(s) remaining before lockout.` 
        }, 
        { status: 401 }
      );
    }

    // Attempt Supabase authentication on the server
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (authErr || !authData.user) {
      await recordRateLimitAttempt(req, RATE_LIMIT_CONFIG, { email: cleanEmail, reason: "invalid_password" });
      const currentRate = await checkRateLimit(req, RATE_LIMIT_CONFIG);
      return NextResponse.json(
        { 
          error: `Invalid credentials. ${currentRate.remainingAttempts} attempt(s) remaining before lockout.` 
        }, 
        { status: 401 }
      );
    }

    // Final security confirmation: Check profile admin flag
    const isAdmin = await checkIsAdmin(supabase, authData.user.id);
    if (!isAdmin) {
      await recordRateLimitAttempt(req, RATE_LIMIT_CONFIG, { email: cleanEmail, reason: "profile_not_admin" });
      return NextResponse.json({ error: "Unauthorized access: Administrator role required." }, { status: 403 });
    }

    // Login successful: Reset rate limit for this IP
    await resetRateLimit(req, RATE_LIMIT_CONFIG);

    // Log successful admin login with full attributes
    await logActivity({
      type: "admin_login",
      action: "success",
      title: `Admin Login: ${cleanEmail}`,
      email: cleanEmail,
      ip_address: ip,
      user_agent: userAgent,
      status: "success",
      details: {
        userId: authData.user.id,
        role: "admin",
        method: "password"
      }
    });

    return NextResponse.json({
      success: true,
      session: authData.session,
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    });

  } catch (err: any) {
    console.error("Admin Login Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
