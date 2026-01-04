'use client';

import { useState, useEffect } from 'react';

interface OperationalFinancialsStepProps {
  initialData?: {
    revenueRange?: string;
    ebitdaRange?: string;
    revenueTrend?: string;
    costDrivers?: string[];
    ebitda_unknown?: boolean;
  };
  onDataChange: (data: Record<string, any>) => void;
}

export default function OperationalFinancialsStep({
  initialData,
  onDataChange,
}: OperationalFinancialsStepProps) {
  const [revenueRange, setRevenueRange] = useState<string>(initialData?.revenueRange || '');
  const [ebitdaRange, setEbitdaRange] = useState<string>(initialData?.ebitdaRange || '');
  const [revenueTrend, setRevenueTrend] = useState<string>(initialData?.revenueTrend || '');
  const [costDrivers, setCostDrivers] = useState<string[]>(initialData?.costDrivers || []);
  const [ebitdaUnknown, setEbitdaUnknown] = useState<boolean>(initialData?.ebitda_unknown || false);

  // Save immediately on change
  useEffect(() => {
    onDataChange({
      revenueRange,
      ebitdaRange: ebitdaUnknown ? undefined : ebitdaRange,
      revenueTrend,
      costDrivers,
      ebitda_unknown: ebitdaUnknown,
    });
  }, [revenueRange, ebitdaRange, revenueTrend, costDrivers, ebitdaUnknown, onDataChange]);

  const revenueRanges = [
    { value: 'under_100k', label: 'Under $100K' },
    { value: '100k_250k', label: '$100K - $250K' },
    { value: '250k_500k', label: '$250K - $500K' },
    { value: '500k_1m', label: '$500K - $1M' },
    { value: '1m_2.5m', label: '$1M - $2.5M' },
    { value: '2.5m_5m', label: '$2.5M - $5M' },
    { value: '5m_10m', label: '$5M - $10M' },
    { value: '10m_plus', label: '$10M+' },
  ];

  const ebitdaRanges = [
    { value: 'under_50k', label: 'Under $50K' },
    { value: '50k_100k', label: '$50K - $100K' },
    { value: '100k_250k', label: '$100K - $250K' },
    { value: '250k_500k', label: '$250K - $500K' },
    { value: '500k_1m', label: '$500K - $1M' },
    { value: '1m_2.5m', label: '$1M - $2.5M' },
    { value: '2.5m_5m', label: '$2.5M - $5M' },
    { value: '5m_plus', label: '$5M+' },
  ];

  const revenueTrendOptions = [
    { value: 'growing', label: 'Growing' },
    { value: 'stable', label: 'Stable' },
    { value: 'declining', label: 'Declining' },
    { value: 'volatile', label: 'Volatile' },
  ];

  const costDriverOptions = [
    { value: 'labor', label: 'Labor / Staffing' },
    { value: 'rent', label: 'Rent / Lease' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'equipment', label: 'Equipment / Maintenance' },
    { value: 'marketing', label: 'Marketing / Advertising' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'supplies', label: 'Supplies / Materials' },
    { value: 'other', label: 'Other' },
  ];

  const handleCostDriverToggle = (value: string) => {
    setCostDrivers((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

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
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select range...</option>
              {revenueRanges.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* EBITDA Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700">
                Annual EBITDA Range
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ebitdaUnknown}
                  onChange={(e) => {
                    setEbitdaUnknown(e.target.checked);
                    if (e.target.checked) {
                      setEbitdaRange('');
                    }
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-slate-300"
                />
                <span className="text-xs text-slate-600">I'm not sure about EBITDA</span>
              </label>
            </div>
            {!ebitdaUnknown && (
              <>
                <select
                  value={ebitdaRange}
                  onChange={(e) => setEbitdaRange(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select range...</option>
                  {ebitdaRanges.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Earnings Before Interest, Taxes, Depreciation, and Amortization
                </p>
                <p className="text-xs text-slate-500 mt-1 italic">
                  If you're not sure, choose a range that feels closest.
                </p>
              </>
            )}
            {ebitdaUnknown && (
              <p className="text-sm text-slate-500 italic py-2">
                No problem. We'll proceed without EBITDA data.
              </p>
            )}
          </div>

          {/* Revenue Trend */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Revenue Trend
            </label>
            <select
              value={revenueTrend}
              onChange={(e) => setRevenueTrend(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select trend...</option>
              {revenueTrendOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              How has revenue changed over the past 2-3 years?
            </p>
          </div>

          {/* Cost Drivers */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Primary Cost Drivers
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Select all that apply (multi-select)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {costDriverOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    costDrivers.includes(opt.value)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={costDrivers.includes(opt.value)}
                    onChange={() => handleCostDriverToggle(opt.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

