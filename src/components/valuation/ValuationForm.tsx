"use client";

import { useState } from "react";
import type { ValuationRequest, ValuationResponse } from "@/app/api/valuation/route";

const ASSET_TYPES = [
  { value: "physical-gas-station", label: "Physical – Gas Station" },
  { value: "physical-qsr", label: "Physical – QSR / Restaurant" },
  { value: "physical-retail", label: "Physical – Retail / C-Store" },
  { value: "physical-other", label: "Physical – Other" },
  { value: "digital-saas", label: "Digital – SaaS" },
  { value: "digital-ecommerce", label: "Digital – E-Commerce" },
  { value: "digital-content", label: "Digital – Content / Media" },
  { value: "digital-other", label: "Digital – Other" },
];

export function ValuationForm() {
  const [formData, setFormData] = useState<ValuationRequest>({
    asset_type: "",
    location: "",
    annual_revenue: 0,
    annual_profit: 0,
    years_in_operation: 1,
    key_highlights: "",
  });

  const [result, setResult] = useState<ValuationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "annual_revenue" || name === "annual_profit" || name === "asking_price" || name === "years_in_operation") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    // Validate required fields
    if (
      !formData.asset_type ||
      !formData.location ||
      formData.annual_revenue <= 0 ||
      formData.annual_profit < 0 ||
      formData.years_in_operation <= 0 ||
      !formData.key_highlights.trim()
    ) {
      setError(
        "Please fill in all required fields with valid values."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: ValuationResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate valuation");
      }

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Failed to generate valuation");
      }
    } catch (err) {
      console.error("Valuation error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-white rounded-xl border border-brand-border p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Asset Type & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-brand-text mb-2">
                Business Type *
              </label>
              <select
                name="asset_type"
                value={formData.asset_type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange"
              >
                <option value="">Select a business type...</option>
                {ASSET_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text mb-2">
                Location (City, Province/State) *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Toronto, Ontario"
                required
                className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
          </div>

          {/* Row 2: Revenue & Profit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-brand-text mb-2">
                Annual Revenue (CAD) *
              </label>
              <input
                type="number"
                name="annual_revenue"
                value={formData.annual_revenue || ""}
                onChange={handleInputChange}
                placeholder="100000"
                required
                min="0"
                step="10000"
                className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <p className="text-xs text-brand-muted mt-1">
                Gross annual revenue (sales)
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text mb-2">
                Annual Profit (CAD) *
              </label>
              <input
                type="number"
                name="annual_profit"
                value={formData.annual_profit || ""}
                onChange={handleInputChange}
                placeholder="25000"
                required
                min="0"
                step="10000"
                className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <p className="text-xs text-brand-muted mt-1">
                Net annual profit (EBITDA or similar)
              </p>
            </div>
          </div>

          {/* Row 3: Years in Operation & Asking Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-brand-text mb-2">
                Years in Operation *
              </label>
              <input
                type="number"
                name="years_in_operation"
                value={formData.years_in_operation || ""}
                onChange={handleInputChange}
                placeholder="5"
                required
                min="0"
                step="1"
                className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <p className="text-xs text-brand-muted mt-1">
                How long has this business been operating?
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text mb-2">
                Current Asking Price (CAD)
              </label>
              <input
                type="number"
                name="asking_price"
                value={formData.asking_price || ""}
                onChange={handleInputChange}
                placeholder="350000"
                min="0"
                step="10000"
                className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <p className="text-xs text-brand-muted mt-1">
                Optional – for pricing feedback
              </p>
            </div>
          </div>

          {/* Row 4: Key Highlights */}
          <div>
            <label className="block text-sm font-semibold text-brand-text mb-2">
              Key Highlights *
            </label>
            <textarea
              name="key_highlights"
              value={formData.key_highlights}
              onChange={handleInputChange}
              placeholder="e.g., Strong customer base, recurring revenue, experienced team, expansion into new markets..."
              required
              rows={3}
              className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <p className="text-xs text-brand-muted mt-1">
              Growth trends, brand strength, competitive advantages, etc.
            </p>
          </div>

          {/* Row 5: Risk Flags */}
          <div>
            <label className="block text-sm font-semibold text-brand-text mb-2">
              Risk Flags (Optional)
            </label>
            <textarea
              name="risk_flags"
              value={formData.risk_flags || ""}
              onChange={handleInputChange}
              placeholder="e.g., Key customer concentration, seasonal revenue, pending legislation, key person dependency..."
              rows={3}
              className="w-full px-4 py-3 rounded-md border border-brand-border bg-white text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <p className="text-xs text-brand-muted mt-1">
              Known risks, challenges, or dependencies
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Calculating Valuation..." : "Get AI Valuation"}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-semibold mb-1">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Results Panel */}
      {result && result.success && (
        <div className="space-y-4">
          {/* Valuation Range Card */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-brand-orange rounded-xl p-8 shadow-sm">
            <p className="text-sm font-semibold text-brand-orange uppercase tracking-wide mb-2">
              AI Valuation Range (NexusAI)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-brand-muted uppercase tracking-wide mb-1">
                  Minimum
                </p>
                <p className="text-3xl font-bold text-brand-text">
                  {result.valuation_min ? formatCurrency(result.valuation_min) : "—"}
                </p>
              </div>

              <div className="border-l-2 border-r-2 border-brand-orange border-opacity-30 pl-6 pr-6">
                <p className="text-xs text-brand-muted uppercase tracking-wide mb-1">
                  Estimated Range
                </p>
                <p className="text-sm font-semibold text-brand-text">
                  {result.valuation_min && result.valuation_max
                    ? `$${((result.valuation_max - result.valuation_min) / 1000).toFixed(0)}k`
                    : "—"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-brand-muted uppercase tracking-wide mb-1">
                  Maximum
                </p>
                <p className="text-3xl font-bold text-brand-text">
                  {result.valuation_max ? formatCurrency(result.valuation_max) : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white border border-brand-border rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-brand-text uppercase tracking-wide mb-3">
              Valuation Summary
            </h3>
            <p className="text-brand-text leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Pricing Comment */}
          {result.pricing_comment && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-2">
                Asking Price Feedback
              </h3>
              <p className="text-blue-900 text-sm leading-relaxed">
                {result.pricing_comment}
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-600">
              <strong>Disclaimer:</strong> This valuation is an AI-generated estimate for informational purposes only. 
              It should not be considered professional financial or legal advice. For accurate valuations, 
              consult with a qualified business valuator, accountant, or M&A advisor. Actual value depends on 
              detailed financial due diligence, market conditions, and buyer-specific factors.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
