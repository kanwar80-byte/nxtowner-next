import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/requireUser";
import { getDealWorkspace } from "@/lib/deal/deals.repo";
import { getUserPlan } from "@/lib/billing/plan";
import { checkEntitlement } from "@/lib/billing/entitlements";
import { DEAL_WORKSPACE_REQUIRED_TIER } from "@/lib/billing/plan";
import DealWorkspaceShell from "./components/DealWorkspaceShell";

interface DealPageProps {
  params: Promise<{ dealId: string }>;
}

export default async function DealPage({ params }: DealPageProps) {
  const { dealId } = await params;
  const user = await requireUser();
  
  // Check entitlement (but don't throw - let UI handle upgrade prompt)
  const entitlementCheck = await checkEntitlement(user.id, "deal_workspace");
  
  // Get full plan info for UI display
  const userPlan = await getUserPlan(user.id);
  const requiredTier = DEAL_WORKSPACE_REQUIRED_TIER;

  // Fetch deal workspace data (only if user has access, otherwise show empty with upgrade prompt)
  const workspaceData = entitlementCheck.hasAccess
    ? await getDealWorkspace(dealId, user.id)
    : null;

  if (entitlementCheck.hasAccess && !workspaceData) {
    notFound();
  }

  return (
    <DealWorkspaceShell 
      workspaceData={workspaceData}
      userPlan={userPlan ? { tier: userPlan.tier, planName: userPlan.planName } : null}
      requiredTier={requiredTier}
      hasAccess={entitlementCheck.hasAccess}
    />
  );
}
