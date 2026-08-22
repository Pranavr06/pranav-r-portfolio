import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Checks if a given user is an administrator by querying the profiles table.
 */
export const checkIsAdmin = async (supabase: SupabaseClient, userId: string | undefined | null): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();
      
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    return data?.is_admin === true;
  } catch (err) {
    console.error("Error in checkIsAdmin:", err);
    return false;
  }
};

/**
 * Checks if a given user is an administrator by email (useful for password resets).
 */
export const checkIsAdminByEmail = async (supabase: SupabaseClient, email: string | undefined | null): Promise<boolean> => {
  if (!email) return false;
  
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .ilike("email", email)
      .single();
      
    if (error) {
      console.error("Error checking admin status by email:", error);
      return false;
    }
    
    return data?.is_admin === true;
  } catch (err) {
    console.error("Error in checkIsAdminByEmail:", err);
    return false;
  }
};
