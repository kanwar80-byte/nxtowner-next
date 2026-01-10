"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, AlertTriangle, GitCompare, Lock } from "lucide-react";
import Link from "next/link";
import type { AiAnalysisSummary } from "@/types/deal";
import type { PlanTier } from "@/types/billing";
import PaywallGate from "@/components/billing/PaywallGate";
import UpgradePrompt from "@/components/billing/UpgradePrompt";

interface AiDealPanelProps {
  dealId: string;
  aiAnalysis?: AiAnalysisSummary | null;
  isLoading?: boolean;
  compareDealIds?: string[]; // Optional list of other deal IDs to compare with
  userPlan?: { tier: PlanTier; planName: string } | null;
}

export default function AiDealPanel({ 
  dealId, 
  aiAnalysis,
  isLoading = false,
  compareDealIds = [],
  userPlan
}: AiDealPanelProps) {
  const currentTier = userPlan?.tier || "FREE";
  const hasFullFitScore = currentTier === "PRO" || currentTier === "ELITE";
  const hasValuationPreview = currentTier === "PRO" || currentTier === "ELITE";
  const hasCompare = currentTier === "PRO" || currentTier === "ELITE";
  const hasNdaAccess = currentTier === "PRO" || currentTier === "ELITE";
  // Mock data if none provided
  const analysis = aiAnalysis || {
    growth_score: 75,
    risk_score: 35,
    executive_summary: "This deal shows strong potential with moderate risk. Key metrics indicate healthy cash flow and growth opportunities.",
    key_highlights: [
      "Revenue growth trend: +12% YoY",
      "Strong customer retention: 94%",
      "Market position: Top 3 in segment",
      "Scalability potential: High"
    ],
    updated_at: new Date().toISOString(),
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-green-500/10 border-green-500/20";
    if (score >= 50) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  if (isLoading) {
    return (
      <aside className="w-80 shrink-0 sticky top-28 h-fit">
        <Card className="border-slate-800 bg-[#0B1221]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-blue-500" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 animate-pulse">
              <div className="h-20 bg-slate-700/50 rounded-lg" />
              <div className="h-4 bg-slate-700/50 rounded w-3/4" />
              <div className="h-4 bg-slate-700/50 rounded w-1/2" />
            </div>
          </CardContent>
        </Card>
      </aside>
    );
  }

  return (
    <aside className="w-80 shrink-0 sticky top-28 h-fit space-y-4">
      <Card className="border-slate-800 bg-[#0B1221]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-blue-500" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Fit Score - Gated for PRO+ */}
          <PaywallGate
            entitlement="ai_fit_score_full"
            currentTier={currentTier}
            requiredTier="PRO"
            hasAccess={hasFullFitScore}
            featureName="Full AI Fit Score"
            featureDescription="See detailed growth and risk scores with executive summary and key highlights."
            lockedContent={
              <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-amber-400 uppercase tracking-wide">Preview Only</span>
                </div>
                <div className="text-sm text-slate-400 mb-3">
                  Upgrade to Pro to see full AI Fit Score analysis.
                </div>
                <Link href="/pricing">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            }
          >
            {/* Scores - Full Access */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-lg border p-4 ${getScoreBg(analysis.growth_score)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`w-4 h-4 ${getScoreColor(analysis.growth_score)}`} />
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Growth</span>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(analysis.growth_score)}`}>
                  {analysis.growth_score}
                </div>
                <div className="text-xs text-slate-400 mt-1">out of 100</div>
              </div>
              
              <div className={`rounded-lg border p-4 ${getScoreBg(100 - analysis.risk_score)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`w-4 h-4 ${getScoreColor(100 - analysis.risk_score)}`} />
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Risk</span>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(100 - analysis.risk_score)}`}>
                  {analysis.risk_score}
                </div>
                <div className="text-xs text-slate-400 mt-1">lower is better</div>
              </div>
            </div>

            {/* Executive Summary */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Summary</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {analysis.executive_summary}
              </p>
            </div>

            {/* Key Highlights */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Key Highlights</h3>
              <ul className="space-y-2">
                {analysis.key_highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span className="text-sm text-slate-400">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </PaywallGate>

          {/* Valuation Preview - Gated for PRO+ */}
          <PaywallGate
            entitlement="ai_valuation_preview"
            currentTier={currentTier}
            requiredTier="PRO"
            hasAccess={hasValuationPreview}
            featureName="AI Valuation Preview"
            featureDescription="Get AI-powered valuation estimates to understand fair market value."
            lockedContent={
              <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-lg text-center">
                <Lock className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400 mb-2">Valuation Preview</p>
                <p className="text-xs text-slate-500 mb-3">Upgrade to Pro to unlock</p>
                <Link href="/pricing">
                  <Button size="sm" variant="outline" className="w-full border-blue-500/20 text-blue-400">
                    View Pricing
                  </Button>
                </Link>
              </div>
            }
          >
            <div className="p-4 border border-blue-500/20 bg-blue-500/5 rounded-lg">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">AI Valuation</h3>
              <p className="text-xs text-slate-400">Valuation estimates coming soon</p>
            </div>
          </PaywallGate>

          {/* Last Updated */}
          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-500">
              Last updated: {new Date(analysis.updated_at).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional AI Insights Card (placeholder) */}
      <Card className="border-slate-800 bg-[#0B1221]">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-300">
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-slate-400">
            <p>• Review financial documents in Diligence phase</p>
            <p>• Schedule partner meeting for next week</p>
            <p>• Complete risk assessment checklist</p>
          </div>
        </CardContent>
      </Card>

      {/* Compare Deals Button - Gated for PRO+ */}
      <PaywallGate
        entitlement="ai_compare"
        currentTier={currentTier}
        requiredTier="PRO"
        hasAccess={hasCompare}
        featureName="Compare Deals"
        featureDescription="Compare multiple deals side-by-side with AI-powered analysis."
        lockedContent={
          <Card className="border-slate-800 bg-[#0B1221]">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
                Compare Deals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg mb-3">
                <p className="text-xs text-slate-400 text-center mb-2">
                  Upgrade to Pro to compare deals
                </p>
                <Link href="/pricing">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        }
      >
        <Card className="border-slate-800 bg-[#0B1221]">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-300">
              Compare Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/compare?dealIds=${[dealId, ...compareDealIds].join(",")}`} prefetch={false}>
              <Button
                variant="outline"
                className="w-full border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 flex items-center gap-2"
              >
                <GitCompare className="w-4 h-4" />
                Compare Deals
              </Button>
            </Link>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Compare this deal with others using AI analysis
            </p>
          </CardContent>
        </Card>
      </PaywallGate>
    </aside>
  );
}
