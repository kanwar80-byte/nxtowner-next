/**
 * Billing & Entitlements Types (V17)
 */

export type PlanTier = "FREE" | "PRO" | "ELITE";

export type Entitlement =
  | "ai_preview_basic"
  | "ai_fit_score_full"
  | "ai_valuation_preview"
  | "ai_compare"
  | "deal_workspace"
  | "nda_access"
  | "partner_intro";

export interface Plan {
  tier: PlanTier;
  name: string;
  entitlements: Entitlement[];
}

export interface UserPlan {
  tier: PlanTier;
  userId: string;
  planName: string;
  expiresAt?: string | null;
  stripeSubscriptionId?: string | null;
}

export interface UsageEvent {
  eventName: string;
  userId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface EntitlementCheckResult {
  hasAccess: boolean;
  requiredTier: PlanTier | null;
  currentTier: PlanTier;
  message?: string;
}
