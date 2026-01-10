import "server-only";

import { createClient } from '@/utils/supabase/server';
import type { UsageEvent } from '@/types/billing';

/**
 * Usage Tracking Repository
 * 
 * Lightweight usage tracking for entitlements (no PII, just event name + user_id + timestamp)
 * 
 * TODO: Ensure the following table exists in Supabase:
 * - usage_events (id, user_id, event_name, timestamp, metadata)
 */

/**
 * Track a usage event
 */
export async function trackUsage(
  userId: string,
  eventName: string,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  // TODO: Implement actual database insert when usage_events table exists
  // const { error } = await supabase
  //   .from('usage_events')
  //   .insert({
  //     user_id: userId,
  //     event_name: eventName,
  //     timestamp: new Date().toISOString(),
  //     metadata: metadata || {},
  //   });
  //
  // if (error) {
  //   console.error('Usage tracking error:', error);
  //   return { success: false, error: error.message };
  // }
  //
  // return { success: true };
  
  // Mock: Log for now, actual tracking will be wired when DB table exists
  if (process.env.NODE_ENV === "development") {
    console.log(`[Usage] ${eventName} - User: ${userId} - Metadata:`, metadata || {});
  }
  
  return { success: true };
}

/**
 * Track entitlement usage (wrapper around trackUsage)
 */
export async function trackEntitlementUsage(
  userId: string,
  entitlement: string,
  action: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await trackUsage(userId, `entitlement.${entitlement}.${action}`, {
    entitlement,
    action,
    ...metadata,
  });
}
