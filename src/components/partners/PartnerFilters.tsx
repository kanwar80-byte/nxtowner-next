"use client";

import { useRouter, useSearchParams } from "next/navigation";

const PARTNER_TYPES = [
  { value: "broker", label: "M&A Brokers" },
  { value: "cpa", label: "CPAs & Accountants" },
  { value: "lawyer", label: "Lawyers" },
  { value: "lender", label: "Lenders" },
  { value: "consultant", label: "Consultants" },
];

const REGIONS = [
  "Ontario",
  "British Columbia",
  "Alberta",
  "Quebec",
  "Saskatchewan",
  "Manitoba",
  "Nova Scotia",
  "New Brunswick",
  "Nationwide",
];

const SPECIALTIES = [
  "Gas Stations",
  "QSR / Restaurants",
  "Retail",
  "C-Stores",
  "SaaS",
  "E-Commerce",
  "Content / Media",
  "Manufacturing",
  "Healthcare",
  "Real Estate",
];

interface PartnerFiltersProps {
  currentType?: string;
  currentRegion?: string;
  currentSpecialty?: string;
}

export function PartnerFilters({
  currentType,
  currentRegion,
  currentSpecialty,
}: PartnerFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/partners?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl border border-brand-border p-6 sticky top-4">
      <h3 className="text-sm font-semibold text-brand-text uppercase tracking-wide mb-4">
        Filter Partners
      </h3>

      {/* Partner Type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-brand-text mb-2">
          Partner Type
        </label>
        <select
          value={currentType || ""}
          onChange={(e) => updateFilter("type", e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm"
        >
          <option value="">All Types</option>
          {PARTNER_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Region */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-brand-text mb-2">
          Region
        </label>
        <select
          value={currentRegion || ""}
          onChange={(e) => updateFilter("region", e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm"
        >
          <option value="">All Regions</option>
          {REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Specialty */}
      <div>
        <label className="block text-sm font-semibold text-brand-text mb-2">
          Specialty
        </label>
        <select
          value={currentSpecialty || ""}
          onChange={(e) => updateFilter("specialty", e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm"
        >
          <option value="">All Specialties</option>
          {SPECIALTIES.map((specialty) => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
