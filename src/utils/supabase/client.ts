
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const supabaseBrowser = createSupabaseBrowserClient();

export const createClient = createSupabaseBrowserClient;
export const supabase = supabaseBrowser;
