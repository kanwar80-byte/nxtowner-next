import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { recordEventServer } from "@/lib/analytics/server";
import { randomUUID } from "crypto";

const SESSION_COOKIE_NAME = "nx_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

/**
 * POST /api/events
 * Records an event to events table.
 * 
 * Body: {
 *   event_name: string (required)
 *   path?: string
 *   referrer?: string
 *   listing_id?: string
 *   properties?: Record<string, any>
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_name, path, referrer, listing_id, properties } = body;

    if (!event_name || typeof event_name !== "string") {
      return NextResponse.json(
        { error: "event_name is required and must be a string" },
        { status: 400 }
      );
    }

    // Get or create session ID from cookie
    const cookieStore = await cookies();
    let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      sessionId = randomUUID();
      cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: SESSION_MAX_AGE,
        path: "/",
      });
    }

    // Get user_id from auth if available
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    } catch {
      // Not authenticated - that's fine, userId will be null
    }

    // Get referrer from request headers if not provided
    const referrerHeader = request.headers.get("referer") || request.headers.get("referrer");
    const finalReferrer = referrer || referrerHeader || null;

    // Get path from request URL if not provided
    const finalPath = path || new URL(request.url).pathname;

    // Record event using service role (non-blocking - never break request flow)
    try {
      await recordEventServer({
        event_name,
        user_id: userId,
        session_id: sessionId,
        path: finalPath,
        referrer: finalReferrer,
        listing_id: listing_id || null,
        properties: properties || {},
      });
    } catch (error) {
      // Analytics failures should never break the request flow
      // Only log if debug flag is explicitly enabled
      if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === "1") {
        console.warn("[POST /api/events] Failed to record event (non-blocking):", error);
      }
    }

    // Always return success (204) - analytics is non-blocking
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // Only catch unexpected errors in request parsing/validation
    console.error("[POST /api/events] Unexpected error:", error);
    // Still return 204 to keep analytics non-blocking
    return new NextResponse(null, { status: 204 });
  }
}

