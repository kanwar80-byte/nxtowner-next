"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AiValuationBand } from "@/types/sellerDashboard";

interface AiValuationBandProps {
  valuationBand: AiValuationBand;
}

export default function AiValuationBand({ valuationBand }: AiValuationBandProps) {
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  const getAskPosition = () => {
    if (valuationBand.yourAsk < valuationBand.low) return "below";
    if (valuationBand.yourAsk > valuationBand.high) return "above";
    if (valuationBand.yourAsk < valuationBand.mid) return "low-mid";
    return "mid-high";
  };

  const askPosition = getAskPosition();
  const rangeWidth = valuationBand.high - valuationBand.low;
  const askOffset = rangeWidth > 0 
    ? ((valuationBand.yourAsk - valuationBand.low) / rangeWidth) * 100 
    : 50; // Default to middle if range is 0

  const getAskIcon = () => {
    if (askPosition === "above") return TrendingDown;
    if (askPosition === "below") return TrendingUp;
    return Minus;
  };

  const AskIcon = getAskIcon();

  const getAskColor = () => {
    if (askPosition === "above") return "text-red-400 bg-red-500/10 border-red-500/20";
    if (askPosition === "below") return "text-green-400 bg-green-500/10 border-green-500/20";
    return "text-blue-400 bg-blue-500/10 border-blue-500/20";
  };

  return (
    <Card className="border-slate-800 bg-slate-900/20">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          AI Valuation Band
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Valuation Range */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Low</span>
            <span>Mid</span>
            <span>High</span>
          </div>
          <div className="relative h-8 bg-slate-800 rounded-lg overflow-hidden">
            {/* Low to Mid gradient */}
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500/30 to-amber-500/30"
              style={{ width: "50%" }}
            />
            {/* Mid to High gradient */}
            <div
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-green-500/30 to-amber-500/30"
              style={{ width: "50%" }}
            />
            {/* Your Ask marker */}
            <div
              className="absolute top-0 h-full w-0.5 bg-white"
              style={{ left: `${Math.max(0, Math.min(100, askOffset))}%` }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <AskIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>{formatCurrency(valuationBand.low)}</span>
            <span>{formatCurrency(valuationBand.mid)}</span>
            <span>{formatCurrency(valuationBand.high)}</span>
          </div>
        </div>

        {/* Your Ask */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Your Ask:</span>
            <Badge variant="outline" className={getAskColor()}>
              {formatCurrency(valuationBand.yourAsk)}
            </Badge>
          </div>
          <Badge
            variant="outline"
            className={
              askPosition === "above"
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : askPosition === "below"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
            }
          >
            {askPosition === "above"
              ? "Above Range"
              : askPosition === "below"
              ? "Below Range"
              : "Within Range"}
          </Badge>
        </div>

        {/* Warning */}
        {valuationBand.warning && (
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-400">{valuationBand.warning}</p>
          </div>
        )}

        {/* CTA */}
        {askPosition === "above" && (
          <Link href="/pricing" className="block">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
            >
              Boost Visibility
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
