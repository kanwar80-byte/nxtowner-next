import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

// ✅ Server-safe: must be static property access for Next to inline values
const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Validates required Supabase environment variables at runtime.
 * Throws a clear error if any are missing.
 */
function validateSupabaseEnv() {
  if (!NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL\n" +
      "Set it in .env.local and restart the dev server."
    );
  }
  if (!NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY\n" +
      "Set it in .env.local and restart the dev server."
    );
  }
  return { url: NEXT_PUBLIC_SUPABASE_URL, anonKey: NEXT_PUBLIC_SUPABASE_ANON_KEY };
}

/**
 * Creates a Supabase client for server-side use (Next.js App Router).
 * Validates required environment variables before creating the client.
 * 
 * @throws Error if NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing
 */
export async function createClient(): Promise<SupabaseClient<Database>> {
  const { url, anonKey } = validateSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
