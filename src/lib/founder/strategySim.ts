import "server-only";
import { getFounderMetrics } from "./founderMetrics";
import { getFunnelData } from "./funnelRepo";
import { getRevenueMetrics } from "./revenue";
import { getPartnerMetrics } from "./partners";

export type StrategyInputs = {
  track: 'all' | 'operational' | 'digital';
  listingsIncreasePct: 0 | 10 | 25 | 50;
  ndaConversionUpliftPts: 0 | 2 | 5 | 10;
  paidConversionUpliftPts: 0 | 0.5 | 1 | 2;
  partnerLeadIncreasePct: 0 | 10 | 25 | 50;
};

export type StrategyOutputs = {
  additionalNdaSigned: {
    low: number;
    base: number;
    high: number;
  };
  additionalEnquiries: {
    low: number;
    base: number;
    high: number;
  };
  additionalDealRooms: {
    low: number;
    base: number;
    high: number;
  };
  additionalPaidUsers: {
    low: number;
    base: number;
    high: number;
  };
  revenueImpact: {
    low: number | null;
    base: number | null;
    high: number | null;
    note?: string;
  };
  recommendedFocus: string[];
};

/**
 * Simulate strategy impact using rule-based heuristics.
 * All calculations are transparent and based on baseline metrics.
 */
export async function simulateStrategy(inputs: StrategyInputs): Promise<StrategyOutputs> {
  // Get baseline metrics
  const [metrics, funnel, revenue, partners] = await Promise.all([
    getFounderMetrics(inputs.track),
    getFunnelData('30d', inputs.track),
    getRevenueMetrics(inputs.track),
    getPartnerMetrics(inputs.track),
  ]);

  // Baseline values (last 30d)
  const baselineVisitors = metrics.visitors.value30d || 0;
  const baselineRegistrations = metrics.registrations.value30d || 0;
  const baselineListingViews = getListingViewsFromFunnel(funnel);
  const baselineNdaSigned = metrics.ndaSigned.value30d || 0;
  const baselineEnquiries = metrics.enquiries.value30d || 0;
  const baselineDealRooms = metrics.dealRoomsActive.value30d || 0;
  const baselinePaidUsers = revenue.paidUsers?.count || 0;
  const baselineMrr = revenue.mrr?.value || null;

  // Calculate conversion rates
  const baselineNdaConversionRate = baselineListingViews > 0 
    ? (baselineNdaSigned / baselineListingViews) * 100 
    : 0;
  const baselineEnquiryRateFromNda = baselineNdaSigned > 0 
    ? (baselineEnquiries / baselineNdaSigned) * 100 
    : 0;
  const baselinePaidConversionRate = baselineRegistrations > 0 
    ? (baselinePaidUsers / baselineRegistrations) * 100 
    : 0;
  const baselineDealRoomRateFromEnquiry = baselineEnquiries > 0 
    ? (baselineDealRooms / baselineEnquiries) * 100 
    : 0;

  // Simulate impacts

  // 1. Additional listing views from listings increase
  const additionalListingViews = baselineListingViews * (inputs.listingsIncreasePct / 100) * 0.4; // 40% of new listings get views
  const additionalListingViewsLow = additionalListingViews * 0.8;
  const additionalListingViewsHigh = additionalListingViews * 1.2;

  // 2. Additional NDAs signed
  const newNdaConversionRate = baselineNdaConversionRate + inputs.ndaConversionUpliftPts;
  const additionalNdaFromViews = (additionalListingViews * newNdaConversionRate) / 100;
  const additionalNdaFromUplift = baselineListingViews * (inputs.ndaConversionUpliftPts / 100);
  const additionalNdaBase = additionalNdaFromViews + additionalNdaFromUplift;
  const additionalNdaSigned = {
    low: Math.max(0, Math.round(additionalNdaBase * 0.8)),
    base: Math.max(0, Math.round(additionalNdaBase)),
    high: Math.max(0, Math.round(additionalNdaBase * 1.2)),
  };

  // 3. Additional enquiries
  const additionalEnquiriesFromNda = (additionalNdaSigned.base * baselineEnquiryRateFromNda) / 100;
  const partnerLeadBoost = baselineEnquiries * (inputs.partnerLeadIncreasePct / 100) * 0.3; // 30% multiplier
  const additionalEnquiriesBase = additionalEnquiriesFromNda + partnerLeadBoost;
  const additionalEnquiries = {
    low: Math.max(0, Math.round(additionalEnquiriesBase * 0.7)),
    base: Math.max(0, Math.round(additionalEnquiriesBase)),
    high: Math.max(0, Math.round(additionalEnquiriesBase * 1.3)),
  };

  // 4. Additional deal rooms
  const additionalDealRoomsBase = (additionalEnquiries.base * baselineDealRoomRateFromEnquiry) / 100;
  const additionalDealRooms = {
    low: Math.max(0, Math.round(additionalDealRoomsBase * 0.8)),
    base: Math.max(0, Math.round(additionalDealRoomsBase)),
    high: Math.max(0, Math.round(additionalDealRoomsBase * 1.2)),
  };

  // 5. Additional paid users
  const newPaidConversionRate = baselinePaidConversionRate + inputs.paidConversionUpliftPts;
  const additionalPaidUsersBase = (baselineRegistrations * newPaidConversionRate) / 100 - baselinePaidUsers;
  const additionalPaidUsers = {
    low: Math.max(0, Math.round(additionalPaidUsersBase * 0.8)),
    base: Math.max(0, Math.round(additionalPaidUsersBase)),
    high: Math.max(0, Math.round(additionalPaidUsersBase * 1.2)),
  };

  // 6. Revenue impact
  let revenueImpact: {
    low: number | null;
    base: number | null;
    high: number | null;
    note?: string;
  };

  if (baselineMrr !== null && baselinePaidUsers > 0) {
    const avgMrrPerUser = baselineMrr / baselinePaidUsers;
    revenueImpact = {
      low: additionalPaidUsers.low * avgMrrPerUser,
      base: additionalPaidUsers.base * avgMrrPerUser,
      high: additionalPaidUsers.high * avgMrrPerUser,
    };
  } else {
    revenueImpact = {
      low: null,
      base: null,
      high: null,
      note: "Insufficient data for MRR calculation",
    };
  }

  // Recommended focus
  const recommendedFocus = generateRecommendedFocus(
    inputs,
    additionalNdaSigned.base,
    additionalEnquiries.base,
    additionalPaidUsers.base,
    revenueImpact.base
  );

  return {
    additionalNdaSigned,
    additionalEnquiries,
    additionalDealRooms,
    additionalPaidUsers,
    revenueImpact,
    recommendedFocus,
  };
}

