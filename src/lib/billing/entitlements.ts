import "server-only";

import { getUserPlan } from './plan';
import { tierHasEntitlement, getRequiredTierForEntitlement, tierMeetsOrExceeds } from './plan';
import type { Entitlement, EntitlementCheckResult, PlanTier } from '@/types/billing';

/**
 * Check if user has a specific entitlement
 */
export async function checkEntitlement(
  userId: string,
  entitlement: Entitlement
): Promise<EntitlementCheckResult> {
  const userPlan = await getUserPlan(userId);
  
  if (!userPlan) {
    return {
      hasAccess: false,
      requiredTier: getRequiredTierForEntitlement(entitlement),
      currentTier: "FREE",
      message: "User plan not found",
    };
  }
  
  const hasAccess = tierHasEntitlement(userPlan.tier, entitlement);
  const requiredTier = getRequiredTierForEntitlement(entitlement);
  
  return {
    hasAccess,
    requiredTier,
    currentTier: userPlan.tier,
    message: hasAccess
      ? undefined
      : `This feature requires ${requiredTier || "a paid"} plan. Your current plan: ${userPlan.tier}`,
  };
}

/**
 * Require an entitlement (throws if user doesn't have access)
 * Use this in server actions and route handlers
 */
export async function requireEntitlement(
  userId: string,
  entitlement: Entitlement
): Promise<{ tier: PlanTier; planName: string }> {
  const result = await checkEntitlement(userId, entitlement);
  
  if (!result.hasAccess) {
    const error = new Error(result.message || "Access denied");
    (error as any).statusCode = 403;
    (error as any).entitlement = entitlement;
    (error as any).requiredTier = result.requiredTier;
    (error as any).currentTier = result.currentTier;
    throw error;
  }
  
  const userPlan = await getUserPlan(userId);
  return {
    tier: userPlan!.tier,
    planName: userPlan!.planName,
  };
}

/**
 * Batch check multiple entitlements
 */
export async function checkEntitlements(
  userId: string,
  entitlements: Entitlement[]
): Promise<Record<Entitlement, EntitlementCheckResult>> {
  const results = await Promise.all(
    entitlements.map((entitlement) =>
      checkEntitlement(userId, entitlement).then((result) => [entitlement, result] as const)
    )
  );
  
  return Object.fromEntries(results) as Record<Entitlement, EntitlementCheckResult>;
}
