import "server-only";
import { createClient } from "@/utils/supabase/server";
import { getFounderMetrics } from "./founderMetrics";
import { getFunnelData } from "./funnelRepo";
import { computeGrowthBlockers } from "./growthBlockers";

export type ExecReport = {
  id?: string;
  generated_at: string;
  period: '7d' | '30d';
  executive_summary: string;
  whats_working: string[];
  whats_broken: string[];
  risks: string[];
  next_30_days_plan: string[];
  data_quality_note?: string;
};

/**
 * Get executive report from ai_exec_reports if available, otherwise generate deterministically.
 */
export async function getExecReport(): Promise<ExecReport> {
  const supabase = await createClient();
  const sb: any = supabase;

  try {
    // Try to fetch latest report from ai_exec_reports
    const { data, error } = await sb
      .from('ai_exec_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        generated_at: data.created_at || new Date().toISOString(),
        period: (data.period as '7d' | '30d') || '30d',
        executive_summary: data.executive_summary || '',
        whats_working: Array.isArray(data.whats_working) ? data.whats_working : [],
        whats_broken: Array.isArray(data.whats_broken) ? data.whats_broken : [],
        risks: Array.isArray(data.risks) ? data.risks : [],
        next_30_days_plan: Array.isArray(data.next_30_days_plan) ? data.next_30_days_plan : [],
        data_quality_note: data.data_quality_note || undefined,
      };
    }
  } catch {
    // Table doesn't exist, generate deterministically
  }

  // Generate deterministic report from metrics
  return await generateDeterministicReport();
}

async function generateDeterministicReport(): Promise<ExecReport> {
  const [metrics, funnel, blockers] = await Promise.all([
    getFounderMetrics(),
    getFunnelData('30d'),
    computeGrowthBlockers(),
  ]);

  const dataQualityNotes: string[] = [];
  if (metrics.visitors.isEstimated) dataQualityNotes.push('Visitor data is estimated');
  if (metrics.mrr.isEstimated) dataQualityNotes.push('MRR is estimated');
  if (funnel.isEstimated) dataQualityNotes.push('Funnel data is estimated');

  // Executive Summary
  const totalRegistrations = metrics.registrations.value30d;
  const totalVisitors = metrics.visitors.value30d;
  const conversionRate = totalVisitors > 0 ? (totalRegistrations / totalVisitors) * 100 : 0;
  const mrr = metrics.mrr.value30d;
  const activeDealRooms = metrics.dealRoomsActive.value30d;

  const executiveSummary = generateExecutiveSummary({
    registrations: totalRegistrations,
    visitors: totalVisitors,
    conversionRate,
    mrr,
    activeDealRooms,
    ndaSigned: metrics.ndaSigned.value30d,
    enquiries: metrics.enquiries.value30d,
    hasDataQualityIssues: dataQualityNotes.length > 0,
  });

  // What's Working
  const whatsWorking = generateWhatsWorking(metrics, funnel);

  // What's Broken
  const whatsBroken = generateWhatsBroken(metrics, funnel, blockers);

  // Risks
  const risks = generateRisks(metrics, funnel, blockers);

  // Next 30 Days Plan
  const next30DaysPlan = generateNext30DaysPlan(metrics, funnel, blockers);

  return {
    generated_at: new Date().toISOString(),
    period: '30d',
    executive_summary: executiveSummary,
    whats_working: whatsWorking,
    whats_broken: whatsBroken,
    risks: risks,
    next_30_days_plan: next30DaysPlan,
    data_quality_note: dataQualityNotes.length > 0 ? dataQualityNotes.join('; ') : undefined,
  };
}

function generateExecutiveSummary(params: {
  registrations: number;
  visitors: number;
  conversionRate: number;
  mrr: number;
  activeDealRooms: number;
  ndaSigned: number;
  enquiries: number;
  hasDataQualityIssues: boolean;
}): string {
  const { registrations, visitors, conversionRate, mrr, activeDealRooms, ndaSigned, enquiries, hasDataQualityIssues } = params;

  let summary = `Over the last 30 days, `;

  if (visitors > 0) {
    summary += `${visitors.toLocaleString()} visitors `;
    if (registrations > 0) {
      summary += `generated ${registrations.toLocaleString()} registrations (${conversionRate.toFixed(1)}% conversion). `;
    } else {
      summary += `but insufficient data captured for registration conversion. `;
    }
  } else {
    summary += `insufficient data captured for visitor tracking. `;
  }

  if (mrr > 0) {
    summary += `MRR stands at $${mrr.toLocaleString()}. `;
  } else {
    summary += `Insufficient data captured for MRR calculation. `;
  }

  if (ndaSigned > 0) {
    summary += `${ndaSigned.toLocaleString()} NDAs were signed, leading to `;
    if (enquiries > 0) {
      summary += `${enquiries.toLocaleString()} enquiries. `;
    } else {
      summary += `insufficient data captured for enquiry tracking. `;
    }
  } else {
    summary += `Insufficient data captured for NDA activity. `;
  }

  if (activeDealRooms > 0) {
    summary += `${activeDealRooms.toLocaleString()} deal rooms are currently active. `;
  } else {
    summary += `No active deal rooms at this time. `;
  }

  if (hasDataQualityIssues) {
    summary += `Note: Some metrics are estimated due to incomplete data capture.`;
  }

  return summary;
}

