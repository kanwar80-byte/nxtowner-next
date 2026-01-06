'use client';

import { useState, useEffect } from 'react';

interface OperationalRiskStepProps {
  initialData?: {
    propertyType?: string;
    leaseStatus?: string;
    customerConcentration?: string;
    keyPersonDependency?: string;
    regulatoryExposure?: string;
  };
  onDataChange: (data: Record<string, any>) => void;
}

export default function OperationalRiskStep({
  initialData,
  onDataChange,
}: OperationalRiskStepProps) {
  const [propertyType, setPropertyType] = useState<string>(initialData?.propertyType || '');
  const [leaseStatus, setLeaseStatus] = useState<string>(initialData?.leaseStatus || '');
  const [customerConcentration, setCustomerConcentration] = useState<string>(initialData?.customerConcentration || '');
  const [keyPersonDependency, setKeyPersonDependency] = useState<string>(initialData?.keyPersonDependency || '');
  const [regulatoryExposure, setRegulatoryExposure] = useState<string>(initialData?.regulatoryExposure || '');

  // Save immediately on change
  useEffect(() => {
    onDataChange({
      propertyType,
      leaseStatus,
      customerConcentration,
      keyPersonDependency,
      regulatoryExposure,
    });
  }, [propertyType, leaseStatus, customerConcentration, keyPersonDependency, regulatoryExposure, onDataChange]);

  const propertyTypeOptions = [
    { value: 'owned', label: 'Owned' },
    { value: 'leased', label: 'Leased' },
    { value: 'mixed', label: 'Mixed (Owned + Leased)' },
    { value: 'not_applicable', label: 'Not Applicable' },
  ];

  const leaseStatusOptions = [
    { value: 'long_term', label: 'Long-term Lease (5+ years)' },
    { value: 'medium_term', label: 'Medium-term Lease (2-5 years)' },
    { value: 'short_term', label: 'Short-term Lease (<2 years)' },
    { value: 'month_to_month', label: 'Month-to-Month' },
    { value: 'lease_expiring', label: 'Lease Expiring Soon' },
    { value: 'not_applicable', label: 'Not Applicable' },
  ];

  const concentrationOptions = [
    { value: 'highly_concentrated', label: 'Highly Concentrated (<5 major customers)' },
    { value: 'moderately_concentrated', label: 'Moderately Concentrated (5-20 customers)' },
    { value: 'diversified', label: 'Well Diversified (20+ customers)' },
    { value: 'unknown', label: 'Unknown / Not Tracked' },
  ];

  const dependencyOptions = [
    { value: 'high', label: 'High Dependency' },
    { value: 'moderate', label: 'Moderate Dependency' },
    { value: 'low', label: 'Low Dependency' },
    { value: 'none', label: 'No Key Person Dependency' },
  ];

  const regulatoryOptions = [
    { value: 'high', label: 'High Regulatory Exposure' },
    { value: 'moderate', label: 'Moderate Regulatory Exposure' },
    { value: 'low', label: 'Low Regulatory Exposure' },
    { value: 'none', label: 'Minimal Regulatory Exposure' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Risk & Quality Assessment
        </h2>
        <p className="text-slate-600 mb-6">
          Help us understand potential risks and quality factors for your operational business.
        </p>

        <div className="space-y-5">
          {/* Property Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select property type...</option>
              {propertyTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Lease Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Lease Status
            </label>
            <select
              value={leaseStatus}
              onChange={(e) => setLeaseStatus(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select lease status...</option>
              {leaseStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              If applicable, what is the current lease situation?
            </p>
          </div>

          {/* Customer Concentration */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Customer Concentration
            </label>
            <select
              value={customerConcentration}
              onChange={(e) => setCustomerConcentration(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select concentration level...</option>
              {concentrationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              How concentrated is your customer base?
            </p>
          </div>

          {/* Key Person Dependency */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Key Person Dependency
            </label>
            <select
              value={keyPersonDependency}
              onChange={(e) => setKeyPersonDependency(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select dependency level...</option>
              {dependencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              How dependent is the business on key individuals?
            </p>
          </div>

          {/* Regulatory Exposure */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Regulatory Exposure
            </label>
            <select
              value={regulatoryExposure}
              onChange={(e) => setRegulatoryExposure(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select exposure level...</option>
              {regulatoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              How much regulatory oversight does your business face?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