function getListingViewsFromFunnel(funnel: any): number {
  if (!funnel.steps || funnel.steps.length === 0) {
    return 0;
  }
  const listingViewStep = funnel.steps.find((s: any) => s.step === 'listing_viewed');
  return listingViewStep?.count || 0;
}

function generateRecommendedFocus(
  inputs: StrategyInputs,
  additionalNda: number,
  additionalEnquiries: number,
  additionalPaid: number,
  revenueImpact: number | null
): string[] {
  const focus: string[] = [];

  // Identify highest-impact lever
  const impacts = [
    { lever: 'listings', value: inputs.listingsIncreasePct, impact: additionalNda },
    { lever: 'ndaConversion', value: inputs.ndaConversionUpliftPts, impact: additionalNda },
    { lever: 'paidConversion', value: inputs.paidConversionUpliftPts, impact: additionalPaid },
    { lever: 'partnerLeads', value: inputs.partnerLeadIncreasePct, impact: additionalEnquiries },
  ];

  const activeLevers = impacts.filter(i => i.value > 0);
  
  if (activeLevers.length === 0) {
    focus.push('Adjust strategy inputs to see impact projections');
    return focus;
  }

  // Sort by impact
  activeLevers.sort((a, b) => b.impact - a.impact);

  const topLever = activeLevers[0];
  
  if (topLever.lever === 'listings') {
    focus.push(`Focus: Increase ${inputs.track === 'all' ? 'listings' : inputs.track} supply (${inputs.listingsIncreasePct}% increase)`);
    focus.push(`Expected impact: +${additionalNda} NDAs, +${additionalEnquiries} enquiries`);
  } else if (topLever.lever === 'ndaConversion') {
    focus.push(`Focus: Improve NDA conversion (+${inputs.ndaConversionUpliftPts} percentage points)`);
    focus.push(`Expected impact: +${additionalNda} NDAs signed`);
  } else if (topLever.lever === 'paidConversion') {
    focus.push(`Focus: Increase paid conversion (+${inputs.paidConversionUpliftPts} percentage points)`);
    focus.push(`Expected impact: +${additionalPaid} paid users`);
    if (revenueImpact !== null) {
      focus.push(`Revenue impact: $${revenueImpact.toLocaleString()}/month`);
    }
  } else if (topLever.lever === 'partnerLeads') {
    focus.push(`Focus: Increase partner lead volume (${inputs.partnerLeadIncreasePct}% increase)`);
    focus.push(`Expected impact: +${additionalEnquiries} enquiries`);
  }

  // Add secondary recommendations
  if (activeLevers.length > 1) {
    const secondLever = activeLevers[1];
    if (secondLever.impact > 0) {
      focus.push(`Secondary: ${getLeverName(secondLever.lever)} (+${Math.round(secondLever.impact)} impact)`);
    }
  }

  return focus;
}

function getLeverName(lever: string): string {
  const names: Record<string, string> = {
    listings: 'Increase listings supply',
    ndaConversion: 'Improve NDA conversion',
    paidConversion: 'Increase paid conversion',
    partnerLeads: 'Increase partner leads',
  };
  return names[lever] || lever;
}




