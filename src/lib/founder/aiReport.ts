import "server-only";
import { getFounderMetrics } from "./founderMetrics";
import { getFunnelData } from "./funnelRepo";
import { getRevenueMetrics } from "./revenue";
import { getDealMetrics } from "./deals";
import { getRiskMetrics } from "./risk";
import { getPartnerMetrics } from "./partners";
import { computeConfidence, ConfidenceLevel } from "./confidence";

export type ExecBrief = {
  generatedAt: string;
  period: {
    last7d: string;
    last30d: string;
  };
  executiveSummary: string[];
  byTrack: {
    operational: {
      listings: number | null;
      ndas: number | null;
      enquiries: number | null;
      dealRooms: number | null;
      momentum: "growing" | "stable" | "declining" | "insufficient_data";
    };
    digital: {
      listings: number | null;
      ndas: number | null;
      enquiries: number | null;
      dealRooms: number | null;
      momentum: "growing" | "stable" | "declining" | "insufficient_data";
    };
  };
  funnelLeaks: Array<{
    track: "all" | "operational" | "digital";
    step: string;
    dropPct: number;
    likelyCauses: string[];
    isLowVolume?: boolean;
  }>;
  revenueInsights: string[];
  partnerInsights: string[];
  riskSignals: string[];
  actionPlan30d: Array<{
    priority: "P0" | "P1" | "P2";
    title: string;
    rationale: string;
    metricTarget: string;
    owner: "Founder" | "Ops" | "Product" | "Partnerships";
    timeframe: string;
  }>;
  narrativeSummary: {
    momentum: string;
    constraint: string;
    nextAction: string;
  };
  assumptionsNotes: {
    coverageDays: number;
    sessions30d: number;
    estimatedMetrics: number;
    lowVolumeWarnings: number;
    missingSources: string[];
  };
  dataQualityNotes?: string[];
};

/**
 * Generate executive brief from captured data.
 * All insights must reference actual metrics.
 * Language adapts to confidence level for investor/board readiness.
 */
export async function generateExecBrief(track: 'all' | 'operational' | 'digital' = 'all'): Promise<ExecBrief> {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [metrics, funnel, revenue, deals, risk, partners, confidence] = await Promise.all([
    getFounderMetrics(track),
    getFunnelData('30d', track),
    getRevenueMetrics(track),
    getDealMetrics('30d', track),
    getRiskMetrics(),
    getPartnerMetrics(track),
    computeConfidence(),
  ]);

  const dataQualityNotes: string[] = [];
  if (metrics.visitors.isEstimated) dataQualityNotes.push('Visitor data is estimated');
  if (metrics.mrr.isEstimated) dataQualityNotes.push('MRR is estimated');
  if (funnel.isEstimated) dataQualityNotes.push('Funnel data is estimated');

  // Executive Summary
  const executiveSummary = generateExecutiveSummary(metrics, revenue, deals, dataQualityNotes);

  // Track breakdown (get both operational and digital metrics)
  const [metricsOperational, metricsDigital] = await Promise.all([
    getFounderMetrics('operational'),
    getFounderMetrics('digital'),
  ]);

  const byTrack = {
    operational: computeTrackMomentum(metricsOperational),
    digital: computeTrackMomentum(metricsDigital),
  };

  // Funnel leaks (confidence-aware)
  const funnelLeaks = identifyFunnelLeaks(funnel, track, confidence.level);

  // Revenue insights
  const revenueInsights = generateRevenueInsights(revenue, metrics, confidence.level);

  // Partner insights
  const partnerInsights = generatePartnerInsights(partners);

  // Risk signals (confidence-aware)
  const riskSignals = generateRiskSignals(risk, metrics, funnel, confidence.level);

  // Narrative summary
  const narrativeSummary = generateNarrativeSummary(metrics, revenue, funnel, confidence.level);

  // Assumptions & data notes
  const missingSources: string[] = [];
  if (partners.dataQualityNote) {
    missingSources.push('Partner lead data not configured');
  }
  if (revenue.mrr.value === null || revenue.mrr.value === 0) {
    missingSources.push('MRR calculation not available');
  }

  const assumptionsNotes = {
    coverageDays: confidence.coverageDays,
    sessions30d: confidence.sessions30d,
    estimatedMetrics: confidence.estimatedMetrics,
    lowVolumeWarnings: confidence.lowVolumeWarnings,
    missingSources,
  };

  // Action plan (investor-grade with owners)
  const actionPlan30d = generateActionPlan(metrics, funnel, revenue, deals, risk, partners, confidence.level);

  return {
    generatedAt: now.toISOString(),
    period: {
      last7d: sevenDaysAgo.toISOString().split('T')[0],
      last30d: thirtyDaysAgo.toISOString().split('T')[0],
    },
    executiveSummary,
    byTrack,
    funnelLeaks,
    revenueInsights,
    partnerInsights,
    riskSignals,
    actionPlan30d,
    narrativeSummary,
    assumptionsNotes,
    dataQualityNotes: dataQualityNotes.length > 0 ? dataQualityNotes : undefined,
  };
}

