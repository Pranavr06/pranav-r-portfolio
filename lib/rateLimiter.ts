import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLogger";

// Extract trusted client IP from Netlify edge or proxy headers
export function getClientIp(req: Request): string {
  // 1. Netlify trusted client IP (cannot be spoofed from client)
  const nfIp = req.headers.get("x-nf-client-connection-ip");
  if (nfIp && nfIp.trim()) return nfIp.trim();

  // 2. Cloudflare / Reverse Proxy trusted headers
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp && cfIp.trim()) return cfIp.trim();

  const realIp = req.headers.get("x-real-ip");
  if (realIp && realIp.trim()) return realIp.trim();

  const clientIp = req.headers.get("client-ip");
  if (clientIp && clientIp.trim()) return clientIp.trim();

  // 3. Fallback to right-most or first valid x-forwarded-for
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor && forwardedFor.trim()) {
    // When behind proxies, take the first valid IP
    const parts = forwardedFor.split(",").map(p => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[0];
  }

  return "127.0.0.1";
}

export function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip.trim().toLowerCase()).digest("hex");
}

// In-memory sliding window cache for ultra-fast rejection across rapid hits
interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Cleanup stale memory records every 10 minutes
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (record.lockedUntil && record.lockedUntil > now) continue;
      // Stale if last attempt > 24 hours ago
      if (now - record.lastAttempt > 24 * 60 * 60 * 1000) {
        memoryStore.delete(key);
      }
    }
  }, 10 * 60 * 1000);
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

export interface RateLimitOptions {
  keyPrefix: string; // e.g. "admin_login", "contact_form"
  maxAttempts: number; // e.g. 5
  windowMs: number; // e.g. 15 * 60 * 1000 (15 min)
  lockoutMs?: number; // e.g. 15 * 60 * 1000 (cooldown if exceeded)
}

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  totalAttempts: number;
  retryAfterSeconds?: number;
  error?: string;
}

/**
 * Server-side rate limiter.
 * Guaranteed: Changing cookies, clearing localStorage, or modifying client headers cannot reset it.
 */
export async function checkRateLimit(
  req: Request,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const ip = getClientIp(req);
  const ipHash = hashIp(ip);
  const storeKey = `${options.keyPrefix}:${ipHash}`;
  const now = Date.now();

  const lockoutDuration = options.lockoutMs || options.windowMs;

  // 1. Check in-memory state first
  let record = memoryStore.get(storeKey);

  if (record) {
    // Check if currently locked out
    if (record.lockedUntil && record.lockedUntil > now) {
      const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        totalAttempts: record.count,
        retryAfterSeconds,
        error: `Too many attempts. You have been locked out for ${Math.ceil(retryAfterSeconds / 60)} minute(s). Please try again later.`
      };
    }

    // Reset window if past window duration and not locked
    if (now - record.firstAttempt > options.windowMs && (!record.lockedUntil || record.lockedUntil <= now)) {
      record = {
        count: 0,
        firstAttempt: now,
        lastAttempt: now,
        lockedUntil: null
      };
      memoryStore.set(storeKey, record);
    }
  }

  // 2. Persistent Database Check via Supabase service_role
  // Ensures persistence across separate serverless lambda instances
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey);
      const windowStart = new Date(now - options.windowMs).toISOString();

      const { count: dbAttempts, error: dbErr } = await supabase
        .from("activity_logs")
        .select("*", { count: "exact", head: true })
        .eq("type", `rate_limit:${options.keyPrefix}`)
        .or(`ip_address.eq.${ip},title.eq.${ipHash},description.ilike.%${ipHash}%`)
        .gte("created_at", windowStart);

      if (!dbErr && dbAttempts !== null && dbAttempts >= options.maxAttempts) {
        // Enforce lockout
        const lockUntil = now + lockoutDuration;
        memoryStore.set(storeKey, {
          count: dbAttempts,
          firstAttempt: now - options.windowMs,
          lastAttempt: now,
          lockedUntil: lockUntil
        });

        const retryAfterSeconds = Math.ceil(lockoutDuration / 1000);
        return {
          allowed: false,
          remainingAttempts: 0,
          totalAttempts: dbAttempts,
          retryAfterSeconds,
          error: `Too many attempts detected. Locked out for ${Math.ceil(retryAfterSeconds / 60)} minute(s).`
        };
      }
    }
  } catch (err) {
    // Fallback gracefully to in-memory state if DB check fails
  }

  const currentCount = record ? record.count : 0;
  const remaining = Math.max(0, options.maxAttempts - currentCount);

  return {
    allowed: currentCount < options.maxAttempts,
    remainingAttempts: remaining,
    totalAttempts: currentCount
  };
}

/**
 * Record an attempt (failed login or form submission).
 */
export async function recordRateLimitAttempt(
  req: Request,
  options: RateLimitOptions,
  meta?: Record<string, any>
): Promise<void> {
  const ip = getClientIp(req);
  const ipHash = hashIp(ip);
  const storeKey = `${options.keyPrefix}:${ipHash}`;
  const now = Date.now();
  const lockoutDuration = options.lockoutMs || options.windowMs;

  let record = memoryStore.get(storeKey);
  if (!record || (now - record.firstAttempt > options.windowMs && !record.lockedUntil)) {
    record = {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
      lockedUntil: null
    };
  } else {
    record.count += 1;
    record.lastAttempt = now;
  }

  if (record.count >= options.maxAttempts) {
    record.lockedUntil = now + lockoutDuration;
  }

  memoryStore.set(storeKey, record);

  // Persist attempt to Supabase activity_logs
  try {
    const email = meta?.email ? String(meta.email) : null;
    const userAgent = req.headers.get("user-agent") || null;
    const isLockout = record.count >= options.maxAttempts;

    const displayTitle = email
      ? `Login Attempt: ${email} (${ip})`
      : `Rate Limit: ${options.keyPrefix} (${ip})`;

    await logActivity({
      type: `rate_limit:${options.keyPrefix}`,
      action: isLockout ? "lockout_triggered" : "attempt_recorded",
      title: displayTitle,
      email,
      ip_address: ip,
      user_agent: userAgent,
      status: isLockout ? "blocked" : "warning",
      details: {
        endpoint: options.keyPrefix,
        attempt: record.count,
        maxAttempts: options.maxAttempts,
        ipHash,
        meta: meta || {}
      }
    });
  } catch (err) {
    // Log failure quietly without breaking caller
    console.error("Failed to persist rate limit attempt:", err);
  }
}

/**
 * Reset rate limit counter on a successful action (e.g., successful login).
 */
export async function resetRateLimit(
  req: Request,
  options: RateLimitOptions
): Promise<void> {
  const ip = getClientIp(req);
  const ipHash = hashIp(ip);
  const storeKey = `${options.keyPrefix}:${ipHash}`;

  memoryStore.delete(storeKey);

  // Clear from database activity_logs
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey);
      await supabase
        .from("activity_logs")
        .delete()
        .eq("type", `rate_limit:${options.keyPrefix}`)
        .or(`ip_address.eq.${ip},title.eq.${ipHash},description.ilike.%${ipHash}%`);
    }
  } catch (err) {
    console.error("Failed to clear DB rate limit:", err);
  }
}