function generateWhatsWorking(metrics: any, funnel: any): string[] {
  const working: string[] = [];

  // Check registration growth
  if (metrics.registrations.delta && metrics.registrations.delta > 0 && metrics.registrations.deltaPercent && metrics.registrations.deltaPercent > 10) {
    working.push(`Strong registration growth: ${metrics.registrations.deltaPercent}% increase over previous period`);
  }

  // Check NDA conversion
  if (funnel.steps.length > 0) {
    const ndaStep = funnel.steps.find((s: any) => s.step === 'nda_signed');
    const ndaRequestedStep = funnel.steps.find((s: any) => s.step === 'nda_requested');
    if (ndaStep && ndaRequestedStep && ndaStep.conversionRate >= 70) {
      working.push(`High NDA signing rate: ${ndaStep.conversionRate}% of requests result in signatures`);
    }
  }

  // Check deal room activity
  if (metrics.dealRoomsActive.value30d > 0 && metrics.dealRoomsActive.delta && metrics.dealRoomsActive.delta > 0) {
    working.push(`Growing deal room activity: ${metrics.dealRoomsActive.delta} new deal rooms created`);
  }

  // Check enquiry activity
  if (metrics.enquiries.delta && metrics.enquiries.delta > 0 && metrics.enquiries.deltaPercent && metrics.enquiries.deltaPercent > 15) {
    working.push(`Enquiry volume increasing: ${metrics.enquiries.deltaPercent}% growth`);
  }

  // Check paid user growth
  if (metrics.paidUsers.delta && metrics.paidUsers.delta > 0) {
    working.push(`Paid user base growing: ${metrics.paidUsers.delta} new paid users`);
  }

  if (working.length === 0) {
    working.push('Insufficient data captured to identify strong performance areas');
  }

  return working;
}

function generateWhatsBroken(metrics: any, funnel: any, blockers: any[]): string[] {
  const broken: string[] = [];

  // Check registration conversion
  if (metrics.visitors.value30d > 0 && metrics.registrations.value30d > 0) {
    const regRate = (metrics.registrations.value30d / metrics.visitors.value30d) * 100;
    if (regRate < 2) {
      broken.push(`Low registration conversion: Only ${regRate.toFixed(1)}% of visitors are registering`);
    }
  } else if (metrics.visitors.value30d === 0) {
    broken.push('Insufficient data captured for visitor-to-registration conversion analysis');
  }

  // Check funnel leaks
  if (funnel.steps.length > 0) {
    const maxDropOff = Math.max(...funnel.steps.map((s: any) => s.dropOffRate));
    const worstStep = funnel.steps.find((s: any) => s.dropOffRate === maxDropOff && s.step !== 'visitor');
    if (worstStep && worstStep.dropOffRate >= 50) {
      broken.push(`Major funnel leak at ${worstStep.label}: ${worstStep.dropOffRate}% drop-off rate`);
    }
  }

  // Check growth blockers
  const highSeverityBlockers = blockers.filter(b => b.severity === 'high');
  if (highSeverityBlockers.length > 0) {
    broken.push(`${highSeverityBlockers.length} high-severity growth blocker(s) identified (see Growth Blockers panel)`);
  }

  // Check paid conversion
  if (metrics.registrations.value30d > 0) {
    const paidRate = (metrics.paidUsers.value30d / metrics.registrations.value30d) * 100;
    if (paidRate < 5 && metrics.registrations.value30d > 50) {
      broken.push(`Low paid user conversion: Only ${paidRate.toFixed(1)}% of registrations convert to paid plans`);
    }
  }

  // Check NDA to enquiry conversion
  if (metrics.ndaSigned.value30d > 0 && metrics.enquiries.value30d > 0) {
    const enquiryRate = (metrics.enquiries.value30d / metrics.ndaSigned.value30d) * 100;
    if (enquiryRate < 30) {
      broken.push(`Low NDA-to-enquiry conversion: Only ${enquiryRate.toFixed(1)}% of NDA signers send enquiries`);
    }
  } else if (metrics.ndaSigned.value30d === 0) {
    broken.push('Insufficient data captured for NDA-to-enquiry conversion analysis');
  }

  if (broken.length === 0) {
    broken.push('No critical issues identified with current data');
  }

  return broken;
}

