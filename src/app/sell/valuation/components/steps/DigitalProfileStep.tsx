'use client';

import { useState, useEffect } from 'react';

interface DigitalProfileStepProps {
  initialData?: {
    businessModel?: string;
    primaryMarket?: string;
    yearsLive?: string;
    ownerInvolvement?: string;
  };
  onDataChange: (data: Record<string, any>) => void;
}

export default function DigitalProfileStep({
  initialData,
  onDataChange,
}: DigitalProfileStepProps) {
  const [businessModel, setBusinessModel] = useState<string>(initialData?.businessModel || '');
  const [primaryMarket, setPrimaryMarket] = useState<string>(initialData?.primaryMarket || '');
  const [yearsLive, setYearsLive] = useState<string>(initialData?.yearsLive || '');
  const [ownerInvolvement, setOwnerInvolvement] = useState<string>(initialData?.ownerInvolvement || '');

  // Save immediately on change
  useEffect(() => {
    onDataChange({
      businessModel,
      primaryMarket,
      yearsLive,
      ownerInvolvement,
    });
  }, [businessModel, primaryMarket, yearsLive, ownerInvolvement, onDataChange]);

  const businessModelOptions = [
    { value: 'saas_subscription', label: 'SaaS (Subscription)' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'content_media', label: 'Content & Media' },
    { value: 'agency_services', label: 'Agency / Services' },
    { value: 'advertising', label: 'Advertising Revenue' },
    { value: 'affiliate', label: 'Affiliate Marketing' },
    { value: 'other', label: 'Other' },
  ];

  const marketOptions = [
    { value: 'b2b', label: 'B2B (Business to Business)' },
    { value: 'b2c', label: 'B2C (Business to Consumer)' },
    { value: 'b2b2c', label: 'B2B2C (Multi-sided)' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'smb', label: 'SMB (Small & Medium Business)' },
    { value: 'consumer', label: 'Consumer' },
  ];

  const involvementOptions = [
    { value: 'full_time', label: 'Full-time (40+ hours/week)' },
    { value: 'part_time', label: 'Part-time (10-40 hours/week)' },
    { value: 'minimal', label: 'Minimal (<10 hours/week)' },
    { value: 'passive', label: 'Passive (Minimal involvement)' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Business Profile
        </h2>
        <p className="text-slate-600 mb-6">
          Tell us about your digital business.
        </p>

        <div className="space-y-5">
          {/* Business Model */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Business Model <span className="text-red-500">*</span>
            </label>
            <select
              value={businessModel}
              onChange={(e) => setBusinessModel(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select model...</option>
              {businessModelOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Market */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Primary Market <span className="text-red-500">*</span>
            </label>
            <select
              value={primaryMarket}
              onChange={(e) => setPrimaryMarket(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select market...</option>
              {marketOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Years Live */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Years Live
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="20"
                value={yearsLive || '0'}
                onChange={(e) => setYearsLive(e.target.value)}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <span className="text-sm font-semibold text-slate-700 min-w-[60px] text-right">
                {yearsLive || '0'} years
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              How long has this digital business been live/operational?
            </p>
          </div>

          {/* Owner Involvement */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Owner Involvement
            </label>
            <select
              value={ownerInvolvement}
              onChange={(e) => setOwnerInvolvement(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select involvement level...</option>
              {involvementOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              How much time do you currently spend on this business?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


