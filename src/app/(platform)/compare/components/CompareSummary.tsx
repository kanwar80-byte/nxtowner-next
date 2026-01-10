"use client";

import { Trophy, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Deal } from "@/types/deal";
import type { ComparisonResult } from "@/types/aiCompare";

interface CompareSummaryProps {
  comparisonResult: ComparisonResult;
  deals: Deal[];
}

export default function CompareSummary({
  comparisonResult,
  deals,
}: CompareSummaryProps) {
  const bestDeal = deals.find(d => d.id === comparisonResult.bestOverallDealId);
  const lowestRiskDeal = deals.find(d => d.id === comparisonResult.lowestRiskDealId);
  const highestUpsideDeal = deals.find(d => d.id === comparisonResult.highestUpsideDealId);

  const getScore = (dealId: string | null) => {
    if (!dealId) return null;
    const metric = comparisonResult.deals.find(d => d.dealId === dealId);
    return metric ? metric.relativeDealScore : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Best Overall Fit */}
      <Card className="border-slate-800 bg-[#0B1221]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-white">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Best Overall Fit
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bestDeal ? (
            <div>
              <p className="text-white font-medium mb-1">{bestDeal.listing?.title || "Untitled Deal"}</p>
              {getScore(bestDeal.id) !== null && (
                <Badge variant="outline" className="border-yellow-500/20 bg-yellow-500/10 text-yellow-400 mt-2">
                  Score: {getScore(bestDeal.id)!.toFixed(1)}
                </Badge>
              )}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">N/A</p>
          )}
        </CardContent>
      </Card>

      {/* Lowest Risk */}
      <Card className="border-slate-800 bg-[#0B1221]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-white">
            <Shield className="w-4 h-4 text-green-500" />
            Lowest Risk
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowestRiskDeal ? (
            <div>
              <p className="text-white font-medium mb-1">{lowestRiskDeal.listing?.title || "Untitled Deal"}</p>
              {comparisonResult.lowestRiskDealId && (
                <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-green-400 mt-2">
                  Safest Choice
                </Badge>
              )}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">N/A</p>
          )}
        </CardContent>
      </Card>

      {/* Highest Upside */}
      <Card className="border-slate-800 bg-[#0B1221]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-white">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Highest Upside
          </CardTitle>
        </CardHeader>
        <CardContent>
          {highestUpsideDeal ? (
            <div>
              <p className="text-white font-medium mb-1">{highestUpsideDeal.listing?.title || "Untitled Deal"}</p>
              {comparisonResult.highestUpsideDealId && (
                <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-400 mt-2">
                  Growth Leader
                </Badge>
              )}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">N/A</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