function generateExecutiveSummary(
  metrics: any,
  revenue: any,
  deals: any,
  dataQualityNotes: string[]
): string[] {
  const summary: string[] = [];

  // Visitors & Registrations
  if (metrics.visitors.value30d !== null && metrics.visitors.value30d > 0) {
    summary.push(`${metrics.visitors.value30d.toLocaleString()} visitors (30d)`);
    if (metrics.registrations.value30d !== null && metrics.registrations.value30d > 0) {
      const regRate = (metrics.registrations.value30d / metrics.visitors.value30d) * 100;
      summary.push(`${metrics.registrations.value30d.toLocaleString()} registrations (${regRate.toFixed(1)}% conversion)`);
    } else {
      summary.push('Insufficient data for registration conversion');
    }
  } else {
    summary.push('Insufficient data for visitor tracking');
  }

  // Revenue
  if (revenue.mrr !== null && revenue.mrr > 0) {
    summary.push(`MRR: $${revenue.mrr.toLocaleString()} (${revenue.paidUsers.toLocaleString()} paid users)`);
  } else {
    summary.push('Insufficient data for MRR calculation');
  }

  // Deal activity
  if (metrics.ndaSigned.value30d !== null && metrics.ndaSigned.value30d > 0) {
    summary.push(`${metrics.ndaSigned.value30d.toLocaleString()} NDAs signed`);
    if (metrics.enquiries.value30d !== null && metrics.enquiries.value30d > 0) {
      summary.push(`${metrics.enquiries.value30d.toLocaleString()} enquiries sent`);
    }
  }

  if (metrics.dealRoomsActive.value30d !== null && metrics.dealRoomsActive.value30d > 0) {
    summary.push(`${metrics.dealRoomsActive.value30d.toLocaleString()} active deal rooms`);
  }

  // Data quality note
  if (dataQualityNotes.length > 0) {
    summary.push(`Note: ${dataQualityNotes.length} metric(s) estimated due to incomplete data`);
  }

  return summary;
}

function computeTrackMomentum(metrics: any): {
  listings: number | null;
  ndas: number | null;
  enquiries: number | null;
  dealRooms: number | null;
  momentum: "growing" | "stable" | "declining" | "insufficient_data";
} {
  // For now, we don't have track-specific listing counts in metrics
  // This would require joining with listings table
  const ndas = metrics.ndaSigned.value30d;
  const enquiries = metrics.enquiries.value30d;
  const dealRooms = metrics.dealRoomsActive.value30d;

  // Determine momentum from deltas
  let momentum: "growing" | "stable" | "declining" | "insufficient_data" = "insufficient_data";

  if (metrics.ndaSigned.delta !== undefined && metrics.ndaSigned.deltaPercent !== undefined) {
    if (metrics.ndaSigned.deltaPercent > 10) {
      momentum = "growing";
    } else if (metrics.ndaSigned.deltaPercent < -10) {
      momentum = "declining";
    } else if (metrics.ndaSigned.deltaPercent !== null) {
      momentum = "stable";
    }
  }

  return {
    listings: null, // Would need listing counts by track
    ndas,
    enquiries,
    dealRooms,
    momentum,
  };
}

