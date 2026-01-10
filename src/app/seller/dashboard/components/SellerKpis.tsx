"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Bookmark, FileText, TrendingUp } from "lucide-react";
import type { SellerKpis } from "@/types/sellerDashboard";

interface SellerKpisProps {
  kpis: SellerKpis;
}

export default function SellerKpis({ kpis }: SellerKpisProps) {
  const kpiItems = [
    {
      label: "Views (7d)",
      value: kpis.views7d.toLocaleString(),
      icon: Eye,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Views (30d)",
      value: kpis.views30d.toLocaleString(),
      icon: Eye,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Saves",
      value: kpis.saves.toLocaleString(),
      icon: Bookmark,
      color: "text-green-400",
      bgColor: "bg-green-500/10 border-green-500/20",
    },
    {
      label: "NDA Requests",
      value: kpis.ndaRequests.toLocaleString(),
      icon: FileText,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "AI Fit Score",
      value: `${kpis.aiFitScore}`,
      icon: TrendingUp,
      color: kpis.aiFitScore >= 70 ? "text-green-400" : kpis.aiFitScore >= 50 ? "text-amber-400" : "text-red-400",
      bgColor: kpis.aiFitScore >= 70 ? "bg-green-500/10 border-green-500/20" : kpis.aiFitScore >= 50 ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20",
      subtitle: "out of 100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpiItems.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.label} className={`border-slate-800 bg-[#0B1221] ${kpi.bgColor}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${kpi.color}`} />
                <span className="text-xs text-slate-400 uppercase tracking-wide">
                  {kpi.label}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
                {kpi.subtitle && (
                  <span className="text-xs text-slate-500">{kpi.subtitle}</span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
