"use client";

import { useState } from "react";
import type { DealWorkspaceData } from "@/types/deal";
import type { PlanTier } from "@/types/billing";
import DealHeader from "./DealHeader";
import DealStatusTracker from "./DealStatusTracker";
import DealTabs from "./DealTabs";
import AiDealPanel from "@/components/ai/AiDealPanel";
import UpgradePrompt from "@/components/billing/UpgradePrompt";

interface DealWorkspaceShellProps {
  workspaceData: DealWorkspaceData | null;
  userPlan: { tier: PlanTier; planName: string } | null;
  requiredTier: PlanTier;
  hasAccess: boolean;
}

export default function DealWorkspaceShell({ 
  workspaceData,
  userPlan,
  requiredTier,
  hasAccess
}: DealWorkspaceShellProps) {
  const [activeTab, setActiveTab] = useState<"documents" | "ai" | "tasks" | "partners">("documents");
  
  const currentTier = userPlan?.tier || "FREE";

  // Map status to stage index for tracker
  const statusToStage: Record<string, number> = {
    discovery: 1,
    nda_signed: 2,
    diligence: 3,
    financing: 4,
    offer: 5,
    closing: 6,
    closed: 6,
    cancelled: 0,
  };

  // If no access, show upgrade prompt
  if (!hasAccess || !workspaceData) {
    return (
      <div className="min-h-screen bg-[#050505] text-slate-200 pt-24">
        <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 py-8">
          <UpgradePrompt
            entitlement="deal_workspace"
            currentTier={currentTier}
            requiredTier={requiredTier}
            featureName="Deal Workspace"
            featureDescription="Access the full deal workspace with tabs, status tracker, documents, tasks, partners, and AI analysis panel."
          />
        </div>
      </div>
    );
  }

  const currentStage = statusToStage[workspaceData.deal.status] || 1;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 pt-24">
      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 py-8">
        <div className="flex gap-8 items-start">
          {/* Main content area */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Header */}
            <DealHeader deal={workspaceData.deal} />

            {/* Status Tracker */}
            <DealStatusTracker currentStage={currentStage} status={workspaceData.deal.status} />

            {/* Tabs */}
            <DealTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              workspaceData={workspaceData}
            />
          </div>

          {/* Right AI Rail */}
          <AiDealPanel 
            dealId={workspaceData.deal.id}
            aiAnalysis={workspaceData.aiAnalysis}
            userPlan={userPlan}
          />
        </div>
      </div>
    </div>
  );
}
