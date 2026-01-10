"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAiAnalysis } from "@/hooks/useAiAnalysis";
import { 
  Loader2, 
  AlertCircle, 
  TrendingUp, 
  Sparkles,
  CheckCircle2, 
  XCircle,
  Flag,
  CircleDot
} from "lucide-react";

interface AiAnalysisCardProps {
  listingId: string | null;
  className?: string;
}

/**
 * Skeleton loader that mimics the card layout
 */
function AnalysisSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="h-6 w-48 bg-slate-700/50 rounded animate-pulse" />
            <div className="h-4 w-full bg-slate-700/30 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-slate-700/30 rounded animate-pulse" />
          </div>
          <div className="h-12 w-16 bg-slate-700/50 rounded-full animate-pulse ml-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-700/30 rounded animate-pulse" />
          <div className="h-3 w-full bg-slate-700/20 rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-slate-700/20 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-700/30 rounded animate-pulse" />
            <div className="space-y-1">
              <div className="h-3 w-full bg-slate-700/20 rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-slate-700/20 rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-700/30 rounded animate-pulse" />
            <div className="space-y-1">
              <div className="h-3 w-full bg-slate-700/20 rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-slate-700/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-slate-800">
          <div className="h-4 w-32 bg-slate-700/30 rounded animate-pulse mb-2" />
          <div className="h-3 w-full bg-slate-700/20 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AiAnalysisCard({ listingId, className }: AiAnalysisCardProps) {
  const { analysis, loading, error } = useAiAnalysis(listingId);

  const getGradeColor = (grade: "A" | "B" | "C") => {
    switch (grade) {
      case "A":
        return "bg-green-500 text-white border-green-400";
      case "B":
        return "bg-yellow-500 text-white border-yellow-400";
      case "C":
        return "bg-red-500 text-white border-red-400";
      default:
        return "bg-gray-500 text-white border-gray-400";
    }
  };

  const getGradeSize = (grade: "A" | "B" | "C") => {
    return "text-2xl font-bold px-4 py-2 rounded-lg border-2";
  };

  if (loading) {
    return <AnalysisSkeleton />;
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              AI Deal Analysis
            </CardTitle>
            {/* The Headline: summary_one_liner - bold and prominent */}
            <CardDescription className="text-base font-semibold text-foreground leading-relaxed">
              {analysis.summary_one_liner}
            </CardDescription>
          </div>
          {/* The Grade: Large, colored badge in top right */}
          <Badge className={`${getGradeColor(analysis.deal_grade)} ${getGradeSize(analysis.deal_grade)} shrink-0`}>
            Grade {analysis.deal_grade}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Buyer Insight - Distinct Section */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Buyer Perspective
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {analysis.buyer_insight}
          </p>
        </div>

        {/* Growth Vector - Distinct Section */}
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            Growth Opportunity
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {analysis.growth_vector}
          </p>
        </div>

        {/* The Grid: 2-column grid for Red Flags and Green Lights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Green Lights Column */}
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <span className="text-lg">🟢</span>
              Green Lights
            </h3>
            {analysis.green_lights && analysis.green_lights.length > 0 ? (
              <ul className="space-y-2">
                {analysis.green_lights.map((light, index) => (
                  <li 
                    key={index} 
                    className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{light}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                No specific strengths identified
              </p>
            )}
          </div>

          {/* Red Flags Column */}
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <span className="text-lg">🚩</span>
              Red Flags
            </h3>
            {analysis.red_flags && analysis.red_flags.length > 0 ? (
              <ul className="space-y-2">
                {analysis.red_flags.map((flag, index) => (
                  <li 
                    key={index} 
                    className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                  >
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{flag}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                No major risk factors identified
              </p>
            )}
          </div>
        </div>

        {/* Valuation Comment */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            Valuation Assessment
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {analysis.valuation_comment}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
