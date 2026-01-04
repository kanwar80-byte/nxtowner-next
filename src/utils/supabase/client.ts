import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// ✅ Client-safe: must be static property access for Next to inline values
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function validateSupabaseEnvClient() {
  if (!SUPABASE_URL) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL\n" +
        "Set it in .env.local and restart the dev server."
    );
  }
  if (!SUPABASE_ANON_KEY) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY\n" +
        "Set it in .env.local and restart the dev server."
    );
  }
}

/**
 * Creates a Supabase client for browser-side use.
 * Validates required environment variables before creating the client.
 * 
 * @throws Error if NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing
 */
export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  validateSupabaseEnvClient();
  return createBrowserClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}

// Lazy-initialized client instance (validates on first access, not module load)
let _supabaseBrowser: SupabaseClient<Database> | null = null;

function getSupabaseBrowser(): SupabaseClient<Database> {
  if (!_supabaseBrowser) {
    _supabaseBrowser = createSupabaseBrowserClient();
  }
  return _supabaseBrowser;
}

// Export as getter to ensure lazy initialization
export const supabaseBrowser = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    return getSupabaseBrowser()[prop as keyof SupabaseClient<Database>];
  },
});

// Alias for backward compatibility
export const createClient = createSupabaseBrowserClient;
export const supabase = supabaseBrowser;
