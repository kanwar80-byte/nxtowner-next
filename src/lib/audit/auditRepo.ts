import "server-only";
import { createClient } from "@/utils/supabase/server";
import { AuditEvent, AuditFilters, AuditAction } from "./types";

export type AuditEventsResult = {
  events: AuditEvent[];
  status: "ok" | "unavailable";
  message?: string;
};

/**
 * Check if an error indicates the table is unavailable (missing or RLS blocked).
 */
function isUnavailableError(error: any): boolean {
  if (!error) return false;

  // Handle empty objects or errors without standard properties
  // If error is an empty object or has no useful properties, treat as unavailable
  if (typeof error === 'object' && Object.keys(error).length === 0) {
    return true;
  }

  // PostgreSQL error codes
  const unavailableCodes = ['42P01', '42501', 'P0001', 'PGRST301']; // relation does not exist, insufficient privilege, etc.
  if (error.code && unavailableCodes.includes(error.code)) {
    return true;
  }

  // Check error message for common patterns
  const message = (error.message || error.msg || JSON.stringify(error) || '').toLowerCase();
  const unavailablePatterns = [
    'does not exist',
    'permission denied',
    'violates row-level security',
    'insufficient privilege',
    'relation "audit_events"',
    'new row violates row-level security',
    'policy violation',
    'access denied',
  ];

  if (unavailablePatterns.some(pattern => message.includes(pattern))) {
    return true;
  }

  // If error has no code and no message, it's likely an RLS/permission issue
  // (Supabase sometimes returns empty errors for RLS blocks)
  if (!error.code && !error.message && !error.msg) {
    return true;
  }

  return false;
}

/**
 * Read audit events from audit_events table.
 * Returns status indicator for UI resilience.
 */
export async function getAuditEvents(filters: AuditFilters = {}): Promise<AuditEventsResult> {
  const supabase = await createClient();
  const sb: any = supabase;

  try {
    let query = sb
      .from('audit_events')
      .select('*')
      .order('created_at', { ascending: false });

    // Actor filter (map to actor_user_id in new schema)
    if (filters.actor_id) {
      query = query.eq('actor_user_id', filters.actor_id);
    }

    // Action filter
    if (filters.action && filters.action !== 'all') {
      query = query.eq('action', filters.action);
    }

    // Entity type filter
    if (filters.entity_type) {
      query = query.eq('entity_type', filters.entity_type);
    }

    // Date range filters
    if (filters.start_date) {
      query = query.gte('created_at', filters.start_date);
    }
    if (filters.end_date) {
      query = query.lte('created_at', filters.end_date);
    }

    // Pagination
    const limit = filters.limit || 100;
    const offset = filters.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      // Check if this is an expected "unavailable" error
      if (isUnavailableError(error)) {
        // Don't log - this is expected when table doesn't exist or RLS blocks access
        return {
          events: [],
          status: "unavailable",
          message: "Audit log not configured",
        };
      }
      // Only log truly unexpected errors (has code/message but not in our unavailable list)
      if (process.env.NODE_ENV === "development") {
        console.warn("[getAuditEvents] Unexpected error:", error);
      }
      return {
        events: [],
        status: "unavailable",
        message: "Unable to load audit events",
      };
    }

    if (!data) {
      return {
        events: [],
        status: "ok",
      };
    }

    // Enrich with actor info if available
    // Map from new schema (actor_user_id) to old type shape (actor_id) for backward compatibility
    const enrichedEvents: AuditEvent[] = [];
    const actorIds = [...new Set(data.map((e: any) => e.actor_user_id || e.actor_id).filter(Boolean))];

    const actorMap = new Map<string, { email: string | null; full_name: string | null }>();
    if (actorIds.length > 0) {
      try {
        const { data: profiles } = await sb
          .from('profiles')
          .select('id, email, full_name')
          .in('id', actorIds);

        if (profiles) {
          profiles.forEach((p: any) => {
            actorMap.set(p.id, { email: p.email || null, full_name: p.full_name || null });
          });
        }
      } catch (err) {
        // Profiles table might not have email column - that's okay
      }
    }

    for (const event of data) {
      // Support both new schema (actor_user_id) and old schema (actor_id) for migration period
      const actorUserId = event.actor_user_id || event.actor_id;
      const actorInfo = actorUserId ? actorMap.get(actorUserId) : null;
      
      enrichedEvents.push({
        id: event.id,
        actor_id: actorUserId || null,
        actor_email: actorInfo?.email || null,
        actor_name: actorInfo?.full_name || null,
        action: event.action || 'other',
        entity_type: event.entity_type || null,
        entity_id: event.entity_id || null,
        // Map metadata (new schema) to details (old type) for backward compatibility
        details: event.metadata || event.details || null,
        // Map ip (new schema) to ip_address (old type)
        ip_address: event.ip || event.ip_address || null,
        user_agent: event.user_agent || null,
        created_at: event.created_at,
      });
    }

    return {
      events: enrichedEvents,
      status: "ok",
    };
  } catch (error) {
    // Check if this is an expected "unavailable" error
    if (isUnavailableError(error)) {
      // Don't log - this is expected when table doesn't exist or RLS blocks access
      return {
        events: [],
        status: "unavailable",
        message: "Audit log not configured",
      };
    }
    // Only log truly unexpected errors in development
    if (process.env.NODE_ENV === "development") {
      console.warn("[getAuditEvents] Unexpected error:", error);
    }
    return {
      events: [],
      status: "unavailable",
      message: "Unable to load audit events",
    };
  }
}

/**
 * Write an audit event to the audit_events table.
 * This is a helper function that can be used later when we need to write audit events.
 * 
 * Note: This function is currently a placeholder and does not actually write.
 * To enable writing, uncomment the implementation and ensure the table exists.
 */
export async function writeAuditEvent(params: {
  actor_id: string;
  action: AuditAction;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}): Promise<{ success: boolean; error?: string }> {
  // TODO: Uncomment when ready to write audit events
  /*
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('audit_events').insert({
      actor_id: params.actor_id,
      action: params.action,
      entity_type: params.entity_type || null,
      entity_id: params.entity_id || null,
      details: params.details || null,
      ip_address: params.ip_address || null,
      user_agent: params.user_agent || null,
    });

    if (error) {
      console.error("[writeAuditEvent] Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[writeAuditEvent] Error:", error);
    return { success: false, error: 'Unknown error' };
  }
  */

  // Placeholder: return success but don't actually write
  return { success: true };
}

