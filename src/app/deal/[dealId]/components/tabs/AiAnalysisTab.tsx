"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import type { AiAnalysisSummary } from "@/types/deal";
// Date formatting helper
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

interface AiAnalysisTabProps {
  dealId: string;
  aiAnalysis?: AiAnalysisSummary | null;
}

// Mock score history for placeholder
const MOCK_SCORE_HISTORY = [
  { date: "2024-01-15", growth: 72, risk: 38 },
  { date: "2024-01-22", growth: 74, risk: 36 },
  { date: "2024-01-29", growth: 75, risk: 35 },
  { date: "2024-02-05", growth: 76, risk: 34 },
];

export default function AiAnalysisTab({ dealId, aiAnalysis }: AiAnalysisTabProps) {
  // Use mock data if none provided
  const analysis = aiAnalysis || {
    growth_score: 75,
    risk_score: 35,
    executive_summary:
      "This deal shows strong potential with moderate risk. Key metrics indicate healthy cash flow and growth opportunities. The business has demonstrated consistent revenue growth and maintains a strong market position.",
    key_highlights: [
      "Revenue growth trend: +12% YoY",
      "Strong customer retention: 94%",
      "Market position: Top 3 in segment",
      "Scalability potential: High",
      "Financial stability: Excellent",
      "Market demand: Growing",
    ],
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">AI Analysis & Insights</h2>
        <p className="text-sm text-slate-400">
          Comprehensive AI-powered analysis of this deal opportunity
        </p>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-800 bg-slate-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Growth Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400 mb-2">{analysis.growth_score}</div>
            <div className="text-xs text-slate-400">out of 100</div>
            <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
                style={{ width: `${analysis.growth_score}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-yellow-400" />
              Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400 mb-2">{analysis.risk_score}</div>
            <div className="text-xs text-slate-400">lower is better</div>
            <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all"
                style={{ width: `${analysis.risk_score}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Executive Summary */}
      <Card className="border-slate-800 bg-slate-900/20">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-white">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-300 leading-relaxed">{analysis.executive_summary}</p>
        </CardContent>
      </Card>

      {/* Key Highlights */}
      <Card className="border-slate-800 bg-slate-900/20">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-white">Key Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {analysis.key_highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span className="text-sm text-slate-300">{highlight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Score History (Placeholder Chart) */}
      <Card className="border-slate-800 bg-slate-900/20">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            Score History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_SCORE_HISTORY.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="text-sm text-slate-300">
                  {formatDate(entry.date)}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Growth:</span>
                    <span className="text-sm font-medium text-green-400">{entry.growth}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Risk:</span>
                    <span className="text-sm font-medium text-yellow-400">{entry.risk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            Score history will be tracked automatically as the deal progresses
          </p>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-xs text-slate-500 text-center">
        Last updated: {formatDateTime(analysis.updated_at)}
      </div>
    </div>
  );
}
