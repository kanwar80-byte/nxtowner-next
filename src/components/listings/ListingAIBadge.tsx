import React from "react";

export function ListingAIBadge({ valuationMin, valuationMax, currency, narrative }: {
  valuationMin: number;
  valuationMax: number;
  currency: string;
  narrative?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gradient-to-r from-orange-400 to-orange-600 text-xs font-semibold text-white cursor-help"
      title={narrative || `AI Valuation: ${valuationMin} - ${valuationMax} ${currency}`}
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="mr-1">
        <circle cx="10" cy="10" r="10" fill="#fff" fillOpacity="0.2" />
        <path d="M6 10a4 4 0 118 0 4 4 0 01-8 0zm4-2a2 2 0 100 4 2 2 0 000-4z" fill="#fff" />
      </svg>
      AI Valuation
      <span className="ml-1">({valuationMin.toLocaleString()}–{valuationMax.toLocaleString()} {currency})</span>
    </span>
  );
}
