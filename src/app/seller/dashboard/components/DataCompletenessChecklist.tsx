"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { DataCompleteness } from "@/types/sellerDashboard";

interface DataCompletenessChecklistProps {
  dataCompleteness: DataCompleteness;
  listingId: string;
}

export default function DataCompletenessChecklist({
  dataCompleteness,
  listingId,
}: DataCompletenessChecklistProps) {
  const getStatusIcon = (status: "complete" | "partial" | "missing") => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "partial":
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case "missing":
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: "complete" | "partial" | "missing") => {
    switch (status) {
      case "complete":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "partial":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "missing":
        return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };

  const getImportanceColor = (importance: "high" | "medium" | "low") => {
    switch (importance) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-amber-400";
      case "low":
        return "text-slate-400";
    }
  };

  const incompleteItems = dataCompleteness.items.filter(
    (item) => item.status !== "complete"
  );

  return (
    <Card className="border-slate-800 bg-slate-900/20">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          Data Completeness
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-sm text-slate-400">Overall</span>
          <Badge
            variant="outline"
            className={
              dataCompleteness.overall >= 80
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : dataCompleteness.overall >= 60
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }
          >
            {dataCompleteness.overall}%
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              dataCompleteness.overall >= 80
                ? "bg-green-500"
                : dataCompleteness.overall >= 60
                ? "bg-amber-500"
                : "bg-red-500"
            }`}
            style={{ width: `${dataCompleteness.overall}%` }}
          />
        </div>

        {/* Checklist Items */}
        <div className="space-y-3">
          {dataCompleteness.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="shrink-0 mt-0.5">{getStatusIcon(item.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-300">
                      {item.label}
                    </span>
                    <span
                      className={`text-xs ${getImportanceColor(item.importance)}`}
                    >
                      {item.importance === "high" && "• Required"}
                      {item.importance === "medium" && "• Recommended"}
                      {item.importance === "low" && "• Optional"}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-500">{item.description}</p>
                  )}
                </div>
              </div>
              <Badge variant="outline" className={getStatusColor(item.status)}>
                {item.status === "complete"
                  ? "Complete"
                  : item.status === "partial"
                  ? "Partial"
                  : "Missing"}
              </Badge>
            </div>
          ))}
        </div>

        {/* CTA */}
        {incompleteItems.length > 0 && (
          <Link href={`/sell?listingId=${listingId}`} className="block">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
            >
              Complete Your Listing
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
