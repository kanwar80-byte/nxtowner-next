import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database";

export function supabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient<Database>(url, anon, {
    auth: { persistSession: false },
    global: {
      headers: {
        // Helps avoid CDN cache fragmentation
        "X-Client-Info": "nxtowner-public",
      },
    },
  });
}