function identifyFunnelLeaks(funnel: any, track: 'all' | 'operational' | 'digital', confidenceLevel: ConfidenceLevel): Array<{
  track: "all" | "operational" | "digital";
  step: string;
  dropPct: number;
  likelyCauses: string[];
  isLowVolume?: boolean;
}> {
  const leaks: Array<{
    track: "all" | "operational" | "digital";
    step: string;
    dropPct: number;
    likelyCauses: string[];
    isLowVolume?: boolean;
  }> = [];

  if (!funnel.steps || funnel.steps.length === 0) {
    return leaks;
  }

  funnel.steps.forEach((step: any, index: number) => {
    if (index === 0) return; // Skip visitor step

    // Confidence-aware threshold: lower threshold for low confidence
    const threshold = confidenceLevel === 'low' ? 50 : confidenceLevel === 'medium' ? 40 : 30;
    
    if (step.dropOffRate >= threshold) {
      const causes = inferLikelyCauses(step.step, step.dropOffRate, step.isLowVolume, confidenceLevel);
      leaks.push({
        track,
        step: step.label,
        dropPct: step.dropOffRate,
        likelyCauses: causes,
        isLowVolume: step.isLowVolume,
      });
    }
  });

  return leaks.sort((a, b) => b.dropPct - a.dropPct).slice(0, 3); // Top 3 leaks
}

function inferLikelyCauses(step: string, dropPct: number, isLowVolume?: boolean, confidenceLevel?: ConfidenceLevel): string[] {
  const causes: string[] = [];

  // Confidence-aware language
  const isLowConfidence = confidenceLevel === 'low';
  const isMediumConfidence = confidenceLevel === 'medium';

  if (step === 'registered') {
    causes.push('Signup friction (form length, required fields)');
    causes.push('Trust signals missing (testimonials, security badges)');
  } else if (step === 'listing_viewed') {
    causes.push('Low listing quality (incomplete data, poor images)');
    causes.push('Search/discovery issues');
  } else if (step === 'nda_requested' || step === 'nda_signed') {
    causes.push('NDA process complexity');
    causes.push('Legal concerns or trust issues');
  } else if (step === 'enquiry_sent') {
    causes.push('Listing information gaps');
    causes.push('Buyer hesitation (pricing, terms unclear)');
  } else if (step === 'deal_room_created') {
    causes.push('Deal room onboarding friction');
    causes.push('Technical barriers');
  }

  // Confidence-aware severity language
  if (isLowVolume || isLowConfidence) {
    if (dropPct >= 70) {
      causes.push('Early signal: No conversions observed yet (low volume)');
    }
  } else if (isMediumConfidence) {
    if (dropPct >= 70) {
      causes.push('Emerging pattern: Significant drop-off observed');
    }
  } else {
    if (dropPct >= 70) {
      causes.push('Critical UX issue requiring immediate attention');
    }
  }

  return causes;
}

function generateRevenueInsights(revenue: any, metrics: any, confidenceLevel: ConfidenceLevel): string[] {
  const insights: string[] = [];
  const isLowConfidence = confidenceLevel === 'low';
  const isMediumConfidence = confidenceLevel === 'medium';

  if (revenue.mrr.value === null || revenue.mrr.value === 0) {
    if (isLowConfidence) {
      insights.push('Early signal: Revenue data collection in progress');
    } else {
      insights.push('Insufficient data for revenue analysis');
    }
    return insights;
  }

  if (revenue.paidUsers.count !== null && revenue.paidUsers.count > 0) {
    const avgMrrPerUser = revenue.mrr.value / revenue.paidUsers.count;
    insights.push(`Average MRR per paid user: $${avgMrrPerUser.toFixed(2)}`);
  }

  if (metrics.registrations.value30d !== null && metrics.registrations.value30d > 0 && revenue.paidUsers.count !== null && revenue.paidUsers.count > 0) {
    const paidConversion = (revenue.paidUsers.count / metrics.registrations.value30d) * 100;
    insights.push(`Paid conversion rate: ${paidConversion.toFixed(1)}% (${revenue.paidUsers.count} paid / ${metrics.registrations.value30d} registered)`);
    
    if (paidConversion < 5) {
      if (isLowConfidence) {
        insights.push('Early signal: Paid conversion appears low (verify with more data)');
      } else if (isMediumConfidence) {
        insights.push('Emerging pattern: Paid conversion below target, pricing/value review recommended');
      } else {
        insights.push('Low paid conversion suggests pricing/value proposition review needed');
      }
    }
  }

  if (revenue.revenueByTier && Array.isArray(revenue.revenueByTier) && revenue.revenueByTier.length > 0) {
    const topTier = revenue.revenueByTier.sort((a: any, b: any) => (b.mrr ?? 0) - (a.mrr ?? 0))[0];
    if (topTier && topTier.tier && topTier.mrr !== null) {
      insights.push(`Top revenue tier: ${topTier.tier} ($${topTier.mrr.toLocaleString()})`);
    }
  }

  return insights;
}

