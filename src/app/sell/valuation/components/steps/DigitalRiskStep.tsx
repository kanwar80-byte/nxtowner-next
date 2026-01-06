'use client';

import { useState, useEffect } from 'react';

interface DigitalRiskStepProps {
  initialData?: {
    platformDependency?: string;
    trafficConcentration?: string;
    churnAwareness?: string;
    operationalMaturity?: string;
  };
  onDataChange: (data: Record<string, any>) => void;
}

export default function DigitalRiskStep({
  initialData,
  onDataChange,
}: DigitalRiskStepProps) {
  const [platformDependency, setPlatformDependency] = useState<string>(initialData?.platformDependency || '');
  const [trafficConcentration, setTrafficConcentration] = useState<string>(initialData?.trafficConcentration || '');
  const [churnAwareness, setChurnAwareness] = useState<string>(initialData?.churnAwareness || '');
  const [operationalMaturity, setOperationalMaturity] = useState<string>(initialData?.operationalMaturity || '');

  // Save immediately on change
  useEffect(() => {
    onDataChange({
      platformDependency,
      trafficConcentration,
      churnAwareness,
      operationalMaturity,
    });
  }, [platformDependency, trafficConcentration, churnAwareness, operationalMaturity, onDataChange]);

  const platformDependencyOptions = [
    { value: 'single_platform', label: 'Single Platform Dependency' },
    { value: 'multi_platform', label: 'Multi-Platform (Diversified)' },
    { value: 'owned_infrastructure', label: 'Owned Infrastructure' },
    { value: 'hybrid', label: 'Hybrid (Owned + Third-party)' },
  ];

  const trafficConcentrationOptions = [
    { value: 'highly_concentrated', label: 'Highly Concentrated (Single Source)' },
    { value: 'moderately_concentrated', label: 'Moderately Concentrated (2-3 Sources)' },
    { value: 'diversified', label: 'Well Diversified (Multiple Sources)' },
    { value: 'organic', label: 'Primarily Organic/Search' },
  ];

  const churnAwarenessOptions = [
    { value: 'tracked_closely', label: 'Tracked Closely (Monthly Churn Known)' },
    { value: 'tracked_occasionally', label: 'Tracked Occasionally' },
    { value: 'not_tracked', label: 'Not Currently Tracked' },
    { value: 'low_churn', label: 'Low Churn (Stable Customer Base)' },
  ];

  const maturityOptions = [
    { value: 'early_stage', label: 'Early Stage (0-2 years)' },
    { value: 'growth_stage', label: 'Growth Stage (2-5 years)' },
    { value: 'mature', label: 'Mature (5+ years)' },
    { value: 'established', label: 'Well Established' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Risk & Quality Assessment
        </h2>
        <p className="text-slate-600 mb-6">
          Help us understand potential risks and quality factors for your digital business.
        </p>

        <div className="space-y-5">
          {/* Platform Dependency */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Platform Dependency
            </label>
            <select
              value={platformDependency}
              onChange={(e) => setPlatformDependency(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select dependency level...</option>
              {platformDependencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              How dependent is your business on third-party platforms?
            </p>
          </div>

          {/* Traffic Concentration */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Traffic Concentration
            </label>
            <select
              value={trafficConcentration}
              onChange={(e) => setTrafficConcentration(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select concentration level...</option>
              {trafficConcentrationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              How concentrated is your traffic source?
            </p>
          </div>

          {/* Churn Awareness */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Churn Awareness
            </label>
            <select
              value={churnAwareness}
              onChange={(e) => setChurnAwareness(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select awareness level...</option>
              {churnAwarenessOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              How well do you track customer/subscriber churn?
            </p>
          </div>

          {/* Operational Maturity */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Operational Maturity
            </label>
            <select
              value={operationalMaturity}
              onChange={(e) => setOperationalMaturity(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select maturity level...</option>
              {maturityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              What stage is your business at operationally?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




