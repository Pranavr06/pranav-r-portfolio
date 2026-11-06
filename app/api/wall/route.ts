import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getClientIp, hashIp, checkRateLimit, recordRateLimitAttempt } from "@/lib/rateLimiter";
import { logActivity } from "@/lib/activityLogger";
// @ts-ignore
import { clean } from "profanity-cleaner";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Stricter Rate Limit: 5 notes per 10 minutes per IP with 15-minute lockout
const WALL_RATE_LIMIT = {
  keyPrefix: "wall_note_post",
  maxAttempts: 5,
  windowMs: 10 * 60 * 1000,
  lockoutMs: 15 * 60 * 1000
};

const ALLOWED_COLORS = ["yellow", "pink", "green", "blue", "purple", "orange"];
const ALLOWED_EMOJIS = ["📌", "🚀", "💡", "🔥", "❤️", "☕", "💻", "🎉", "👾", "✨", "⭐", "⚡"];

const STARTER_NOTES = [
  {
    id: "starter-1",
    message: "Welcome to The Wall! Leave any comment, feedback, or shoutout here. No login required!",
    author_name: "Pranav R",
    color: "yellow",
    emoji: "📌",
    rotation: -1.5,
    likes_count: 12,
    is_pinned: true,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "starter-2",
    message: "Loved the YojanaSethu project showcase! Great architecture and real-time AI mock interview features. Keep building!",
    author_name: "Fellow Dev",
    color: "blue",
    emoji: "🚀",
    rotation: 2.1,
    likes_count: 8,
    is_pinned: false,
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: "starter-3",
    message: "The UI design on this portfolio is super smooth. Dark mode is very sleek.",
    author_name: "UI Enthusiast",
    color: "pink",
    emoji: "✨",
    rotation: -2.0,
    likes_count: 15,
    is_pinned: false,
    created_at: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: "starter-4",
    message: "First time checking out your work, the Zero-Knowledge Vaultary project is very clean!",
    author_name: "CyberSec Geek",
    color: "green",
    emoji: "💡",
    rotation: 1.2,
    likes_count: 6,
    is_pinned: false,
    created_at: new Date(Date.now() - 28800000).toISOString()
  }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const color = searchParams.get("color");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";

    let query = supabase
      .from("wall_notes")
      .select("id, message, author_name, color, emoji, rotation, likes_count, is_pinned, created_at")
      .or("is_archived.is.null,is_archived.eq.false");

    if (color && ALLOWED_COLORS.includes(color)) {
      query = query.eq("color", color);
    }

    if (search && search.trim()) {
      const cleanSearch = search.trim().slice(0, 50);
      query = query.or(`message.ilike.%${cleanSearch}%,author_name.ilike.%${cleanSearch}%`);
    }

    if (sort === "popular") {
      query = query.order("is_pinned", { ascending: false }).order("likes_count", { ascending: false });
    } else {
      query = query.order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
    }

    query = query.limit(120);

    const { data, error } = await query;

    if (error) {
      if (error.code === "PGRST205" || error.message.includes("does not exist")) {
        return NextResponse.json({
          notes: STARTER_NOTES,
          tableReady: false,
          hint: "Table 'wall_notes' not yet provisioned. Run scripts/create_wall_notes.sql in Supabase SQL Editor."
        });
      }
      console.error("Error fetching wall notes:", error);
      return NextResponse.json({ notes: STARTER_NOTES, tableReady: false });
    }

    return NextResponse.json({
      notes: data && data.length > 0 ? data : STARTER_NOTES,
      tableReady: true
    });
  } catch (err: any) {
    console.error("GET /api/wall error:", err);
    return NextResponse.json({ notes: STARTER_NOTES, tableReady: false });
  }
}

