"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ListingHealth } from "@/types/sellerDashboard";

interface ListingHealthCardProps {
  health: ListingHealth;
}

export default function ListingHealthCard({ health }: ListingHealthCardProps) {
  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-400 bg-green-500/10 border-green-500/20";
    if (score >= 60) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-red-400 bg-red-500/10 border-red-500/20";
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return CheckCircle2;
    if (score >= 60) return AlertTriangle;
    return XCircle;
  };

  const HealthIcon = getHealthIcon(health.healthScore);

  return (
    <Card className="border-slate-800 bg-slate-900/20">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <HealthIcon className={`w-4 h-4 ${getHealthColor(health.healthScore).split(" ")[0]}`} />
          Listing Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Overall Score</span>
          <Badge variant="outline" className={getHealthColor(health.healthScore)}>
            {health.healthScore}/100
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              health.healthScore >= 80
                ? "bg-green-500"
                : health.healthScore >= 60
                ? "bg-amber-500"
                : "bg-red-500"
            }`}
            style={{ width: `${health.healthScore}%` }}
          />
        </div>

        {/* Issues */}
        {health.issues.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 mb-2">Issues to address:</p>
            <ul className="space-y-1">
              {health.issues.map((issue, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-amber-400">
                  <AlertTriangle className="w-3 h-3" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Data Completeness */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400">Data Completeness</span>
          <span className="text-sm font-semibold text-slate-300">{health.dataCompleteness}%</span>
        </div>

        {/* CTA */}
        {health.healthScore < 80 && (
          <Link href="/sell" className="block">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
            >
              Improve Listing Health
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
