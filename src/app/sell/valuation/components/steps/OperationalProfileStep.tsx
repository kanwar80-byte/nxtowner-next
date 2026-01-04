'use client';

import { useState, useEffect } from 'react';
import { TAXONOMY } from '@/lib/taxonomy';

interface OperationalProfileStepProps {
  initialData?: {
    category?: string;
    city?: string;
    country?: string;
    yearsInOperation?: string;
    ownershipStructure?: string;
  };
  onDataChange: (data: Record<string, any>) => void;
}

export default function OperationalProfileStep({
  initialData,
  onDataChange,
}: OperationalProfileStepProps) {
  // Defensive: ensure initialData is an object
  const safeInitialData = initialData && typeof initialData === 'object' ? initialData : {};

  const [category, setCategory] = useState<string>(
    (safeInitialData?.category && typeof safeInitialData.category === 'string') ? safeInitialData.category : ''
  );
  const [city, setCity] = useState<string>(
    (safeInitialData?.city && typeof safeInitialData.city === 'string') ? safeInitialData.city : ''
  );
  const [country, setCountry] = useState<string>(
    (safeInitialData?.country && typeof safeInitialData.country === 'string') ? safeInitialData.country : 'CA'
  );
  const [yearsInOperation, setYearsInOperation] = useState<string>(
    (safeInitialData?.yearsInOperation && typeof safeInitialData.yearsInOperation === 'string') ? safeInitialData.yearsInOperation : ''
  );
  const [ownershipStructure, setOwnershipStructure] = useState<string>(
    (safeInitialData?.ownershipStructure && typeof safeInitialData.ownershipStructure === 'string') ? safeInitialData.ownershipStructure : ''
  );

  // Save immediately on change
  useEffect(() => {
    onDataChange({
      category,
      city,
      country,
      yearsInOperation,
      ownershipStructure,
    });
  }, [category, city, country, yearsInOperation, ownershipStructure, onDataChange]);

  const categories = Object.values(TAXONOMY.Operational);
  const ownershipOptions = [
    { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'corporation', label: 'Corporation' },
    { value: 'llc', label: 'LLC / Limited Liability Company' },
    { value: 'franchise', label: 'Franchise' },
    { value: 'other', label: 'Other' },
  ];

  const countryOptions = [
    { value: 'CA', label: 'Canada' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Business Profile
        </h2>
        <p className="text-slate-600 mb-6">
          Tell us about your operational business.
        </p>

        <div className="space-y-5">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat.code} value={cat.code}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Toronto"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {countryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Years in Operation */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Years in Operation
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="50"
                value={yearsInOperation || '0'}
                onChange={(e) => setYearsInOperation(e.target.value)}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-sm font-semibold text-slate-700 min-w-[60px] text-right">
                {yearsInOperation || '0'} years
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              How long has this business been operating?
            </p>
          </div>

          {/* Ownership Structure */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Ownership Structure
            </label>
            <select
              value={ownershipStructure}
              onChange={(e) => setOwnershipStructure(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select structure...</option>
              {ownershipOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

