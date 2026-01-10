/**
 * AI Comparison Types (V17)
 */

import type { Deal, AiAnalysisSummary } from "./deal";

export interface DealComparisonInput {
  deal: Deal;
  aiAnalysis?: AiAnalysisSummary | null;
  // Additional metrics for comparison
  cashFlow?: number | null;
  operationalComplexity?: "low" | "medium" | "high" | null;
  dataQuality?: "high" | "medium" | "low" | null;
  valuationVsAsk?: number | null; // Percentage, e.g., 95 means valuation is 95% of asking price
}

export interface DealComparisonMetrics {
  dealId: string;
  dealTitle: string;
  // Computed scores
  fitScore: number; // 0-100, based on AI analysis growth_score
  relativeDealScore: number; // FitScore + MarketModifier - RiskPenalty
  marketModifier: number; // 0-10, computed from flags
  riskPenalty: number; // 0-15, computed from flags
  // Raw metrics for table display
  cashFlow: number | null;
  operationalComplexity: "low" | "medium" | "high" | null;
  dataQuality: "high" | "medium" | "low" | null;
  valuationVsAsk: number | null;
  // Risk flags
  riskFlags: string[];
  // Confidence (reduced if data is missing)
  confidence: "high" | "medium" | "low";
}

export interface ComparisonResult {
  deals: DealComparisonMetrics[];
  // Winners
  bestOverallDealId: string | null;
  lowestRiskDealId: string | null;
  highestUpsideDealId: string | null;
  // AI Verdict
  aiVerdict: string; // 3-5 lines, factual explanation
}

export interface ComparisonFlags {
  // Market Modifier flags (positive)
  strongGrowthTrend?: boolean;
  marketLeader?: boolean;
  scalableModel?: boolean;
  recurringRevenue?: boolean;
  lowChurn?: boolean;
  highMargin?: boolean;
  
  // Risk Penalty flags (negative)
  decliningRevenue?: boolean;
  highCustomerConcentration?: boolean;
  operationalDependencies?: boolean;
  regulatoryRisk?: boolean;
  technologyRisk?: boolean;
  marketSaturation?: boolean;
  dataGaps?: boolean;
}
