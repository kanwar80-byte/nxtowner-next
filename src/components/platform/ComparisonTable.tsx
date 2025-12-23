"use client";

import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

interface Listing {
  id: string;
  title: string;
  category?: string;
  asking_price: number;
  gross_revenue: number;
  ebitda: number;
  ai_analysis?: {
    growth_score?: number;
    risk_score?: number;
  };
}

function getEarningsYield(listing: Listing) {
  return listing.asking_price > 0 && listing.ebitda > 0
    ? listing.ebitda / listing.asking_price
    : 0;
}

export default function ComparisonTable({ listings }: { listings: Listing[] }) {
  const earningsYields = useMemo(
    () => listings.map(getEarningsYield),
    [listings]
  );
  const maxYield = Math.max(...earningsYields);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse bg-white text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50">
          <tr>
            <th className="p-4 text-left font-semibold min-w-[180px]">Business</th>
            {listings.map((l, idx) => (
              <th
                key={l.id}
                className={`p-4 text-center font-semibold ${
                  earningsYields[idx] === maxYield && maxYield > 0
                    ? "bg-green-50 border-green-300"
                    : ""
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="font-bold text-base">{l.title}</span>
                  {l.category && (
                    <span className="text-xs text-slate-500">{l.category}</span>
                  )}
                  {earningsYields[idx] === maxYield && maxYield > 0 && (
                    <Badge className="bg-green-600 text-white mt-1">Best ROI</Badge>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Financials */}
          <tr>
            <td className="p-4 font-medium">Asking Price</td>
            {listings.map((l, idx) => (
              <td
                key={l.id}
                className={`p-4 text-center ${
                  earningsYields[idx] === maxYield && maxYield > 0
                    ? "bg-green-50 border-green-300"
                    : ""
                }`}
              >
                ${l.asking_price?.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium">Gross Revenue</td>
            {listings.map((l, idx) => (
              <td
                key={l.id}
                className={`p-4 text-center ${
                  earningsYields[idx] === maxYield && maxYield > 0
                    ? "bg-green-50 border-green-300"
                    : ""
                }`}
              >
                ${l.gross_revenue?.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium">EBITDA</td>
            {listings.map((l, idx) => (
              <td
                key={l.id}
                className={`p-4 text-center ${
                  earningsYields[idx] === maxYield && maxYield > 0
                    ? "bg-green-50 border-green-300"
                    : ""
                }`}
              >
                ${l.ebitda?.toLocaleString()}
              </td>
            ))}
          </tr>
          {/* Multiples */}
          <tr>
            <td className="p-4 font-medium">Revenue Multiple</td>
            {listings.map((l, idx) => (
              <td
                key={l.id}
                className={`p-4 text-center ${
                  earningsYields[idx] === maxYield && maxYield > 0
                    ? "bg-green-50 border-green-300"
                    : ""
                }`}
              >
                {l.gross_revenue > 0 && l.asking_price > 0
                  ? (l.asking_price / l.gross_revenue).toFixed(2) + "x"
                  : "-"}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium">EBITDA Multiple</td>
            {listings.map((l, idx) => (
              <td
                key={l.id}
                className={`p-4 text-center ${
                  earningsYields[idx] === maxYield && maxYield > 0
                    ? "bg-green-50 border-green-300"
                    : ""
                }`}
              >
                {l.ebitda > 0 && l.asking_price > 0
                  ? (l.asking_price / l.ebitda).toFixed(2) + "x"
                  : "-"}
              </td>
            ))}
          </tr>
          {/* AI Scores */}
          <tr>
            <td className="p-4 font-medium">Growth Score</td>
            {listings.map((l, idx) => (
              <td
                key={l.id}
                className={`p-4 text-center ${
                  earningsYields[idx] === maxYield && maxYield > 0
                    ? "bg-green-50 border-green-300"
                    : ""
                }`}
              >
                {l.ai_analysis?.growth_score ?? "-"}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium">Risk Score</td>
            {listings.map((l, idx) => (
              <td
                key={l.id}
                className={`p-4 text-center ${
                  earningsYields[idx] === maxYield && maxYield > 0
                    ? "bg-green-50 border-green-300"
                    : ""
                }`}
              >
                {l.ai_analysis?.risk_score ?? "-"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