function generatePartnerInsights(partners: any): string[] {
  const insights: string[] = [];

  if (partners.dataQualityNote) {
    insights.push(partners.dataQualityNote);
    return insights;
  }

  if (partners.leadsByPartner.length === 0) {
    insights.push('No partner lead data available');
    return insights;
  }

  const totalLeads = partners.leadsByPartner.reduce((sum: number, p: any) => sum + p.leads, 0);
  insights.push(`Total partner leads: ${totalLeads.toLocaleString()}`);

  if (partners.leadsByTrack.operational !== null && partners.leadsByTrack.digital !== null) {
    const total = partners.leadsByTrack.operational + partners.leadsByTrack.digital;
    if (total > 0) {
      const opPct = (partners.leadsByTrack.operational / total) * 100;
      const digPct = (partners.leadsByTrack.digital / total) * 100;
      insights.push(`Track mix: ${opPct.toFixed(0)}% Operational, ${digPct.toFixed(0)}% Digital`);
    }
  }

  const topPartner = partners.leadsByPartner[0];
  if (topPartner) {
    insights.push(`Top partner: ${topPartner.partnerName} (${topPartner.leads} leads, ${topPartner.conversionRate || 0}% NDA conversion)`);
  }

  return insights;
}

function generateRiskSignals(risk: any, metrics: any, funnel: any, confidenceLevel: ConfidenceLevel): string[] {
  const signals: string[] = [];
  const isLowConfidence = confidenceLevel === 'low';
  const isMediumConfidence = confidenceLevel === 'medium';

  if (risk.highRiskSessions > 0) {
    if (isLowConfidence) {
      signals.push(`Early signal: ${risk.highRiskSessions} potential high-risk sessions (verify with more data)`);
    } else {
      signals.push(`${risk.highRiskSessions} high-risk sessions detected (fraud/abuse patterns)`);
    }
  }

  if (risk.suspiciousPatterns > 0) {
    if (isLowConfidence || isMediumConfidence) {
      signals.push(`Emerging pattern: ${risk.suspiciousPatterns} suspicious activity patterns identified`);
    } else {
      signals.push(`${risk.suspiciousPatterns} suspicious activity patterns identified`);
    }
  }

  if (risk.lowQualityListings > 0) {
    signals.push(`${risk.lowQualityListings} low-quality listings flagged (incomplete data, missing images)`);
  }

  // Declining trends (confidence-aware)
  if (metrics.registrations.delta !== undefined && metrics.registrations.delta < 0 && Math.abs(metrics.registrations.deltaPercent || 0) > 20) {
    signals.push(`Registration decline: ${Math.abs(metrics.registrations.deltaPercent || 0)}% decrease`);
  }

  if (metrics.ndaSigned.delta !== undefined && metrics.ndaSigned.delta < 0 && Math.abs(metrics.ndaSigned.deltaPercent || 0) > 25) {
    signals.push(`NDA activity declining: ${Math.abs(metrics.ndaSigned.deltaPercent || 0)}% decrease`);
  }

  // Funnel risks (confidence-aware)
  if (funnel.steps && funnel.steps.length > 0) {
    const visitorStep = funnel.steps.find((s: any) => s.step === 'visitor');
    const registeredStep = funnel.steps.find((s: any) => s.step === 'registered');
    if (visitorStep && registeredStep && visitorStep.count > 0 && registeredStep.count === 0) {
      if (isLowConfidence) {
        signals.push('Early signal: Zero registrations observed (verify tracking coverage)');
      } else {
        signals.push('Critical: Zero registrations despite visitor traffic');
      }
    }
  }

  if (signals.length === 0) {
    signals.push('No significant risk signals identified');
  }

  return signals;
}

