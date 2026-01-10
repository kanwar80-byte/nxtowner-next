"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Deal } from "@/types/deal";
import type { ComparisonResult } from "@/types/aiCompare";

interface CompareVerdictProps {
  comparisonResult: ComparisonResult;
  deals: Deal[];
}

export default function CompareVerdict({
  comparisonResult,
  deals,
}: CompareVerdictProps) {
  const bestDeal = deals.find(d => d.id === comparisonResult.bestOverallDealId);
  const hasVerdict = comparisonResult.aiVerdict.length > 0;

  return (
    <Card className="border-blue-500/20 bg-blue-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-blue-500" />
          AI Verdict
          <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-400 ml-auto">
            Powered by AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Verdict Text */}
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 leading-relaxed">
            {hasVerdict ? (
              comparisonResult.aiVerdict
            ) : (
              "Insufficient data to generate a verdict. Add more deals or provide additional metrics."
            )}
          </p>
        </div>

        {/* Winner Highlight */}
        {bestDeal && (
          <div className="p-4 border border-blue-500/20 bg-blue-500/10 rounded-lg">
            <p className="text-sm text-slate-400 mb-1">Recommended Deal</p>
            <p className="text-lg font-semibold text-white">{bestDeal.listing?.title || "Untitled Deal"}</p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex gap-3 pt-4 border-t border-slate-800">
          {bestDeal && (
            <Link href={`/deal/${bestDeal.id}`} className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Proceed with Deal
              </Button>
            </Link>
          )}
          <Link href="/browse" className="flex-1">
            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
              Ask AI More Questions
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
