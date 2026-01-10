"use client";

import { ReactNode } from "react";
import { Lock } from "lucide-react";
import type { Entitlement, PlanTier } from "@/types/billing";
import UpgradePrompt from "./UpgradePrompt";

interface PaywallGateProps {
  entitlement: Entitlement;
  currentTier: PlanTier;
  requiredTier: PlanTier | null;
  hasAccess: boolean;
  children: ReactNode;
  featureName: string;
  featureDescription: string;
  lockedContent?: ReactNode; // Optional custom locked content
}

/**
 * PaywallGate component - Gates content based on entitlements
 * 
 * Usage:
 *   <PaywallGate
 *     entitlement="ai_fit_score_full"
 *     currentTier={userPlan.tier}
 *     requiredTier="PRO"
 *     hasAccess={checkResult.hasAccess}
 *     featureName="Full AI Fit Score"
 *     featureDescription="See detailed growth and risk analysis"
 *   >
 *     <ProtectedContent />
 *   </PaywallGate>
 */
export default function PaywallGate({
  entitlement,
  currentTier,
  requiredTier,
  hasAccess,
  children,
  featureName,
  featureDescription,
  lockedContent,
}: PaywallGateProps) {
  if (hasAccess) {
    return <>{children}</>;
  }

  // Show custom locked content if provided
  if (lockedContent) {
    return <>{lockedContent}</>;
  }

  // Default locked state with upgrade prompt
  return (
    <UpgradePrompt
      entitlement={entitlement}
      currentTier={currentTier}
      requiredTier={requiredTier}
      featureName={featureName}
      featureDescription={featureDescription}
    />
  );
}
