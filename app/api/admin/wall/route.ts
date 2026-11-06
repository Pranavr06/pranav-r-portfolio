import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkIsAdmin } from "@/lib/admin";
import { logActivity } from "@/lib/activityLogger";
import { getClientIp } from "@/lib/rateLimiter";
import { revalidatePath } from "next/cache";
import { clearBannedWordsCache, DEFAULT_BANNED_WORDS } from "@/lib/bannedWordsFilter";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  
  const userClient = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  const { data: { user }, error } = await userClient.auth.getUser();
  
  if (error || !user || !user.id) return null;

  if (await checkIsAdmin(supabase, user.id)) {
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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "all";
    const color = searchParams.get("color");

    let query = supabase.from("wall_notes").select("*");

    if (status === "active") {
      query = query.or("is_archived.is.null,is_archived.eq.false");
    } else if (status === "archived") {
      query = query.eq("is_archived", true);
    } else if (status === "pinned") {
      query = query.eq("is_pinned", true).or("is_archived.is.null,is_archived.eq.false");
    }

    if (color && color !== "all") {
      query = query.eq("color", color);
    }

    if (search && search.trim()) {
      const cleanSearch = search.trim().slice(0, 50);
      query = query.or(`message.ilike.%${cleanSearch}%,author_name.ilike.%${cleanSearch}%,ip_address.ilike.%${cleanSearch}%,location.ilike.%${cleanSearch}%`);
    }

    query = query.order("is_pinned", { ascending: false }).order("created_at", { ascending: false });

    const { data, error } = await query;

    // Fetch banned words list
    let bannedWords: any[] = [];
    try {
      const { data: wordsData } = await supabase
        .from("wall_banned_words")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (wordsData && wordsData.length > 0) {
        bannedWords = wordsData;
      } else {
        // Fallback default objects if table is newly empty
        bannedWords = DEFAULT_BANNED_WORDS.map((w, idx) => ({
          id: `default-${idx}`,
          word: w,
          created_at: new Date().toISOString(),
          created_by: "System Default"
        }));
      }
    } catch (e) {
      bannedWords = DEFAULT_BANNED_WORDS.map((w, idx) => ({
        id: `default-${idx}`,
        word: w,
        created_at: new Date().toISOString(),
        created_by: "System Default"
      }));
    }

    if (error) {
      if (error.code === "PGRST205" || error.message?.includes("does not exist")) {
        return NextResponse.json({ notes: [], bannedWords, tableReady: false });
      }
      throw error;
    }

    return NextResponse.json({ notes: data || [], bannedWords, tableReady: true });
  } catch (error: any) {
    console.error("Admin Wall API GET Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminUser = await verifyAdmin(req);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, id, noteData, word } = body;
    const clientIp = getClientIp(req);

    // 1. CREATE NOTE
    if (action === "create") {
      const { message, author_name, color, emoji, is_pinned } = noteData || {};
      if (!message || !message.trim()) {
        return NextResponse.json({ error: "Note message is required." }, { status: 400 });
      }

      const randomRotation = Number(((Math.random() * 5.6) - 2.8).toFixed(1));

      const { data, error } = await supabase
        .from("wall_notes")
        .insert([
          {
            message: message.trim(),
            author_name: author_name?.trim() || "Pranav R (Admin)",
            color: color || "yellow",
            emoji: emoji || "📌",
            rotation: randomRotation,
            likes_count: 0,
            is_pinned: !!is_pinned,
            is_archived: false,
            ip_hash: "admin",
            ip_address: clientIp,
            location: "Admin Panel",
            device_info: "Admin Session"
          }
        ])
        .select()
        .single();

      if (error) throw error;

      await logActivity({
        type: "wall_note",
        action: "created_by_admin",
        title: `Admin created note: ${author_name || "Admin"}`,
        ip_address: clientIp,
        user_agent: req.headers.get("user-agent"),
        status: "success",
        details: { note_id: data.id, pinned: !!is_pinned }
      });

      revalidatePath("/");
      revalidatePath("/wall");

      return NextResponse.json({ success: true, note: data });
    }

    // 2. UPDATE NOTE
    if (action === "update") {
      if (!id) return NextResponse.json({ error: "Note ID required." }, { status: 400 });

      const updates: any = {};
      if (noteData.message !== undefined) updates.message = noteData.message.trim();
      if (noteData.author_name !== undefined) updates.author_name = noteData.author_name.trim();
      if (noteData.color !== undefined) updates.color = noteData.color;
      if (noteData.emoji !== undefined) updates.emoji = noteData.emoji;
      if (noteData.is_pinned !== undefined) updates.is_pinned = noteData.is_pinned;
      if (noteData.likes_count !== undefined) updates.likes_count = noteData.likes_count;

      const { data, error } = await supabase
        .from("wall_notes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      await logActivity({
        type: "wall_note",
        action: "updated_by_admin",
        title: `Admin updated note: ${id}`,
        ip_address: clientIp,
        user_agent: req.headers.get("user-agent"),
        status: "info",
        details: { note_id: id, updates }
      });

      revalidatePath("/");
      revalidatePath("/wall");

      return NextResponse.json({ success: true, note: data });
    }

    // 3. TOGGLE PIN
    if (action === "toggle_pin") {
      if (!id) return NextResponse.json({ error: "Note ID required." }, { status: 400 });

      const { data: current } = await supabase
        .from("wall_notes")
        .select("is_pinned")
        .eq("id", id)
        .single();

      const newPinned = !current?.is_pinned;

      const { error } = await supabase
        .from("wall_notes")
        .update({ is_pinned: newPinned })
        .eq("id", id);

      if (error) throw error;

      revalidatePath("/");
      revalidatePath("/wall");

      return NextResponse.json({ success: true, is_pinned: newPinned });
    }

    // 4. SOFT DELETE / ARCHIVE
    if (action === "archive") {
      if (!id) return NextResponse.json({ error: "Note ID required." }, { status: 400 });

      const { error } = await supabase
        .from("wall_notes")
        .update({ is_archived: true })
        .eq("id", id);

      if (error) throw error;

      await logActivity({
        type: "wall_note",
        action: "archived",
        title: `Admin archived note: ${id}`,
        ip_address: clientIp,
        user_agent: req.headers.get("user-agent"),
        status: "warning",
        details: { note_id: id }
      });

      revalidatePath("/");
      revalidatePath("/wall");

      return NextResponse.json({ success: true });
    }

    // 5. RESTORE
    if (action === "restore") {
      if (!id) return NextResponse.json({ error: "Note ID required." }, { status: 400 });

      const { error } = await supabase
        .from("wall_notes")
        .update({ is_archived: false })
        .eq("id", id);

      if (error) throw error;

      revalidatePath("/");
      revalidatePath("/wall");

      return NextResponse.json({ success: true });
    }

    // 6. PERMANENT DELETE
    if (action === "delete") {
      if (!id) return NextResponse.json({ error: "Note ID required." }, { status: 400 });

      const { error } = await supabase
        .from("wall_notes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await logActivity({
        type: "wall_note",
        action: "deleted_permanently",
        title: `Admin permanently deleted note: ${id}`,
        ip_address: clientIp,
        user_agent: req.headers.get("user-agent"),
        status: "warning",
        details: { note_id: id }
      });

      revalidatePath("/");
      revalidatePath("/wall");

      return NextResponse.json({ success: true });
    }

    // 7. ADD BANNED WORD
    if (action === "add_banned_word") {
      if (!word || typeof word !== "string" || !word.trim()) {
        return NextResponse.json({ error: "Please enter a word or phrase to block." }, { status: 400 });
      }

      const cleanWord = word.trim().toLowerCase();

      const { data, error } = await supabase
        .from("wall_banned_words")
        .insert([
          {
            word: cleanWord,
            created_by: adminUser.email || "Admin"
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === "23505" || error.message?.includes("unique")) {
          return NextResponse.json({ error: `"${cleanWord}" is already on the blacklist.` }, { status: 400 });
        }
        if (error.code === "PGRST205" || error.message?.includes("does not exist")) {
          return NextResponse.json(
            { error: "Table 'wall_banned_words' not yet provisioned. Run scripts/create_wall_notes.sql in Supabase SQL Editor." },
            { status: 503 }
          );
        }
        throw error;
      }

      clearBannedWordsCache();

      await logActivity({
        type: "wall_moderation",
        action: "added_banned_word",
        title: `Admin added banned word: "${cleanWord}"`,
        ip_address: clientIp,
        user_agent: req.headers.get("user-agent"),
        status: "info",
        details: { word: cleanWord }
      });

      return NextResponse.json({ success: true, bannedWord: data });
    }

    // 8. DELETE BANNED WORD
    if (action === "delete_banned_word") {
      const wordToDelete = word || body.word;
      const idToDelete = id || body.id;

      if (!wordToDelete && !idToDelete) {
        return NextResponse.json({ error: "Word identifier required." }, { status: 400 });
      }

      let deleteQuery = supabase.from("wall_banned_words").delete();
      if (idToDelete && !idToDelete.startsWith("default-")) {
        deleteQuery = deleteQuery.eq("id", idToDelete);
      } else if (wordToDelete) {
        deleteQuery = deleteQuery.eq("word", wordToDelete.toLowerCase().trim());
      }

      const { error } = await deleteQuery;
      if (error && error.code !== "PGRST205") throw error;

      clearBannedWordsCache();

      await logActivity({
        type: "wall_moderation",
        action: "deleted_banned_word",
        title: `Admin removed banned word: "${wordToDelete || idToDelete}"`,
        ip_address: clientIp,
        user_agent: req.headers.get("user-agent"),
        status: "info",
        details: { word: wordToDelete, id: idToDelete }
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("Admin Wall API POST Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
