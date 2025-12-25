import type { Database } from "@/types/database";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

/**
 * Compatibility export: code expects createClient()
 * This returns the admin client or throws with a clear message.
 */
export const createClient = () => {
  if (!supabaseAdmin) {
    throw new Error(
      "Supabase admin client not available. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return supabaseAdmin;
};
