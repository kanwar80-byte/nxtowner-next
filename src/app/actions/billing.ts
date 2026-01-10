"use server";

import { getUserPlan } from "@/lib/billing/plan";
import { checkEntitlement } from "@/lib/billing/entitlements";
import { requireUser } from "@/lib/auth/requireUser";
import type { Entitlement, PlanTier, EntitlementCheckResult } from "@/types/billing";

/**
 * Get current user's plan tier
 */
export async function getCurrentUserPlan(): Promise<{ tier: PlanTier; planName: string } | null> {
  try {
    const user = await requireUser();
    const plan = await getUserPlan(user.id);
    return plan ? { tier: plan.tier, planName: plan.planName } : null;
  } catch {
    return null;
  }
}

/**
 * Check if current user has an entitlement (for client components)
 */
export async function checkCurrentUserEntitlement(
  entitlement: Entitlement
): Promise<EntitlementCheckResult | null> {
  try {
    const user = await requireUser();
    return await checkEntitlement(user.id, entitlement);
  } catch {
    return null;
  }
}
