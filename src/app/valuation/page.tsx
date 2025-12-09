"use client";
import { useState } from "react";
import { ValuationAIResult } from "../../types/valuation";

const initialForm = {
  asset_type: "physical",
  business_type: "",
  title: "",
  country: "",
  region: "",
  annual_revenue: "",
  annual_profit: "",
  asking_price: "",
  key_metrics: "",
  notes: "",
};


function ValuationWizard() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValuationAIResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    {
      label: "Asset Type",
      content: (
        <select
          value={form.asset_type}
          onChange={e => setForm(f => ({ ...f, asset_type: e.target.value }))}
          className="w-full p-2 border rounded"
        >
          <option value="physical">Physical Business</option>
          <option value="digital">Digital Business</option>
        </select>
      ),
    },
    {
      label: "Business Type",
      content: (
        <input
          type="text"
          value={form.business_type}
          onChange={e => setForm(f => ({ ...f, business_type: e.target.value }))}
          placeholder="e.g. gas_station, saas, ecommerce"
          className="w-full p-2 border rounded"
        />
      ),
    },
    {
      label: "Title",
      content: (
        <input
          type="text"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Business name or listing title"
          className="w-full p-2 border rounded"
        />
      ),
    },
    {
      label: "Country & Region",
      content: (
        <div className="flex gap-2">
          <input
            type="text"
            value={form.country}
            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
            placeholder="Country"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={form.region}
            onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
            placeholder="Region"
            className="w-full p-2 border rounded"
          />
        </div>
      ),
    },
    {
      label: "Financials",
      content: (
        <div className="flex gap-2">
          <input
            type="number"
            value={form.annual_revenue}
            onChange={e => setForm(f => ({ ...f, annual_revenue: e.target.value }))}
            placeholder="Annual Revenue"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            value={form.annual_profit}
            onChange={e => setForm(f => ({ ...f, annual_profit: e.target.value }))}
            placeholder="Annual Profit"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            value={form.asking_price}
            onChange={e => setForm(f => ({ ...f, asking_price: e.target.value }))}
            placeholder="Asking Price"
            className="w-full p-2 border rounded"
          />
        </div>
      ),
    },
    {
      label: "Key Metrics",
      content: (
        <input
          type="text"
          value={form.key_metrics}
          onChange={e => setForm(f => ({ ...f, key_metrics: e.target.value }))}
          placeholder={'JSON: {"mrr":20000, ...}'}
          className="w-full p-2 border rounded"
        />
      ),
    },
    {
      label: "Notes",
      content: (
        <textarea
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          placeholder="Any extra context for AI"
          className="w-full p-2 border rounded"
        />
      ),
    },
  ];

  const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const handlePrev = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai-valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          key_metrics: form.key_metrics ? JSON.parse(form.key_metrics) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Valuation failed");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">NexusAI Valuation Wizard</h1>
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">{steps[step].label}</label>
          {steps[step].content}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 0}
            className="px-4 py-2 rounded bg-gray-200"
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              {loading ? "Valuating..." : "Get Valuation"}
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {loading && (
          <div className="mt-6 p-4 border rounded bg-orange-50 animate-pulse">
            <h2 className="font-bold mb-2 text-orange-700">Valuation in progress…</h2>
            <div className="text-sm text-orange-600">Please wait while NexusAI analyzes your business details.</div>
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 border rounded bg-red-50">
            <h2 className="font-bold mb-2 text-red-700">Error</h2>
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}
        {result && !loading && !error && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h2 className="font-bold mb-2">AI Valuation Result</h2>
            <div>
              <strong>Range:</strong> {result.valuation_min} - {result.valuation_max} {result.currency}
            </div>
            <div>
              <strong>Revenue Multiple:</strong> {result.revenue_multiple}
            </div>
            <div>
              <strong>Profit Multiple:</strong> {result.profit_multiple}
            </div>
            <div className="mt-2">
              <strong>Narrative:</strong>
              <p className="text-sm mt-1">{result.narrative}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



export default function ValuationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
          <h1 className="text-4xl font-bold text-brand-text mb-2">
            AI Business Valuation
          </h1>
          <p className="text-lg text-brand-muted mb-4">
            Get an AI-powered valuation estimate for your business in minutes
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>NexusAI Beta:</strong> This valuation uses advanced AI analysis of your business metrics. 
              Results are estimates for planning purposes only and should not replace professional valuations from 
              accredited advisors.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        <ValuationWizard />
      </div>

      {/* Footer Section */}
      <div className="bg-gray-50 border-t border-brand-border mt-12">
        <div className="max-w-4xl mx-auto px-6 py-8 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-sm font-semibold text-brand-text uppercase tracking-wide mb-2">
                ✓ Private & Secure
              </h3>
              <p className="text-sm text-brand-muted">
                Your data is encrypted and never shared with third parties
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-text uppercase tracking-wide mb-2">
                ✓ AI-Powered
              </h3>
              <p className="text-sm text-brand-muted">
                Powered by Gemini, trained on market and business data
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-text uppercase tracking-wide mb-2">
                ✓ Instant Results
              </h3>
              <p className="text-sm text-brand-muted">
                Get your valuation in seconds, not days
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
