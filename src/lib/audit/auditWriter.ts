import "server-only";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export type AuditWriteInput = {
  action: string;
  entityType: string;
  entityId?: string | null;
  summary?: string | null;
  metadata?: Record<string, any>;
};

/**
 * Writes an audit event to the audit_events table.
 * Only works for authenticated admin users (RLS enforced).
 * Never throws - swallows errors to avoid breaking the app.
 */
export async function writeAuditEvent(input: AuditWriteInput): Promise<void> {
  try {
    const supabase = await createClient();
    const sb: any = supabase;

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      // Not authenticated - silently fail
      if (process.env.NODE_ENV === "development") {
        console.warn("[writeAuditEvent] Not authenticated, skipping audit event");
      }
      return;
    }

    // Get user profile to determine role
    let actorRole: string | null = null;
    try {
      const { data: profile } = await sb
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      actorRole = profile?.role || null;
    } catch {
      // Profile lookup failed - continue without role
    }

    // Get IP and user agent from headers (optional)
    let ipAddress: string | null = null;
    let userAgent: string | null = null;
    try {
      const headersList = await headers();
      ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || null;
      userAgent = headersList.get("user-agent") || null;
    } catch {
      // Headers not available - continue without
    }

    // Insert audit event (RLS will enforce admin-only)
    const { error } = await sb.from("audit_events").insert({
      actor_user_id: user.id,
      actor_role: actorRole,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId || null,
      summary: input.summary || null,
      metadata: input.metadata || {},
      ip: ipAddress || null,
      user_agent: userAgent || null,
    });

    if (error) {
      // RLS might block non-admins - that's expected, don't log as error
      if (process.env.NODE_ENV === "development") {
        console.warn("[writeAuditEvent] Failed to insert audit event:", error.message);
      }
      return;
    }
  } catch (error) {
    // Swallow all errors - never break the app
    if (process.env.NODE_ENV === "development") {
      console.warn("[writeAuditEvent] Unexpected error:", error);
    }
  }
}


