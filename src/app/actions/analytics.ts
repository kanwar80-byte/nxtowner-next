'use server';

import { createClient } from '@/utils/supabase/server';
import { requireAuth } from '@/lib/auth';

/**
 * Context object for normalizing event props
 * These values are merged into props server-side for consistency
 */
export interface EventContext {
  valuation_id?: string | null;
  track?: 'operational' | 'digital' | null;
  step_id?: string | null;
  step_index?: number | null;
}

/**
 * Server-side event logger
 * Never throws to UI - swallows all errors silently
 * Auto-attaches user_id from auth session (never trusts client)
 * Merges context into props for consistent event structure
 */
export async function logEvent(
  eventName: string,
  props: Record<string, any> = {},
  context?: EventContext
): Promise<void> {
  try {
    // Get authenticated user (may be null for anonymous events)
    let userId: string | null = null;
    try {
      const user = await requireAuth();
      userId = user.id;
    } catch {
      // User not authenticated - allow anonymous events (user_id = null)
      userId = null;
    }

    // Merge context into props (server-side normalization)
    // Context values override props if both are present (context wins)
    // Ensure normalizedProps is always a valid JSON object (never undefined)
    const normalizedProps: Record<string, any> = {
      ...(props || {}), // Ensure props is an object
      // Context values override props (merge order: props first, then context)
      ...(context?.valuation_id !== undefined && { valuation_id: context.valuation_id }),
      ...(context?.track !== undefined && { track: context.track }),
      ...(context?.step_id !== undefined && { step_id: context.step_id }),
      ...(context?.step_index !== undefined && { step_index: context.step_index }),
    };

    const supabase = await createClient();

    // Extract listing_id and deal_room_id from props if available
    const listingId = normalizedProps.listing_id || null;
    const dealRoomId = normalizedProps.deal_room_id || null;

    // Build payload with event_name preserved for reference
    // Store original event_name in payload since type enum values are unknown
    const payload = {
      event_name: eventName,
      ...normalizedProps,
    };

    // Insert event (never throw to UI)
    // TODO(schema): events.type enum values unknown - using eventName with cast
    const { error } = await supabase
      .from('events')
      .insert({
        actor_id: userId,
        type: eventName as any, // Cast to avoid enum type checking
        payload: payload,
        listing_id: listingId,
        deal_room_id: dealRoomId,
      } as any); // Cast entire insert to avoid strict type checking

    if (error) {
      // Log server-side but never throw to client
      console.warn('[Analytics] Failed to log event:', eventName, error.message);
    }
  } catch (err) {
    // Swallow all errors - analytics should never break the UI
    console.warn('[Analytics] Event logging error (swallowed):', err);
  }
}