function generateNarrativeSummary(
  metrics: any,
  revenue: any,
  funnel: any,
  confidenceLevel: ConfidenceLevel
): { momentum: string; constraint: string; nextAction: string } {
  // Momentum: What's working
  let momentum = 'Insufficient data to assess momentum';
  if (metrics.ndaSigned.value30d !== null && metrics.ndaSigned.deltaPercent !== null) {
    if (metrics.ndaSigned.deltaPercent > 10) {
      momentum = `NDA signings growing ${metrics.ndaSigned.deltaPercent.toFixed(0)}% (${metrics.ndaSigned.value30d} in 30d)`;
    } else if (metrics.ndaSigned.deltaPercent < -10) {
      momentum = `NDA signings declining ${Math.abs(metrics.ndaSigned.deltaPercent).toFixed(0)}% (${metrics.ndaSigned.value30d} in 30d)`;
    } else if (metrics.ndaSigned.value30d > 0) {
      momentum = `NDA signings stable at ${metrics.ndaSigned.value30d} (30d)`;
    }
  } else if (metrics.registrations.value30d !== null && metrics.registrations.deltaPercent !== null) {
    if (metrics.registrations.deltaPercent > 10) {
      momentum = `Registrations growing ${metrics.registrations.deltaPercent.toFixed(0)}% (${metrics.registrations.value30d} in 30d)`;
    } else if (metrics.registrations.value30d > 0) {
      momentum = `${metrics.registrations.value30d} registrations (30d)`;
    }
  }

  // Constraint: Biggest blocker
  let constraint = 'Insufficient data to identify constraints';
  if (funnel.steps && funnel.steps.length > 0) {
    const worstStep = funnel.steps.reduce((worst: any, current: any) => {
      if (current.step === 'visitor') return worst;
      return !worst || current.dropOffRate > worst.dropOffRate ? current : worst;
    }, null);
    if (worstStep && worstStep.dropOffRate >= 30) {
      if (confidenceLevel === 'low') {
        constraint = `Early signal: ${worstStep.label} shows ${worstStep.dropOffRate.toFixed(0)}% drop-off (low volume, verify)`;
      } else {
        constraint = `${worstStep.label} is the primary constraint (${worstStep.dropOffRate.toFixed(0)}% drop-off)`;
      }
    } else if (metrics.registrations.value30d !== null && metrics.registrations.value30d === 0) {
      constraint = 'Zero registrations - signup funnel needs immediate attention';
    } else if (revenue.mrr.value === null || revenue.mrr.value === 0) {
      constraint = 'Revenue conversion not yet established';
    }
  }

  // Next action: Top priority
  let nextAction = 'Insufficient data to recommend actions';
  if (funnel.steps && funnel.steps.length > 0) {
    const worstStep = funnel.steps.reduce((worst: any, current: any) => {
      if (current.step === 'visitor') return worst;
      return !worst || current.dropOffRate > worst.dropOffRate ? current : worst;
    }, null);
    if (worstStep && worstStep.dropOffRate >= 50) {
      nextAction = `Address ${worstStep.label} funnel leak (${worstStep.dropOffRate.toFixed(0)}% drop-off)`;
    } else if (metrics.registrations.value30d !== null && metrics.registrations.value30d > 0 && revenue.paidUsers.count !== null && revenue.paidUsers.count === 0) {
      nextAction = 'Activate paid conversion funnel (0 paid users from registrations)';
    } else if (metrics.ndaSigned.value30d !== null && metrics.ndaSigned.value30d > 0 && metrics.enquiries.value30d !== null && metrics.enquiries.value30d === 0) {
      nextAction = 'Improve NDA-to-enquiry conversion (0 enquiries from signed NDAs)';
    } else if (metrics.visitors.value30d !== null && metrics.visitors.value30d > 0 && metrics.registrations.value30d !== null && metrics.registrations.value30d === 0) {
      nextAction = 'Fix registration funnel (0 registrations from visitors)';
    }
  }

  return { momentum, constraint, nextAction };
}

