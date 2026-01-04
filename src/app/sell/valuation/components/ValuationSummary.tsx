'use client';

import { useState } from 'react';
import { Copy, Mail, CheckCircle2 } from 'lucide-react';

interface ValuationSummaryProps {
  track?: 'operational' | 'digital' | null;
  stepData?: Record<string, any>;
  readinessScore?: number;
  readinessPillars?: {
    profile: number;
    financial: number;
    risk: number;
    intent: number;
  };
}

export default function ValuationSummary({
  track,
  stepData,
  readinessScore = 0,
  readinessPillars,
}: ValuationSummaryProps) {
  const [copied, setCopied] = useState(false);

  // Defensive: ensure stepData is an object
  const safeStepData = stepData && typeof stepData === 'object' ? stepData : {};

  // Calculate valuation range (same logic as ValuationPreviewStep)
  const calculateValuationRange = () => {
    if (track === 'operational') {
      return {
        min: '$500,000',
        max: '$1,200,000',
        midpoint: '$850,000',
      };
    } else if (track === 'digital') {
      return {
        min: '$200,000',
        max: '$800,000',
        midpoint: '$500,000',
      };
    }
    return {
      min: '$300,000',
      max: '$1,000,000',
      midpoint: '$650,000',
    };
  };

  const valuationRange = calculateValuationRange();

  // Calculate readiness pillars if not provided
  const calculateReadinessPillars = () => {
    if (readinessPillars) return readinessPillars;

    const profile = (safeStepData?.profile && typeof safeStepData.profile === 'object')
      ? safeStepData.profile
      : {};
    const financials = (safeStepData?.financials && typeof safeStepData.financials === 'object')
      ? safeStepData.financials
      : {};
    const risk = (safeStepData?.risk && typeof safeStepData.risk === 'object')
      ? safeStepData.risk
      : {};

    let profileScore = 0;
    let financialScore = 0;
    let riskScore = 0;
    let intentScore = 0;

    // Profile (max 25)
    if (track === 'operational') {
      if (profile.category) profileScore += 5;
      if (profile.city) profileScore += 5;
      if (profile.country) profileScore += 5;
      if (profile.yearsInOperation) profileScore += 5;
      if (profile.ownershipStructure) profileScore += 5;
    } else if (track === 'digital') {
      if (profile.businessModel) profileScore += 5;
      if (profile.primaryMarket) profileScore += 5;
      if (profile.yearsLive) profileScore += 5;
      if (profile.ownerInvolvement) profileScore += 5;
      if (Object.keys(profile).length >= 3) profileScore += 5;
    }

    // Financial (max 30)
    if (financials.revenueRange) financialScore += 10;
    if (track === 'operational' && financials.ebitdaRange) financialScore += 10;
    if (track === 'digital' && financials.grossMarginRange) financialScore += 10;
    if (financials.revenueTrend || financials.growthRateRange) financialScore += 10;

    // Risk (max 25)
    const riskKeys = Object.keys(risk);
    riskScore = Math.min(riskKeys.length * 5, 25);

    // Intent (max 20)
    if (safeStepData?.intent) intentScore = 20;

    return {
      profile: Math.round((profileScore / 25) * 100),
      financial: Math.round((financialScore / 30) * 100),
      risk: Math.round((riskScore / 25) * 100),
      intent: Math.round((intentScore / 20) * 100),
    };
  };

  const pillars = calculateReadinessPillars();

  // Generate top 3 improvement actions (rules-based)
  const getImprovementActions = () => {
    const actions: string[] = [];

    // Check profile gaps
    if (pillars.profile < 80) {
      if (track === 'operational') {
        actions.push('Complete business profile: Add category, location, years in operation, and ownership structure');
      } else {
        actions.push('Complete business profile: Add business model, primary market, years live, and owner involvement');
      }
    }

    // Check financial gaps
    if (pillars.financial < 80) {
      if (track === 'operational') {
        actions.push('Add financial details: Revenue range, EBITDA range, and revenue trend improve valuation accuracy');
      } else {
        actions.push('Add financial details: Revenue range, gross margin, and growth rate improve valuation accuracy');
      }
    }

    // Check risk gaps
    if (pillars.risk < 80) {
      if (track === 'operational') {
        actions.push('Complete risk assessment: Property type, lease status, customer concentration, and key person dependency');
      } else {
        actions.push('Complete risk assessment: Platform dependency, traffic concentration, churn awareness, and operational maturity');
      }
    }

    // Check intent
    if (pillars.intent < 100) {
      actions.push('Clarify your intent: Specify whether you want to understand value, prepare for sale, explore options, or benchmark');
    }

    // Return top 3, or generic if none
    if (actions.length === 0) {
      return [
        'Review and verify all financial documents',
        'Gather recent tax returns and financial statements',
        'Prepare a detailed business description',
      ];
    }

    return actions.slice(0, 3);
  };

  const improvementActions = getImprovementActions();

  // Generate summary text for copying
  const generateSummaryText = () => {
    const trackLabel = track === 'operational' ? 'Operational Business' : track === 'digital' ? 'Digital Business' : 'Business';
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `Valuation Summary - ${trackLabel}
Generated: ${date}

Indicative Valuation Range:
${valuationRange.min} - ${valuationRange.max}
Midpoint: ${valuationRange.midpoint}

Readiness Score: ${readinessScore}%

Pillar Scores:
- Profile Completeness: ${pillars.profile}%
- Financial Clarity: ${pillars.financial}%
- Risk Assessment: ${pillars.risk}%
- Intent Clarity: ${pillars.intent}%

Top Improvement Actions:
${improvementActions.map((action, i) => `${i + 1}. ${action}`).join('\n')}

---
Disclaimer: Indicative only. Not an appraisal.
`;
  };

  const handleCopy = async () => {
    try {
      const text = generateSummaryText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEmail = () => {
    // Placeholder for future email functionality
    const subject = encodeURIComponent('Valuation Summary');
    const body = encodeURIComponent(generateSummaryText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white rounded-xl p-8 border border-slate-200">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Valuation Summary
          </h2>
          <p className="text-sm text-slate-600">
            Your complete valuation overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
          >
            {copied ? (
              <>
                <CheckCircle2 size={16} className="text-green-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy Summary</span>
              </>
            )}
          </button>
          <button
            onClick={handleEmail}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
          >
            <Mail size={16} />
            <span>Email to myself</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Track Badge */}
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {track === 'operational' ? '🏢 Operational Business' : track === 'digital' ? '💻 Digital Business' : 'Business'}
          </span>
        </div>

        {/* Valuation Range */}
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border-2 border-blue-200">
          <p className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
            Indicative Valuation Range
          </p>
          <div className="flex items-baseline justify-center gap-3 mb-2">
            <span className="text-3xl font-bold text-slate-900">
              {valuationRange.min}
            </span>
            <span className="text-xl text-slate-500">—</span>
            <span className="text-3xl font-bold text-slate-900">
              {valuationRange.max}
            </span>
          </div>
          <p className="text-center text-sm text-slate-600">
            Midpoint: <span className="font-semibold text-slate-900">{valuationRange.midpoint}</span>
          </p>
        </div>

        {/* Readiness Score + Pillars */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Readiness Score: {readinessScore}%
          </h3>
          <div className="space-y-3">
            {/* Profile Pillar */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700">Profile Completeness</span>
                <span className="text-sm font-semibold text-slate-900">{pillars.profile}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pillars.profile}%` }}
                />
              </div>
            </div>

            {/* Financial Pillar */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700">Financial Clarity</span>
                <span className="text-sm font-semibold text-slate-900">{pillars.financial}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pillars.financial}%` }}
                />
              </div>
            </div>

            {/* Risk Pillar */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700">Risk Assessment</span>
                <span className="text-sm font-semibold text-slate-900">{pillars.risk}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pillars.risk}%` }}
                />
              </div>
            </div>

            {/* Intent Pillar */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700">Intent Clarity</span>
                <span className="text-sm font-semibold text-slate-900">{pillars.intent}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pillars.intent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Improvement Actions */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Top 3 Improvement Actions
          </h3>
          <ul className="space-y-3">
            {improvementActions.map((action, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex items-center justify-center mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm text-slate-700 leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            <strong>Disclaimer:</strong> Indicative only. Not an appraisal.
          </p>
        </div>
      </div>
    </div>
  );
}


