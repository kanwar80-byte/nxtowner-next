import "server-only";

import { createClient } from '@/utils/supabase/server';
import type { PlanTier, Plan, UserPlan } from '@/types/billing';

/**
 * Plan definitions with entitlements
 * 
 * Configuration for what each plan tier includes.
 * Update DEAL_WORKSPACE_REQUIRED_TIER to change which tier is required for Deal Workspace.
 */
export const DEAL_WORKSPACE_REQUIRED_TIER: PlanTier = "PRO"; // Change to "ELITE" if Deal Workspace should be Elite-only

export const PLANS: Record<PlanTier, Plan> = {
  FREE: {
    tier: "FREE",
    name: "Free",
    entitlements: ["ai_preview_basic"],
  },
  PRO: {
    tier: "PRO",
    name: "Pro",
    entitlements: [
      "ai_preview_basic",
      "ai_fit_score_full",
      "ai_valuation_preview",
      "ai_compare",
      "deal_workspace",
      "nda_access",
    ],
  },
  ELITE: {
    tier: "ELITE",
    name: "Elite",
    entitlements: [
      "ai_preview_basic",
      "ai_fit_score_full",
      "ai_valuation_preview",
      "ai_compare",
      "deal_workspace",
      "nda_access",
      "partner_intro",
    ],
  },
};

/**
 * Get user's plan from database
 * 
 * TODO: When profiles.plan exists and is properly set, use:
 * const { data: profile } = await supabase
 *   .from('profiles')
 *   .select('plan, stripe_subscription_id, plan_renews_at')
 *   .eq('id', userId)
 *   .single();
 * 
 * Map database plan value ('free', 'pro', 'enterprise') to PlanTier ('FREE', 'PRO', 'ELITE')
 */
export async function getUserPlan(userId: string): Promise<UserPlan | null> {
  const supabase = await createClient();
  
  // TODO: Implement actual database query when profiles.plan is properly set
  // const { data: profile, error } = await supabase
  //   .from('profiles')
  //   .select('plan, stripe_subscription_id, plan_renews_at')
  //   .eq('id', userId)
  //   .single();
  //
  // if (error || !profile) {
  //   return null;
  // }
  //
  // // Map database plan values to PlanTier
  // const planMap: Record<string, PlanTier> = {
  //   free: 'FREE',
  //   pro: 'PRO',
  //   pro_buyer: 'PRO',
  //   verified_seller: 'PRO',
  //   enterprise: 'ELITE',
  //   elite: 'ELITE',
  // };
  //
  // const tier = planMap[profile.plan] || 'FREE';
  //
  // return {
  //   tier,
  //   userId,
  //   planName: PLANS[tier].name,
  //   expiresAt: profile.plan_renews_at || null,
  //   stripeSubscriptionId: profile.stripe_subscription_id || null,
  // };
  
  // Mock: Default to FREE for skeleton implementation
  // In production, this should always query the database
  return {
    tier: "FREE",
    userId,
    planName: "Free",
    expiresAt: null,
    stripeSubscriptionId: null,
  };
}

/**
 * Get plan definition by tier
 */
export function getPlan(tier: PlanTier): Plan {
  return PLANS[tier];
}

/**
 * Check if a tier has access to an entitlement
 */
export function tierHasEntitlement(tier: PlanTier, entitlement: string): boolean {
  const plan = PLANS[tier];
  return plan.entitlements.includes(entitlement as any);
}

/**
 * Get required tier for an entitlement
 */
export function getRequiredTierForEntitlement(entitlement: string): PlanTier | null {
  // Special handling for deal_workspace (configurable)
  if (entitlement === "deal_workspace") {
    return DEAL_WORKSPACE_REQUIRED_TIER;
  }
  
  // Find the lowest tier that includes this entitlement
  if (tierHasEntitlement("FREE", entitlement)) return "FREE";
  if (tierHasEntitlement("PRO", entitlement)) return "PRO";
  if (tierHasEntitlement("ELITE", entitlement)) return "ELITE";
  
  return null;
}

/**
 * Compare two tiers (returns true if tier1 >= tier2)
 */
export function tierMeetsOrExceeds(tier1: PlanTier, tier2: PlanTier): boolean {
  const tierOrder: Record<PlanTier, number> = {
    FREE: 0,
    PRO: 1,
    ELITE: 2,
  };
  
  return tierOrder[tier1] >= tierOrder[tier2];
}