function generateActionPlan(
  metrics: any,
  funnel: any,
  revenue: any,
  deals: any,
  risk: any,
  partners: any,
  confidenceLevel: ConfidenceLevel
): Array<{
  priority: "P0" | "P1" | "P2";
  title: string;
  rationale: string;
  metricTarget: string;
  owner: "Founder" | "Ops" | "Product" | "Partnerships";
  timeframe: string;
}> {
  const plan: Array<{
    priority: "P0" | "P1" | "P2";
    title: string;
    rationale: string;
    metricTarget: string;
    owner: "Founder" | "Ops" | "Product" | "Partnerships";
    timeframe: string;
  }> = [];

  // P0: Critical issues
  if (funnel.steps && funnel.steps.length > 0) {
    const worstStep = funnel.steps.reduce((worst: any, current: any) => {
      if (current.step === 'visitor') return worst;
      return !worst || current.dropOffRate > worst.dropOffRate ? current : worst;
    }, null);

    if (worstStep && worstStep.dropOffRate >= 70) {
      plan.push({
        priority: "P0",
        title: `Fix critical funnel leak at ${worstStep.label}`,
        rationale: `${worstStep.dropOffRate}% drop-off rate indicates critical UX issue`,
        metricTarget: `Reduce ${worstStep.label} drop-off to <50% within 30 days`,
        owner: "Product",
        timeframe: "30 days",
      });
    }
  }

  if (risk.highRiskSessions > 10) {
    plan.push({
      priority: "P0",
      title: 'Address high-risk session patterns',
      rationale: `${risk.highRiskSessions} high-risk sessions detected - potential fraud/abuse`,
      metricTarget: 'Reduce high-risk sessions to <5 within 14 days',
      owner: "Ops",
      timeframe: "14 days",
    });
  }

  // P1: High-impact improvements
  if (metrics.visitors.value30d > 0 && metrics.registrations.value30d > 0) {
    const regRate = (metrics.registrations.value30d / metrics.visitors.value30d) * 100;
    if (regRate < 3) {
      plan.push({
        priority: "P1",
        title: 'Improve registration conversion',
        rationale: `Current rate: ${regRate.toFixed(1)}% (industry benchmark: 3-5%)`,
        metricTarget: `Increase registration conversion to 3%+ (target: ${Math.round(metrics.visitors.value30d * 0.03)} registrations) within 30 days`,
        owner: "Product",
        timeframe: "30 days",
      });
    }
  }

  if (metrics.registrations.value30d !== null && metrics.registrations.value30d > 0 && revenue.paidUsers.count !== null && revenue.paidUsers.count > 0) {
    const paidRate = (revenue.paidUsers.count / metrics.registrations.value30d) * 100;
    if (paidRate < 5) {
      plan.push({
        priority: "P1",
        title: 'Increase paid user conversion',
        rationale: `Current rate: ${paidRate.toFixed(1)}% (target: 5%+)`,
        metricTarget: `Increase paid conversion to 5%+ (target: ${Math.round(metrics.registrations.value30d * 0.05)} paid users) within 45 days`,
        owner: "Product",
        timeframe: "45 days",
      });
    }
  }

  if (metrics.ndaSigned.value30d !== null && metrics.ndaSigned.value30d > 0 && metrics.enquiries.value30d !== null && metrics.enquiries.value30d > 0) {
    const enquiryRate = (metrics.enquiries.value30d / metrics.ndaSigned.value30d) * 100;
    if (enquiryRate < 40) {
      plan.push({
        priority: "P1",
        title: 'Improve NDA-to-enquiry conversion',
        rationale: `Current rate: ${enquiryRate.toFixed(1)}% (target: 40%+)`,
        metricTarget: `Increase enquiry rate to 40%+ (target: ${Math.round(metrics.ndaSigned.value30d * 0.4)} enquiries) within 30 days`,
        owner: "Product",
        timeframe: "30 days",
      });
    }
  }

  // P2: Growth initiatives
  if (metrics.registrations.delta !== undefined && metrics.registrations.delta > 0) {
    plan.push({
      priority: "P2",
      title: 'Scale successful acquisition channels',
      rationale: `Registration growth trend: +${metrics.registrations.deltaPercent || 0}%`,
      metricTarget: `Maintain or accelerate growth rate over next 60 days`,
      owner: "Founder",
      timeframe: "60 days",
    });
  }

  if (partners.leadsByPartner && partners.leadsByPartner.length > 0) {
    const avgConversion = partners.leadsByPartner.reduce((sum: number, p: any) => sum + (p.conversionRate || 0), 0) / partners.leadsByPartner.length;
    if (avgConversion < 20) {
      plan.push({
        priority: "P2",
        title: 'Improve partner lead quality',
        rationale: `Average partner NDA conversion: ${avgConversion.toFixed(1)}%`,
        owner: "Partnerships",
        timeframe: "60 days",
        metricTarget: 'Increase average partner conversion to 20%+',
      });
    }
  }

  if (plan.length === 0) {
    plan.push({
      priority: "P2",
      title: 'Maintain current momentum',
      rationale: 'No critical issues identified - focus on optimization',
      metricTarget: 'Monitor key metrics closely over next 30 days',
      owner: "Founder",
      timeframe: "30 days",
    });
  }

  return plan;
}

