

import { requireUser } from "@/lib/auth/requireUser";
import { getDealsByIds } from "@/lib/deal/deals.repo";
import { getUserPlan } from "@/lib/billing/plan";
import { checkEntitlement } from "@/lib/billing/entitlements";
import { getRequiredTierForEntitlement } from "@/lib/billing/plan";
import CompareShell from "./components/CompareShell";

interface ComparePageProps {
  searchParams: Promise<{ dealIds?: string }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const user = await requireUser();
  
  // Check entitlement (but don't throw - let UI handle upgrade prompt)
  const entitlementCheck = await checkEntitlement(user.id, "ai_compare");
  
  // Get full plan info for UI
  const userPlan = await getUserPlan(user.id);
  const requiredTier = getRequiredTierForEntitlement("ai_compare") || "PRO";
  
  const sp = await searchParams;
  
  // Parse dealIds from query param (comma-separated)
  const dealIdsParam = sp.dealIds || "";
  const dealIds = dealIdsParam
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
    .slice(0, 4); // Max 4 deals

  // Fetch deals (only if user has access)
  const deals = (entitlementCheck.hasAccess && dealIds.length > 0)
    ? await getDealsByIds(dealIds, user.id)
    : [];

  return (
    <CompareShell 
      initialDealIds={dealIds} 
      deals={deals}
      userPlan={userPlan ? { tier: userPlan.tier, planName: userPlan.planName } : null}
      requiredTier={requiredTier}
      hasAccess={entitlementCheck.hasAccess}
    />
  );
}
