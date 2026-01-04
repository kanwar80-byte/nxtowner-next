'use client';

import { useEffect } from 'react';
import { saveReadinessScore } from '../../actions';

interface ReadinessStepProps {
  stepData?: Record<string, any>;
  track?: 'operational' | 'digital' | null;
  onScoreCalculated?: (score: number) => void;
}

export default function ReadinessStep({ stepData, track, onScoreCalculated }: ReadinessStepProps) {
  // Calculate Readiness Score (v1 rules)
  const calculateReadinessScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    // Defensive: ensure stepData is an object
    const safeStepData = stepData && typeof stepData === 'object' ? stepData : {};

    // Pillar 1: Profile Completeness (25 points)
    const profile = (safeStepData?.profile && typeof safeStepData.profile === 'object')
      ? safeStepData.profile
      : {};
    let profileScore = 0;
    const profileMax = 25;

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
      // Extra point for any additional data
      if (Object.keys(profile).length >= 3) profileScore += 5;
    }

    // Pillar 2: Financial Clarity (30 points)
    const financials = (safeStepData?.financials && typeof safeStepData.financials === 'object')
      ? safeStepData.financials
      : {};
    let financialScore = 0;
    const financialMax = 30;

    if (financials.revenueRange) financialScore += 10;
    // Handle unknown flags gracefully - don't penalize if user marked as unknown
    if (track === 'operational' && financials.ebitdaRange && !financials.ebitda_unknown) {
      financialScore += 10;
    }
    if (track === 'digital' && financials.grossMarginRange && !financials.grossMargin_unknown) {
      financialScore += 10;
    }
    if (financials.revenueTrend || financials.revenueConsistency) financialScore += 5;
    if (track === 'operational' && financials.costDrivers?.length > 0) financialScore += 5;
    if (track === 'digital' && financials.growthRateRange) financialScore += 5;

    // Pillar 3: Risk Assessment (25 points)
    const risk = (safeStepData?.risk && typeof safeStepData.risk === 'object')
      ? safeStepData.risk
      : {};
    let riskScore = 0;
    const riskMax = 25;

    const riskFields = track === 'operational'
      ? ['propertyType', 'leaseStatus', 'customerConcentration', 'keyPersonDependency', 'regulatoryExposure']
      : ['platformDependency', 'trafficConcentration', 'churnAwareness', 'operationalMaturity'];

    riskFields.forEach((field) => {
      if (risk[field]) riskScore += 5;
    });

    // Pillar 4: Intent & Track Selection (20 points)
    let intentScore = 0;
    const intentMax = 20;

    if (safeStepData?.intent && typeof safeStepData.intent === 'string') {
      intentScore += 10;
    }
    if (track === 'operational' || track === 'digital') {
      intentScore += 10;
    }

    totalScore = profileScore + financialScore + riskScore + intentScore;
    maxScore = profileMax + financialMax + riskMax + intentMax;

    return {
      total: Math.round((totalScore / maxScore) * 100),
      pillars: {
        profile: Math.round((profileScore / profileMax) * 100),
        financial: Math.round((financialScore / financialMax) * 100),
        risk: Math.round((riskScore / riskMax) * 100),
        intent: Math.round((intentScore / intentMax) * 100),
      },
    };
  };

  const readiness = calculateReadinessScore();

  // Save readiness score to database and notify parent
  useEffect(() => {
    if (readiness.total >= 0) {
      // Notify parent component of calculated score
      if (onScoreCalculated) {
        onScoreCalculated(readiness.total);
      }
      // Save to database
      saveReadinessScore(readiness.total).catch(() => {
        // Silent fail - score will be recalculated on load
      });
    }
  }, [readiness.total, onScoreCalculated]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-slate-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  const getReadinessMessage = (score: number) => {
    if (score >= 80) {
      return 'Excellent! Your business profile is well-prepared for listing.';
    }
    if (score >= 60) {
      return 'Good progress! A few more details will strengthen your listing.';
    }
    if (score >= 40) {
      return 'You\'re on the right track. Consider adding more information to improve visibility.';
    }
    return 'Getting started! Complete more sections to build a stronger listing profile.';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Readiness Assessment
        </h2>
        <p className="text-slate-600 mb-6">
          {getReadinessMessage(readiness.total)}
        </p>

        {/* Overall Score */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border-2 border-slate-200 mb-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Overall Readiness Score
            </p>
            <div className="relative inline-block mb-4">
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className={getScoreColor(readiness.total)}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${readiness.total}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(readiness.total)}`}>
                    {readiness.total}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Based on profile completeness and data quality
            </p>
          </div>
        </div>

        {/* Four Pillars */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Readiness Pillars
          </h3>

          {/* Profile Completeness */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700">Profile Completeness</span>
              <span className={`text-sm font-bold ${getScoreColor(readiness.pillars.profile)}`}>
                {readiness.pillars.profile}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full ${getScoreBgColor(readiness.pillars.profile)} transition-all duration-500`}
                style={{ width: `${readiness.pillars.profile}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Business profile and basic information
            </p>
          </div>

          {/* Financial Clarity */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700">Financial Clarity</span>
              <span className={`text-sm font-bold ${getScoreColor(readiness.pillars.financial)}`}>
                {readiness.pillars.financial}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full ${getScoreBgColor(readiness.pillars.financial)} transition-all duration-500`}
                style={{ width: `${readiness.pillars.financial}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Financial metrics and revenue information
            </p>
          </div>

          {/* Risk Assessment */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700">Risk Assessment</span>
              <span className={`text-sm font-bold ${getScoreColor(readiness.pillars.risk)}`}>
                {readiness.pillars.risk}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full ${getScoreBgColor(readiness.pillars.risk)} transition-all duration-500`}
                style={{ width: `${readiness.pillars.risk}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Risk factors and quality signals
            </p>
          </div>

          {/* Intent & Track */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700">Intent & Selection</span>
              <span className={`text-sm font-bold ${getScoreColor(readiness.pillars.intent)}`}>
                {readiness.pillars.intent}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full ${getScoreBgColor(readiness.pillars.intent)} transition-all duration-500`}
                style={{ width: `${readiness.pillars.intent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Selling intent and asset type selection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
