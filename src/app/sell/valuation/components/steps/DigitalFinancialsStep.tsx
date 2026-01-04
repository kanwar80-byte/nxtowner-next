'use client';

import { useState, useEffect } from 'react';

interface DigitalFinancialsStepProps {
  initialData?: {
    revenueRange?: string;
    grossMarginRange?: string;
    growthRateRange?: string;
    revenueConsistency?: string;
    grossMargin_unknown?: boolean;
  };
  onDataChange: (data: Record<string, any>) => void;
}

export default function DigitalFinancialsStep({
  initialData,
  onDataChange,
}: DigitalFinancialsStepProps) {
  const [revenueRange, setRevenueRange] = useState<string>(initialData?.revenueRange || '');
  const [grossMarginRange, setGrossMarginRange] = useState<string>(initialData?.grossMarginRange || '');
  const [growthRateRange, setGrowthRateRange] = useState<string>(initialData?.growthRateRange || '');
  const [revenueConsistency, setRevenueConsistency] = useState<string>(initialData?.revenueConsistency || '');
  const [grossMarginUnknown, setGrossMarginUnknown] = useState<boolean>(initialData?.grossMargin_unknown || false);

  // Save immediately on change
  useEffect(() => {
    onDataChange({
      revenueRange,
      grossMarginRange: grossMarginUnknown ? undefined : grossMarginRange,
      growthRateRange,
      revenueConsistency,
      grossMargin_unknown: grossMarginUnknown,
    });
  }, [revenueRange, grossMarginRange, growthRateRange, revenueConsistency, grossMarginUnknown, onDataChange]);

  const revenueRanges = [
    { value: 'under_10k', label: 'Under $10K' },
    { value: '10k_25k', label: '$10K - $25K' },
    { value: '25k_50k', label: '$25K - $50K' },
    { value: '50k_100k', label: '$50K - $100K' },
    { value: '100k_250k', label: '$100K - $250K' },
    { value: '250k_500k', label: '$250K - $500K' },
    { value: '500k_1m', label: '$500K - $1M' },
    { value: '1m_2.5m', label: '$1M - $2.5M' },
    { value: '2.5m_5m', label: '$2.5M - $5M' },
    { value: '5m_plus', label: '$5M+' },
  ];

  const grossMarginRanges = [
    { value: 'under_20', label: 'Under 20%' },
    { value: '20_40', label: '20% - 40%' },
    { value: '40_60', label: '40% - 60%' },
    { value: '60_80', label: '60% - 80%' },
    { value: '80_plus', label: '80%+' },
  ];

  const growthRateRanges = [
    { value: 'negative', label: 'Negative / Declining' },
    { value: '0_10', label: '0% - 10%' },
    { value: '10_25', label: '10% - 25%' },
    { value: '25_50', label: '25% - 50%' },
    { value: '50_100', label: '50% - 100%' },
    { value: '100_plus', label: '100%+' },
  ];

  const consistencyOptions = [
    { value: 'very_consistent', label: 'Very Consistent' },
    { value: 'mostly_consistent', label: 'Mostly Consistent' },
    { value: 'somewhat_variable', label: 'Somewhat Variable' },
    { value: 'highly_variable', label: 'Highly Variable' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Financial Snapshot
        </h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 font-medium mb-1">
            Estimates are fine. Exact figures are not required.
          </p>
          <p className="text-xs text-blue-700">
            This helps us provide a more accurate valuation estimate.
          </p>
        </div>

        <div className="space-y-5">
          {/* Revenue Range */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Annual Revenue Range
            </label>
            <select
              value={revenueRange}
              onChange={(e) => setRevenueRange(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select range...</option>
              {revenueRanges.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Gross Margin Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700">
                Gross Margin Range
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={grossMarginUnknown}
                  onChange={(e) => {
                    setGrossMarginUnknown(e.target.checked);
                    if (e.target.checked) {
                      setGrossMarginRange('');
                    }
                  }}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded border-slate-300"
                />
                <span className="text-xs text-slate-600">I'm not sure about gross margin</span>
              </label>
            </div>
            {!grossMarginUnknown && (
              <>
                <select
                  value={grossMarginRange}
                  onChange={(e) => setGrossMarginRange(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select range...</option>
                  {grossMarginRanges.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Revenue minus cost of goods sold (COGS)
                </p>
                <p className="text-xs text-slate-500 mt-1 italic">
                  If you're not sure, choose a range that feels closest.
                </p>
              </>
            )}
            {grossMarginUnknown && (
              <p className="text-sm text-slate-500 italic py-2">
                No problem. We'll proceed without gross margin data.
              </p>
            )}
          </div>

          {/* Growth Rate Range */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Annual Growth Rate Range
            </label>
            <select
              value={growthRateRange}
              onChange={(e) => setGrowthRateRange(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select range...</option>
              {growthRateRanges.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Year-over-year revenue growth
            </p>
          </div>

          {/* Revenue Consistency */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Revenue Consistency
            </label>
            <select
              value={revenueConsistency}
              onChange={(e) => setRevenueConsistency(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select consistency level...</option>
              {consistencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              How consistent is your monthly/quarterly revenue?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