function generateRisks(metrics: any, funnel: any, blockers: any[]): string[] {
  const risks: string[] = [];

  // Declining trends
  if (metrics.registrations.delta && metrics.registrations.delta < 0 && Math.abs(metrics.registrations.deltaPercent || 0) > 20) {
    risks.push(`Registration decline: ${Math.abs(metrics.registrations.deltaPercent || 0)}% decrease could indicate market saturation or competitive pressure`);
  }

  if (metrics.ndaSigned.delta && metrics.ndaSigned.delta < 0 && Math.abs(metrics.ndaSigned.deltaPercent || 0) > 25) {
    risks.push(`NDA activity declining: ${Math.abs(metrics.ndaSigned.deltaPercent || 0)}% decrease suggests buyer interest may be waning`);
  }

  // Low engagement
  if (metrics.dealRoomsActive.value30d === 0 && metrics.ndaSigned.value30d > 10) {
    risks.push('Deal room creation not keeping pace with NDA signings - potential friction in deal room onboarding');
  }

  // Revenue risks
  if (metrics.mrr.value30d > 0 && metrics.paidUsers.delta && metrics.paidUsers.delta < 0) {
    risks.push('Paid user base shrinking - monitor churn and retention closely');
  }

  // Data quality risks
  if (metrics.visitors.isEstimated || metrics.mrr.isEstimated) {
    risks.push('Data capture gaps may mask underlying trends - prioritize analytics instrumentation');
  }

  // Funnel risks
  if (funnel.steps.length > 0) {
    const visitorStep = funnel.steps.find((s: any) => s.step === 'visitor');
    const registeredStep = funnel.steps.find((s: any) => s.step === 'registered');
    if (visitorStep && registeredStep && visitorStep.count > 0 && registeredStep.count === 0) {
      risks.push('Zero registrations despite visitor traffic - critical signup flow issue');
    }
  }

  if (risks.length === 0) {
    risks.push('No significant risks identified with current data');
  }

  return risks;
}

function generateNext30DaysPlan(metrics: any, funnel: any, blockers: any[]): string[] {
  const plan: string[] = [];

  // Address high-severity blockers
  const highBlockers = blockers.filter(b => b.severity === 'high');
  if (highBlockers.length > 0) {
    plan.push(`Address ${highBlockers.length} high-severity growth blocker(s): ${highBlockers.map(b => b.title).join(', ')}`);
  }

  // Fix major funnel leaks
  if (funnel.steps.length > 0) {
    const worstStep = funnel.steps.reduce((worst: any, current: any) => {
      if (current.step === 'visitor') return worst;
      return !worst || current.dropOffRate > worst.dropOffRate ? current : worst;
    }, null);

    if (worstStep && worstStep.dropOffRate >= 50) {
      plan.push(`Fix major leak at ${worstStep.label} (${worstStep.dropOffRate}% drop-off) - prioritize UX improvements`);
    }
  }

  // Improve registration conversion
  if (metrics.visitors.value30d > 0 && metrics.registrations.value30d > 0) {
    const regRate = (metrics.registrations.value30d / metrics.visitors.value30d) * 100;
    if (regRate < 3) {
      plan.push(`Improve registration conversion (currently ${regRate.toFixed(1)}%) - test signup flow optimizations`);
    }
  }

  // Boost paid conversion
  if (metrics.registrations.value30d > 0) {
    const paidRate = (metrics.paidUsers.value30d / metrics.registrations.value30d) * 100;
    if (paidRate < 5 && metrics.registrations.value30d > 50) {
      plan.push(`Increase paid user conversion (currently ${paidRate.toFixed(1)}%) - review pricing and value proposition`);
    }
  }

  // Improve NDA to enquiry conversion
  if (metrics.ndaSigned.value30d > 0 && metrics.enquiries.value30d > 0) {
    const enquiryRate = (metrics.enquiries.value30d / metrics.ndaSigned.value30d) * 100;
    if (enquiryRate < 40) {
      plan.push(`Improve NDA-to-enquiry conversion (currently ${enquiryRate.toFixed(1)}%) - enhance listing quality and buyer experience`);
    }
  }

  // Data quality improvements
  if (metrics.visitors.isEstimated || metrics.mrr.isEstimated) {
    plan.push('Improve data capture: Implement comprehensive analytics_events tracking for accurate metrics');
  }

  // Growth initiatives
  if (metrics.registrations.delta && metrics.registrations.delta > 0) {
    plan.push(`Capitalize on registration growth trend: Scale successful acquisition channels`);
  }

  if (plan.length === 0) {
    plan.push('Maintain current momentum and monitor key metrics closely');
  }

  return plan;
}

