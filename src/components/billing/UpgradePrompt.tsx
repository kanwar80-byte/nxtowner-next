"use client";

import { Lock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Entitlement, PlanTier } from "@/types/billing";

interface UpgradePromptProps {
  entitlement: Entitlement;
  currentTier: PlanTier;
  requiredTier: PlanTier | null;
  featureName: string;
  featureDescription: string;
}

const PLAN_NAMES: Record<PlanTier, string> = {
  FREE: "Free",
  PRO: "Pro",
  ELITE: "Elite",
};

const PLAN_COLORS: Record<PlanTier, string> = {
  FREE: "bg-slate-100 text-slate-700 border-slate-300",
  PRO: "bg-blue-100 text-blue-700 border-blue-300",
  ELITE: "bg-purple-100 text-purple-700 border-purple-300",
};

export default function UpgradePrompt({
  entitlement,
  currentTier,
  requiredTier,
  featureName,
  featureDescription,
}: UpgradePromptProps) {
  if (!requiredTier) {
    return null;
  }

  const getUpgradeMessage = () => {
    if (currentTier === "FREE" && requiredTier === "PRO") {
      return "Upgrade to Pro to unlock this feature and access AI-powered insights, deal comparison, and workspace tools.";
    }
    if (currentTier === "FREE" && requiredTier === "ELITE") {
      return "Upgrade to Elite to unlock this premium feature and get priority support plus partner introductions.";
    }
    if (currentTier === "PRO" && requiredTier === "ELITE") {
      return "Upgrade to Elite to unlock this premium feature and access advanced partner networking.";
    }
    return `This feature is available on ${PLAN_NAMES[requiredTier]} plan and above.`;
  };

  return (
    <Card className="border-amber-500/20 bg-amber-500/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Lock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              {featureName}
              <Badge variant="outline" className={PLAN_COLORS[requiredTier]}>
                {PLAN_NAMES[requiredTier]} Only
              </Badge>
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-slate-700 leading-relaxed">
            {featureDescription}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {getUpgradeMessage()}
          </p>
        </div>

        {/* Why it matters */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 leading-relaxed">
              <strong>Why it matters:</strong> {getWhyItMatters(entitlement)}
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link href="/pricing" className="block">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            size="lg"
          >
            Upgrade to {PLAN_NAMES[requiredTier]}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        <p className="text-xs text-slate-500 text-center">
          Current plan: <span className="font-semibold">{PLAN_NAMES[currentTier]}</span>
        </p>
      </CardContent>
    </Card>
  );
}

function getWhyItMatters(entitlement: Entitlement): string {
  const messages: Record<Entitlement, string> = {
    ai_preview_basic: "Get basic AI insights to help evaluate deals faster.",
    ai_fit_score_full:
      "Full AI fit scores help you identify the best opportunities and avoid risky deals.",
    ai_valuation_preview:
      "AI-powered valuations help you understand fair market value and negotiate better terms.",
    ai_compare:
      "Compare multiple deals side-by-side to make informed investment decisions faster.",
    deal_workspace:
      "Organized deal workspace helps you track progress, manage documents, and coordinate with partners.",
    nda_access:
      "Secure NDA process protects confidential information and enables serious buyer engagement.",
    partner_intro:
      "Partner introductions connect you with verified brokers, lawyers, and advisors to close deals faster.",
  };
  
  return messages[entitlement] || "Unlock premium features to improve your deal-making experience.";
}
