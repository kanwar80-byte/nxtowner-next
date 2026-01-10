"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Deal } from "@/types/deal";
import type { ComparisonResult } from "@/types/aiCompare";

interface CompareTableProps {
  comparisonResult: ComparisonResult;
  deals: Deal[];
}

function getScoreBadgeVariant(score: number | null): "default" | "amber" | "green" | "red" {
  if (score === null) return "default";
  if (score >= 70) return "green";
  if (score >= 50) return "amber";
  return "red";
}

function getValueBadgeVariant(value: string | null): "default" | "amber" | "green" | "red" {
  if (value === null || value === "—") return "default";
  if (value === "high" || value === "low") return "green";
  if (value === "medium") return "amber";
  return "default";
}

export default function CompareTable({
  comparisonResult,
  deals,
}: CompareTableProps) {
  const metrics = comparisonResult.deals;

  if (metrics.length === 0) {
    return null;
  }

  const rows: Array<{
    label: string;
    values: (string | number | null)[];
    formatter?: (value: string | number | null, metric: typeof metrics[0]) => string;
    badgeVariant?: (value: string | number | null) => "default" | "amber" | "green" | "red";
  }> = [
    {
      label: "Fit Score",
      values: metrics.map(m => m.fitScore),
      formatter: (val) => val !== null && typeof val === "number" ? val.toFixed(0) : "—",
      badgeVariant: (val) => typeof val === "number" ? getScoreBadgeVariant(val) : "default",
    },
    {
      label: "Cash Flow",
      values: metrics.map(m => m.cashFlow),
      formatter: (val) => val !== null && typeof val === "number" ? `$${val.toLocaleString()}` : "—",
    },
    {
      label: "Ops Complexity",
      values: metrics.map(m => m.operationalComplexity),
      formatter: (val) => val !== null && typeof val === "string" ? val.charAt(0).toUpperCase() + val.slice(1) : "—",
      badgeVariant: (val) => typeof val === "string" ? getValueBadgeVariant(val) : "default",
    },
    {
      label: "Data Quality",
      values: metrics.map(m => m.dataQuality),
      formatter: (val) => val !== null && typeof val === "string" ? val.charAt(0).toUpperCase() + val.slice(1) : "—",
      badgeVariant: (val) => typeof val === "string" ? getValueBadgeVariant(val) : "default",
    },
    {
      label: "Valuation vs Ask",
      values: metrics.map(m => m.valuationVsAsk),
      formatter: (val) => val !== null && typeof val === "number" ? `${val}%` : "—",
    },
    {
      label: "Risk Flags",
      values: metrics.map(m => m.riskFlags.length),
      formatter: (val) => val !== null && typeof val === "number" && val > 0 ? `${val} flag${val > 1 ? "s" : ""}` : "None",
      badgeVariant: (val) => val !== null && typeof val === "number" && val > 0 ? "red" : "green",
    },
  ];

  return (
    <Card className="border-slate-800 bg-[#0B1221] overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left p-4 text-sm font-semibold text-slate-300">Metric</th>
                {deals.map((deal) => (
                  <th
                    key={deal.id}
                    className="text-left p-4 text-sm font-semibold text-slate-300 min-w-[200px]"
                  >
                    {deal.listing?.title || deal.id.slice(0, 8)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="p-4 text-sm text-slate-400 font-medium">{row.label}</td>
                  {row.values.map((value, colIdx) => {
                    const formatted = row.formatter ? row.formatter(value, metrics[colIdx]) : String(value ?? "—");
                    const variant = row.badgeVariant ? row.badgeVariant(value) : "default";
                    const colorMap: Record<string, string> = {
                      green: "bg-green-500/10 border-green-500/20 text-green-400",
                      amber: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
                      red: "bg-red-500/10 border-red-500/20 text-red-400",
                      default: "bg-slate-800/50 border-slate-700/50 text-slate-400",
                    };
                    return (
                      <td key={colIdx} className="p-4">
                        <Badge
                          variant="outline"
                          className={colorMap[variant] || colorMap.default}
                        >
                          {formatted}
                        </Badge>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
