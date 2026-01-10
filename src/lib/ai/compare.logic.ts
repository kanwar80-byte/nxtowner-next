/**
 * AI Comparison Logic (V17)
 * 
 * Explainable comparison algorithm:
 * RelativeDealScore = FitScore + MarketModifier - RiskPenalty
 * 
 * MarketModifier (0-10) and RiskPenalty (0-15) computed from explicit flags
 */

import type {
  DealComparisonInput,
  DealComparisonMetrics,
  ComparisonResult,
  ComparisonFlags,
} from "@/types/aiCompare";

/**
 * Compute Market Modifier (0-10) from flags
 */
function computeMarketModifier(flags: ComparisonFlags): number {
  let score = 0;
  
  // Positive flags (each adds points)
  if (flags.strongGrowthTrend) score += 2;
  if (flags.marketLeader) score += 2;
  if (flags.scalableModel) score += 1.5;
  if (flags.recurringRevenue) score += 1.5;
  if (flags.lowChurn) score += 1.5;
  if (flags.highMargin) score += 1.5;
  
  // Cap at 10
  return Math.min(10, score);
}

/**
 * Compute Risk Penalty (0-15) from flags
 */
function computeRiskPenalty(flags: ComparisonFlags): number {
  let penalty = 0;
  
  // Negative flags (each adds penalty)
  if (flags.decliningRevenue) penalty += 3;
  if (flags.highCustomerConcentration) penalty += 2.5;
  if (flags.operationalDependencies) penalty += 2;
  if (flags.regulatoryRisk) penalty += 2.5;
  if (flags.technologyRisk) penalty += 2;
  if (flags.marketSaturation) penalty += 2;
  if (flags.dataGaps) penalty += 1;
  
  // Cap at 15
  return Math.min(15, penalty);
}

/**
 * Infer comparison flags from deal data and AI analysis
 */
function inferFlags(
  input: DealComparisonInput
): ComparisonFlags {
  const flags: ComparisonFlags = {};
  const { aiAnalysis, cashFlow, operationalComplexity, dataQuality } = input;
  
  // Market Modifier flags
  if (aiAnalysis?.growth_score && aiAnalysis.growth_score >= 75) {
    flags.strongGrowthTrend = true;
  }
  
  if (aiAnalysis?.growth_score && aiAnalysis.growth_score >= 80) {
    flags.marketLeader = true;
  }
  
  if (operationalComplexity === "low") {
    flags.scalableModel = true;
  }
  
  if (aiAnalysis?.key_highlights?.some(h => 
    h.toLowerCase().includes("recurring") || 
    h.toLowerCase().includes("subscription") ||
    h.toLowerCase().includes("retention")
  )) {
    flags.recurringRevenue = true;
    flags.lowChurn = true;
  }
  
  if (cashFlow && input.deal.listing?.asking_price) {
    const margin = (cashFlow / input.deal.listing.asking_price) * 100;
    if (margin >= 20) {
      flags.highMargin = true;
    }
  }
  
  // Risk Penalty flags
  if (aiAnalysis?.growth_score && aiAnalysis.growth_score < 50) {
    flags.decliningRevenue = true;
  }
  
  if (aiAnalysis?.risk_score && aiAnalysis.risk_score >= 60) {
    flags.highCustomerConcentration = true;
  }
  
  if (operationalComplexity === "high") {
    flags.operationalDependencies = true;
  }
  
  if (dataQuality === "low") {
    flags.dataGaps = true;
  }
  
  if (aiAnalysis?.key_highlights?.some(h => 
    h.toLowerCase().includes("regulatory") || 
    h.toLowerCase().includes("compliance")
  )) {
    flags.regulatoryRisk = true;
  }
  
  if (aiAnalysis?.key_highlights?.some(h => 
    h.toLowerCase().includes("technology") || 
    h.toLowerCase().includes("tech stack")
  ) && operationalComplexity === "high") {
    flags.technologyRisk = true;
  }
  
  if (aiAnalysis?.growth_score && aiAnalysis.growth_score < 60 && aiAnalysis.growth_score >= 50) {
    flags.marketSaturation = true;
  }
  
  return flags;
}

/**
 * Extract risk flags as strings for display
 */
function extractRiskFlags(flags: ComparisonFlags): string[] {
  const riskFlags: string[] = [];
  
  if (flags.decliningRevenue) riskFlags.push("Declining Revenue");
  if (flags.highCustomerConcentration) riskFlags.push("High Customer Concentration");
  if (flags.operationalDependencies) riskFlags.push("Operational Dependencies");
  if (flags.regulatoryRisk) riskFlags.push("Regulatory Risk");
  if (flags.technologyRisk) riskFlags.push("Technology Risk");
  if (flags.marketSaturation) riskFlags.push("Market Saturation");
  if (flags.dataGaps) riskFlags.push("Data Gaps");
  
  return riskFlags;
}