export async function POST(req: Request) {
  try {
    // 1. Origin / Referer Validation (Blocks cross-site and external bot POSTs)
    const origin = req.headers.get("origin") || req.headers.get("referer");
    if (origin) {
      const isAllowedHost =
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.includes("pranavr.netlify.app") ||
        origin.includes("pranavr");
      if (!isAllowedHost) {
        return NextResponse.json({ error: "Access denied. Cross-origin requests not allowed." }, { status: 403 });
      }
    }

    // 2. Anti-Spam Security Headers Verification
    const clientSig = req.headers.get("x-wall-client-sig");
    const clientTimeStr = req.headers.get("x-wall-client-time");

    if (clientSig !== "pranav-wall-v1") {
      return NextResponse.json(
        { error: "Security check failed. Please submit directly from the website." },
        { status: 403 }
      );
    }

    if (clientTimeStr) {
      const clientTime = parseInt(clientTimeStr, 10);
      const now = Date.now();
      // Allow +/- 10 minutes clock drift
      if (isNaN(clientTime) || Math.abs(now - clientTime) > 10 * 60 * 1000) {
        return NextResponse.json(
          { error: "Session expired. Please refresh the page and try again." },
          { status: 403 }
        );
      }
    }

    // 3. User-Agent Bot Filtering
    const userAgent = (req.headers.get("user-agent") || "").toLowerCase();
    const badBots = ["curl/", "python-requests", "postman", "go-http-client", "scrapy", "httpclient"];
    if (badBots.some(bot => userAgent.includes(bot))) {
      return NextResponse.json({ error: "Automated requests are blocked." }, { status: 403 });
    }

    // 4. Rate Limiter (5 notes per 10 mins per IP)
    const rateCheck = await checkRateLimit(req, WALL_RATE_LIMIT);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { 
          error: `Rate limit reached. Please wait ${Math.ceil((rateCheck.retryAfterSeconds || 600) / 60)} minute(s) before posting another note.` 
        }, 
        { status: 429 }
      );
    }

    const body = await req.json();
    const { message, author_name, color, emoji, website_url } = body;

    // 5. Honeypot Trap Check (Bot protection)
    if (website_url && typeof website_url === "string" && website_url.trim().length > 0) {
      return NextResponse.json({ error: "Bot activity detected." }, { status: 400 });
    }

    // 6. Validate Message
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Please write a message on your sticky note." }, { status: 400 });
    }

    const trimmedMsg = message.trim();
    if (trimmedMsg.length > 400) {
      return NextResponse.json({ error: "Note message is too long (maximum 400 characters)." }, { status: 400 });
    }

    // Clean profanity
    const sanitizedMsg = clean(trimmedMsg);

    // Validate Author Name
    let sanitizedAuthor = "Anonymous";
    if (author_name && typeof author_name === "string" && author_name.trim()) {
      sanitizedAuthor = clean(author_name.trim().slice(0, 35));
    }

    // Validate Color & Emoji
    const noteColor = color && ALLOWED_COLORS.includes(color) ? color : "yellow";
    const noteEmoji = emoji && ALLOWED_EMOJIS.includes(emoji) ? emoji : "📌";

    // Random subtle tilt angle (-2.8deg to +2.8deg)
    const randomRotation = Number(((Math.random() * 5.6) - 2.8).toFixed(1));

    const clientIp = getClientIp(req);
    const ip_hash = hashIp(clientIp);

    // 7. Duplicate Content Protection (Check if identical message was posted in last 10 minutes)
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { data: recentDup } = await supabase
        .from("wall_notes")
        .select("id")
        .eq("ip_hash", ip_hash)
        .eq("message", sanitizedMsg)
        .gte("created_at", tenMinutesAgo)
        .limit(1);

      if (recentDup && recentDup.length > 0) {
        return NextResponse.json(
          { error: "Duplicate note detected. You already stuck this exact note recently." },
          { status: 429 }
        );
      }
    } catch (dupErr) {
      // Ignore if table doesn't exist
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("wall_notes")
      .insert([
        {
          message: sanitizedMsg,
          author_name: sanitizedAuthor,
          color: noteColor,
          emoji: noteEmoji,
          rotation: randomRotation,
          likes_count: 0,
          is_pinned: false,
          is_archived: false,
          ip_hash
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST205" || error.message.includes("does not exist")) {
        return NextResponse.json(
          {
            error: "The wall database table is being initialized. Please run scripts/create_wall_notes.sql in Supabase SQL Editor.",
            tableReady: false
          },
          { status: 503 }
        );
      }
      console.error("DB Insert Error (wall_notes):", error);
      return NextResponse.json({ error: "Could not stick note to the wall. Please try again." }, { status: 500 });
    }

    // Record rate limit attempt
    await recordRateLimitAttempt(req, WALL_RATE_LIMIT, { author: sanitizedAuthor });

    // Log Activity to activity_logs
    await logActivity({
      type: "wall_note",
      action: "posted",
      title: `Sticky Note: ${sanitizedAuthor}`,
      ip_address: clientIp,
      user_agent: req.headers.get("user-agent"),
      status: "info",
      details: {
        note_id: data.id,
        color: noteColor,
        emoji: noteEmoji,
        length: sanitizedMsg.length
      }
    });

    return NextResponse.json({ success: true, note: data });
  } catch (err: any) {
    console.error("POST /api/wall error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
