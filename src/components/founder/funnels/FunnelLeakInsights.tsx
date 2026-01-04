import { FunnelData, FunnelStep } from '@/lib/founder/funnelRepo';
import { AlertTriangle, TrendingDown } from 'lucide-react';

interface FunnelLeakInsightsProps {
  funnel: FunnelData;
}

export type LeakInsight = {
  step: string;
  label: string;
  dropOffRate: number;
  likelyCauses: string[];
  severity: 'high' | 'medium' | 'low';
};

function computeLeakInsights(funnel: FunnelData): LeakInsight[] {
  const insights: LeakInsight[] = [];

  // Ensure steps is properly typed
  const steps = (funnel?.steps ?? []) as FunnelStep[];
  if (steps.length === 0) return insights;

  // Find the step with the highest drop-off rate
  let maxDropOff = 0;
  let maxDropOffStep: FunnelStep | null = null;

  steps.forEach((step, index) => {
    if (index > 0 && step.dropOffRate > maxDropOff) {
      maxDropOff = step.dropOffRate;
      maxDropOffStep = step;
    }
  });

  if (!maxDropOffStep) return insights;

  // Generate likely causes based on the step
  const likelyCauses: string[] = [];
  
  // Low-volume safeguard: avoid strong language unless volume >= 50
  // TypeScript narrowing: after null check, maxDropOffStep is FunnelStep
  const currentStep: FunnelStep = maxDropOffStep;
  const sampleSize = currentStep.sampleSize ?? 0;
  const isLowVolume = currentStep.isLowVolume ?? (sampleSize < 20);
  
  // Adjust severity based on volume
  let severity: 'high' | 'medium' | 'low';
  if (isLowVolume) {
    // Low volume: cap severity at 'medium' and add note
    severity = maxDropOff >= 50 ? 'medium' : 'low';
    likelyCauses.push('Early signal (low volume - sample size < 20)');
  } else {
    // Normal volume: use standard thresholds
    severity = maxDropOff >= 50 ? 'high' : maxDropOff >= 25 ? 'medium' : 'low';
  }

  switch (currentStep.step) {
    case 'registered':
      likelyCauses.push('Signup flow may be too complex or unclear value proposition');
      likelyCauses.push('Registration form may have friction points');
      likelyCauses.push('Lack of social proof or trust signals');
      break;
    case 'listing_viewed':
      likelyCauses.push('Listings may not be discoverable or relevant');
      likelyCauses.push('Search/filter experience may need improvement');
      likelyCauses.push('Listings may lack compelling descriptions or images');
      break;
    case 'nda_requested':
      likelyCauses.push('NDA process may be perceived as too complex or risky');
      likelyCauses.push('Buyers may not see enough value to proceed');
      likelyCauses.push('Listing quality may not meet buyer expectations');
      break;
    case 'nda_signed':
      likelyCauses.push('NDA signing process may have technical issues');
      likelyCauses.push('Legal language may be too complex or intimidating');
      likelyCauses.push('Buyers may be abandoning during document review');
      break;
    case 'enquiry_sent':
      likelyCauses.push('Buyers may not have enough information to make enquiry');
      likelyCauses.push('Enquiry form may be too long or complex');
      likelyCauses.push('Lack of seller responsiveness may discourage enquiries');
      break;
    case 'deal_room_created':
      likelyCauses.push('Deal room creation process may have friction');
      likelyCauses.push('Buyers may not see value in accessing deal room');
      likelyCauses.push('Technical issues may prevent deal room creation');
      break;
    case 'message_sent':
      likelyCauses.push('Messaging interface may be unclear or hard to use');
      likelyCauses.push('Buyers may not know what to ask or how to engage');
      likelyCauses.push('Lack of seller engagement may discourage messaging');
      break;
    default:
      likelyCauses.push('Review user journey and identify friction points');
      likelyCauses.push('Consider A/B testing to improve conversion');
  }

  insights.push({
    step: currentStep.step,
    label: currentStep.label,
    dropOffRate: currentStep.dropOffRate,
    likelyCauses,
    severity,
  });

  // Find second highest drop-off if significant
  let secondMaxDropOff = 0;
  let secondMaxDropOffStep: FunnelStep | null = null;

  steps.forEach((step, index) => {
    if (index > 0 && step.dropOffRate > secondMaxDropOff && step.step !== currentStep.step && step.dropOffRate >= 20) {
      secondMaxDropOff = step.dropOffRate;
      secondMaxDropOffStep = step;
    }
  });

  if (secondMaxDropOffStep) {
    const secondCauses: string[] = [];
    // TypeScript narrowing: after null check, secondMaxDropOffStep is FunnelStep
    const secondStep: FunnelStep = secondMaxDropOffStep;
    const secondSampleSize = secondStep.sampleSize ?? 0;
    const secondIsLowVolume = secondStep.isLowVolume ?? (secondSampleSize < 20);
    
    if (secondIsLowVolume) {
      secondCauses.push('Early signal (low volume - sample size < 20)');
    }
    
    switch (secondStep.step) {
      case 'registered':
        secondCauses.push('Consider simplifying signup or adding guest browsing');
        break;
      case 'listing_viewed':
        secondCauses.push('Improve listing discoverability and relevance');
        break;
      case 'nda_requested':
        secondCauses.push('Make NDA process more transparent and user-friendly');
        break;
      case 'nda_signed':
        secondCauses.push('Streamline NDA signing experience');
        break;
      case 'enquiry_sent':
        secondCauses.push('Provide more listing information upfront');
        break;
      case 'deal_room_created':
        secondCauses.push('Simplify deal room access and onboarding');
        break;
      case 'message_sent':
        secondCauses.push('Improve messaging UX and provide conversation starters');
        break;
    }

    if (secondCauses.length > 0) {
      // Adjust severity for low volume
      let secondSeverity: 'high' | 'medium' | 'low';
      if (secondIsLowVolume) {
        secondSeverity = secondMaxDropOff >= 50 ? 'medium' : 'low';
      } else {
        secondSeverity = secondMaxDropOff >= 30 ? 'medium' : 'low';
      }
      
      insights.push({
        step: secondStep.step,
        label: secondStep.label,
        dropOffRate: secondStep.dropOffRate,
        likelyCauses: secondCauses,
        severity: secondSeverity,
      });
    }
  }

  return insights;
}

export default function FunnelLeakInsights({ funnel }: FunnelLeakInsightsProps) {
  const insights = computeLeakInsights(funnel);

  if (insights.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Leak Detection</h3>
        <div className="py-8 text-center">
          <p className="text-slate-500">No significant leaks detected in the funnel.</p>
        </div>
      </div>
    );
  }

  const severityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown className="w-5 h-5 text-red-600" />
        <h3 className="text-lg font-semibold text-slate-900">Leak Detection</h3>
      </div>
      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.step}
            className="p-4 rounded-lg border bg-slate-50"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle
                className={`w-5 h-5 ${
                  insight.severity === 'high' ? 'text-red-600' :
                  insight.severity === 'medium' ? 'text-amber-600' :
                  'text-blue-600'
                }`}
              />
              <h4 className="text-sm font-semibold text-slate-900">
                {insight.label} - {insight.dropOffRate}% drop-off
              </h4>
              <span className={`text-xs px-2 py-0.5 rounded border ${severityColors[insight.severity]}`}>
                {insight.severity}
              </span>
            </div>
            <div className="ml-7">
              <p className="text-xs font-medium text-slate-700 mb-2">Likely causes:</p>
              <ul className="space-y-1">
                {insight.likelyCauses.map((cause, index) => (
                  <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-slate-400 mt-1">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

