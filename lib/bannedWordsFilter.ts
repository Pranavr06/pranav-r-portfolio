import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let cachedBannedWords: string[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

// Default starter blacklist in case database table hasn't been provisioned yet
export const DEFAULT_BANNED_WORDS = [
  "scam",
  "telegram group",
  "whatsapp group",
  "free money",
  "click here to earn",
  "casino",
  "lottery winner",
  "dm for promo",
  "free followers"
];

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function clearBannedWordsCache() {
  cachedBannedWords = null;
  lastCacheTime = 0;
}

/**
 * Fetch active banned words from the Supabase database with in-memory TTL caching.
 */
export async function getBannedWords(client?: SupabaseClient): Promise<string[]> {
  const now = Date.now();
  if (cachedBannedWords && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedBannedWords;
  }

  try {
    const supabase = client || createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase
      .from("wall_banned_words")
      .select("word")
      .order("created_at", { ascending: false });

    if (error || !data) {
      cachedBannedWords = DEFAULT_BANNED_WORDS;
    } else {
      const dbWords = data.map((d: any) => d.word.trim().toLowerCase()).filter(Boolean);
      // Merge unique with defaults
      const combined = Array.from(new Set([...DEFAULT_BANNED_WORDS, ...dbWords]));
      cachedBannedWords = combined;
    }
  } catch (e) {
    cachedBannedWords = DEFAULT_BANNED_WORDS;
  }

  lastCacheTime = now;
  return cachedBannedWords;
}

export interface BannedWordCheckResult {
  blocked: boolean;
  matchedWord?: string;
}

/**
 * Inspects content against the list of banned words/phrases.
 * Supports exact word boundary matching for single words (to prevent false positives like
 * "cryptographic" matching "crypto") and substring matching for multi-word phrases.
 */
export function checkTextAgainstBannedWords(
  text: string,
  bannedWords: string[]
): BannedWordCheckResult {
  if (!text || !text.trim() || !bannedWords || bannedWords.length === 0) {
    return { blocked: false };
  }

  const cleanText = text.toLowerCase().trim();

  // Basic normalization for common leetspeak evasions
  const normalizedText = cleanText
    .replace(/@/g, "a")
    .replace(/\$/g, "s")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/!/g, "i");

  for (const rawBw of bannedWords) {
    const bw = rawBw.trim().toLowerCase();
    if (!bw) continue;

    // Multi-word phrase check (e.g. "free money", "whatsapp group")
    if (bw.includes(" ")) {
      if (cleanText.includes(bw) || normalizedText.includes(bw)) {
        return { blocked: true, matchedWord: rawBw };
      }
    } else {
      // Single word: use word boundaries \b to avoid blocking "cryptography" if "crypto" is banned
      const regex = new RegExp(`\\b${escapeRegex(bw)}\\b`, "i");
      if (regex.test(cleanText) || regex.test(normalizedText)) {
        return { blocked: true, matchedWord: rawBw };
      }
    }
  }

  return { blocked: false };
}
