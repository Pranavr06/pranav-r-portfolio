import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getClientIp, checkRateLimit, recordRateLimitAttempt } from "@/lib/rateLimiter";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const LIKE_RATE_LIMIT = {
  keyPrefix: "wall_note_like",
  maxAttempts: 30,
  windowMs: 5 * 60 * 1000 // 5 minutes
};

export async function POST(req: Request) {
  try {
    const rateCheck = await checkRateLimit(req, LIKE_RATE_LIMIT);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Too many likes! Please pause for a moment." }, { status: 429 });
    }

    const { note_id } = await req.json();
    if (!note_id) {
      return NextResponse.json({ error: "Note ID required." }, { status: 400 });
    }

    // Fetch current likes count
    const { data: note, error: fetchErr } = await supabase
      .from("wall_notes")
      .select("id, likes_count")
      .eq("id", note_id)
      .single();

    if (fetchErr || !note) {
      // Mock support for starter notes
      return NextResponse.json({ success: true, likes_count: 99 });
    }

    const newLikes = (note.likes_count || 0) + 1;

    const { error: updateErr } = await supabase
      .from("wall_notes")
      .update({ likes_count: newLikes })
      .eq("id", note_id);

    if (updateErr) {
      console.error("Error liking note:", updateErr);
      return NextResponse.json({ error: "Failed to update like." }, { status: 500 });
    }

    await recordRateLimitAttempt(req, LIKE_RATE_LIMIT, { note_id });

    return NextResponse.json({ success: true, likes_count: newLikes });
  } catch (err: any) {
    console.error("POST /api/wall/like error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
