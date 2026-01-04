import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createClient as createSupabaseClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import type { Database, Json } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const SESSION_COOKIE_NAME = "nx_session";

/**
 * Creates a Supabase client with service role key (bypasses RLS).
 * Used for inserting events into events table.
 */
export function getServiceSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export type EventPayload = {
  event_name: string;
  user_id?: string | null;
  session_id: string;
  path?: string | null;
  referrer?: string | null;
  listing_id?: string | null;
  properties?: Record<string, unknown>;
};

type BasePayload = {
  user_id: string | null;
  session_id: string;
  path: string | null;
  referrer: string | null;
  listing_id: string | null;
  properties: Record<string, unknown>;
};

// Events table uses 'type' (enum) and 'actor_id', not 'event_name' and 'user_id'
// Store additional data in payload JSON
type EventsInsertPayload = {
  type: Database["public"]["Enums"]["event_type"];
  actor_id: string | null;
  listing_id: string | null;
  deal_room_id: string | null;
  payload: Json;
};

/**
 * Records an event to the events table using service role.
 * Maps EventPayload to events table schema.
 */
export async function recordEventServer(payload: EventPayload): Promise<void> {
  const supabase = getServiceSupabaseClient();

  // Map event_name to type enum (use a safe default if not in enum)
  // Common event names: 'page_view', 'listing_view', 'cta_click', etc.
  const eventType = payload.event_name as Database["public"]["Enums"]["event_type"];

  // Store session_id, path, referrer, properties in payload JSON
  const eventPayload: Json = {
    session_id: payload.session_id,
    path: payload.path || null,
    referrer: payload.referrer || null,
    ...payload.properties,
  };

  const insertPayload: EventsInsertPayload = {
    type: eventType,
    actor_id: payload.user_id || null,
    listing_id: payload.listing_id || null,
    deal_room_id: null,
    payload: eventPayload,
  };

  const { error } = await supabase.from("events").insert(insertPayload);

  // If still error, completely swallow it (analytics should never break the app)
  // Only log if debug flag is explicitly enabled
  if (error) {
    if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === "1") {
      console.warn("[recordEventServer] Failed to insert analytics event (non-blocking):", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
    }
    // Don't throw - we don't want event tracking to break the app
  }
}

/**
 * Helper for server actions to record events.
 * Gets session_id from cookie and user_id from auth context.
 */
export async function trackEventFromServer(
  event_name: string,
  options: {
    listing_id?: string;
    properties?: Record<string, unknown>;
  } = {}
): Promise<void> {
  try {
    // Get or create session ID from cookie
    const cookieStore = await cookies();
    let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      sessionId = randomUUID();
      cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
    }

    // Get user_id from auth
    let userId: string | null = null;
    try {
      const supabase = await createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    } catch {
      // Not authenticated - that's fine
    }

    await recordEventServer({
      event_name,
      user_id: userId,
      session_id: sessionId,
      listing_id: options.listing_id || null,
      properties: options.properties || {},
    });
  } catch (error) {
    // Silently fail - never break the app
    if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === "1") {
      console.warn("[trackEventFromServer] Failed to log event:", event_name, error);
    }
  }
}

