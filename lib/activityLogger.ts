import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface LogActivityParams {
  type: string;
  action: string;
  title: string;
  description?: string | null;
  email?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  status?: "success" | "failed" | "warning" | "blocked" | "info" | string;
  details?: Record<string, any> | null;
}

let cachedAdminClient: SupabaseClient | null = null;

function getAdminClient(): SupabaseClient | null {
  if (cachedAdminClient) return cachedAdminClient;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    cachedAdminClient = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false }
    });
    return cachedAdminClient;
  }

  return null;
}

/**
 * Universal activity logger.
 * Attempts to persist full attributes (email, ip_address, user_agent, status, details).
 * Gracefully falls back to storing them inside `description` if the database columns
 * haven't been provisioned yet via the SQL migration.
 */
export async function logActivity(
  params: LogActivityParams,
  client?: SupabaseClient
): Promise<boolean> {
  try {
    const supabase = client || getAdminClient();
    if (!supabase) {
      console.warn("[activityLogger] Supabase client unavailable. Skipping log.");
      return false;
    }

    const {
      type,
      action,
      title,
      description,
      email,
      ip_address,
      user_agent,
      status,
      details
    } = params;

    // Serialize details/meta into description if description is not explicitly provided
    const serializedDesc =
      description ||
      (details || email || ip_address
        ? JSON.stringify({
            email: email || undefined,
            ip: ip_address || undefined,
            user_agent: user_agent || undefined,
            status: status || undefined,
            ...details
          })
        : null);

    // Primary attempt: Insert with dedicated columns
    const fullPayload: Record<string, any> = {
      type,
      action,
      title,
      description: serializedDesc,
      email: email || null,
      ip_address: ip_address || null,
      user_agent: user_agent || null,
      status: status || null,
      details: details || null
    };

    const { error: fullError } = await supabase.from("activity_logs").insert([fullPayload]);

    if (!fullError) {
      return true;
    }

    // Fallback attempt: If schema lacks the new columns, insert legacy compatible schema
    const fallbackPayload: Record<string, any> = {
      type,
      action,
      title,
      description: serializedDesc
    };

    const { error: fallbackError } = await supabase.from("activity_logs").insert([fallbackPayload]);

    if (fallbackError) {
      console.error("[activityLogger] Failed to log activity:", fallbackError.message);
      return false;
    }

    return true;
  } catch (err: any) {
    console.error("[activityLogger] Unexpected logging error:", err?.message || err);
    return false;
  }
}
