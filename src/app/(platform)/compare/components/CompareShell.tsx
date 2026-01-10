"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Deal } from "@/types/deal";
import type { DealComparisonInput, ComparisonResult } from "@/types/aiCompare";
import type { PlanTier } from "@/types/billing";
import { compareDeals } from "@/lib/ai/compare.logic";
import ComparePicker from "./ComparePicker";
import CompareSummary from "./CompareSummary";
import CompareTable from "./CompareTable";
import CompareVerdict from "./CompareVerdict";
import UpgradePrompt from "@/components/billing/UpgradePrompt";

interface CompareShellProps {
  initialDealIds: string[];
  deals: Deal[];
  userPlan: { tier: PlanTier; planName: string } | null;
  requiredTier: PlanTier;
  hasAccess: boolean;
}

export default function CompareShell({ 
  initialDealIds, 
  deals: initialDeals,
  userPlan,
  requiredTier,
  hasAccess: initialHasAccess
}: CompareShellProps) {
  const currentTier = userPlan?.tier || "FREE";
  const hasAccess = initialHasAccess;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDealIds, setSelectedDealIds] = useState<string[]>(initialDealIds);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);

  // Filter deals to only those that are selected
  const selectedDeals = deals.filter(deal => selectedDealIds.includes(deal.id));

  // Prepare comparison inputs - map Deal structure to DealComparisonInput
  const comparisonInputs: DealComparisonInput[] = selectedDeals.map(deal => ({
    deal,
    aiAnalysis: (deal as any).aiAnalysis || null, // aiAnalysis may be joined separately
    cashFlow: (deal as any).cashFlow || (deal.listing as any)?.cash_flow || null,
    operationalComplexity: null, // TODO: Extract from deal data
    dataQuality: null, // TODO: Extract from deal data
    valuationVsAsk: null, // TODO: Calculate from deal data
  }));

  // Compute comparison result
  const comparisonResult: ComparisonResult = selectedDealIds.length >= 2 && selectedDeals.length >= 2
    ? compareDeals(comparisonInputs)
    : {
        deals: [],
        bestOverallDealId: null,
        lowestRiskDealId: null,
        highestUpsideDealId: null,
        aiVerdict: "",
      };

  const handleDealIdsChange = (newDealIds: string[]) => {
    setSelectedDealIds(newDealIds);
    // Update URL query params
    const params = new URLSearchParams(searchParams.toString());
    if (newDealIds.length > 0) {
      params.set("dealIds", newDealIds.join(","));
    } else {
      params.delete("dealIds");
    }
    router.push(`/compare?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 pt-24">
      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/browse">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Sparkles className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Compare Deals</h1>
              <p className="text-slate-400 mt-1">AI-powered side-by-side comparison</p>
            </div>
          </div>
        </div>

        {/* Deal Picker */}
        <ComparePicker
          selectedDealIds={selectedDealIds}
          onDealIdsChange={handleDealIdsChange}
          existingDeals={deals}
        />

        {/* Comparison Results */}
        {selectedDealIds.length >= 2 && selectedDeals.length >= 2 ? (
          hasAccess ? (
            <div className="space-y-6 mt-8">
              {/* Summary Cards */}
              <CompareSummary comparisonResult={comparisonResult} deals={selectedDeals} />

              {/* Comparison Table */}
              <CompareTable comparisonResult={comparisonResult} deals={selectedDeals} />

              {/* AI Verdict */}
              <CompareVerdict comparisonResult={comparisonResult} deals={selectedDeals} />
            </div>
          ) : (
            <div className="mt-8">
              <UpgradePrompt
                entitlement="ai_compare"
                currentTier={currentTier}
                requiredTier={requiredTier}
                featureName="AI Comparison"
                featureDescription="Compare 2-4 deals side-by-side with AI-powered analysis to find the best opportunities."
              />
            </div>
          )
        ) : (
          <Card className="border-slate-800 bg-[#0B1221] mt-8">
            <CardContent className="p-12 text-center">
              <p className="text-slate-400 mb-2">
                Select at least 2 deals to start comparing
              </p>
              <p className="text-sm text-slate-500">
                Choose up to 4 deals from your saved or active deals
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