/**
 * Compute confidence level based on data completeness
 */
function computeConfidence(input: DealComparisonInput): "high" | "medium" | "low" {
  let completeness = 0;
  
  if (input.aiAnalysis) completeness += 2;
  if (input.cashFlow !== null && input.cashFlow !== undefined) completeness += 1;
  if (input.operationalComplexity) completeness += 1;
  if (input.dataQuality) completeness += 1;
  if (input.valuationVsAsk !== null && input.valuationVsAsk !== undefined) completeness += 1;
  
  if (completeness >= 5) return "high";
  if (completeness >= 3) return "medium";
  return "low";
}

/**
 * Compare multiple deals and return structured result
 */
export function compareDeals(inputs: DealComparisonInput[]): ComparisonResult {
  if (inputs.length === 0) {
    return {
      deals: [],
      bestOverallDealId: null,
      lowestRiskDealId: null,
      highestUpsideDealId: null,
      aiVerdict: "No deals to compare.",
    };
  }
  
  // Compute metrics for each deal
  const metrics: DealComparisonMetrics[] = inputs.map((input) => {
    const flags = inferFlags(input);
    const marketModifier = computeMarketModifier(flags);
    const riskPenalty = computeRiskPenalty(flags);
    const fitScore = input.aiAnalysis?.growth_score ?? 50; // Default to 50 if no AI analysis
    const relativeDealScore = fitScore + marketModifier - riskPenalty;
    
    return {
      dealId: input.deal.id,
      dealTitle: input.deal.listing?.title || `Deal ${input.deal.id.slice(0, 8)}`,
      fitScore: Math.max(0, Math.min(100, fitScore)),
      relativeDealScore: Math.max(0, relativeDealScore), // Can go negative, but clamp at 0 for display
      marketModifier,
      riskPenalty,
      cashFlow: input.cashFlow ?? null,
      operationalComplexity: input.operationalComplexity ?? null,
      dataQuality: input.dataQuality ?? null,
      valuationVsAsk: input.valuationVsAsk ?? null,
      riskFlags: extractRiskFlags(flags),
      confidence: computeConfidence(input),
    };
  });
  
  // Find winners
  let bestOverallDealId: string | null = null;
  let bestOverallScore = -Infinity;
  
  let lowestRiskDealId: string | null = null;
  let lowestRiskPenalty = Infinity;
  
  let highestUpsideDealId: string | null = null;
  let highestFitScore = -Infinity;
  
  for (const metric of metrics) {
    if (metric.relativeDealScore > bestOverallScore) {
      bestOverallScore = metric.relativeDealScore;
      bestOverallDealId = metric.dealId;
    }
    
    if (metric.riskPenalty < lowestRiskPenalty) {
      lowestRiskPenalty = metric.riskPenalty;
      lowestRiskDealId = metric.dealId;
    }
    
    if (metric.fitScore > highestFitScore) {
      highestFitScore = metric.fitScore;
      highestUpsideDealId = metric.dealId;
    }
  }
  
  // Generate AI Verdict (3-5 lines, factual)
  const bestDeal = metrics.find(m => m.dealId === bestOverallDealId);
  const verdictLines: string[] = [];
  
  if (bestDeal) {
    verdictLines.push(
      `${bestDeal.dealTitle} ranks highest overall with a relative score of ${bestDeal.relativeDealScore.toFixed(1)}.`
    );
    verdictLines.push(
      `It combines a fit score of ${bestDeal.fitScore} with a market modifier of ${bestDeal.marketModifier.toFixed(1)} and risk penalty of ${bestDeal.riskPenalty.toFixed(1)}.`
    );
    
    if (bestDeal.marketModifier > 5) {
      verdictLines.push("Strong market position and growth indicators drive the recommendation.");
    }
    
    if (bestDeal.riskPenalty > 5) {
      verdictLines.push("Note: Several risk factors warrant careful diligence.");
    }
    
    // Add what could change decision
    const otherHighScorers = metrics
      .filter(m => m.dealId !== bestOverallDealId && m.relativeDealScore >= bestOverallScore - 5)
      .slice(0, 2);
    
    if (otherHighScorers.length > 0) {
      const alternative = otherHighScorers[0];
      verdictLines.push(
        `${alternative.dealTitle} is close (score: ${alternative.relativeDealScore.toFixed(1)}). ${alternative.fitScore > bestDeal.fitScore ? "Higher growth potential" : "Lower risk profile"} could tip the balance with additional data.`
      );
    }
  }
  
  const aiVerdict = verdictLines.slice(0, 5).join(" ");
  
  return {
    deals: metrics,
    bestOverallDealId,
    lowestRiskDealId,
    highestUpsideDealId,
    aiVerdict,
  };
}
