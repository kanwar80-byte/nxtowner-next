"use client";
// --- Gemini Valuation Single-Screen Page ---
import { useState } from "react";
import { cleanJsonString } from "@/lib/cleanJsonString";
import { ValuationAIResult } from "../../types/valuation";



type GeminiValuationForm = {
  businessType: string;
  monetization: string;
  businessAgeValue: string;
  businessAgeUnit: "years" | "months";
  country: string;
  revenueMetric: string;
  revenue: string;
  profit: string;
  revenueTrend: string;
  visitors: string;
  churn: string;
  trafficSources: string[];
  concentrationRisk: boolean;
  ownerTime: string;
  team: string;
  proprietaryIP: boolean;
  legalIssues: boolean;
  notes: string;
  key_metrics: string;
  // Physical business fields
  physicalAnnualRevenue: string;
  physicalAnnualProfit: string;
  physicalLocations: string;
  physicalGrossMargin: string;
  physicalRent: string;
  physicalPayroll: string;
  physicalDailyCustomers: string;
  physicalFuelVolume: string;
  physicalWashCount: string;
};

const initialForm: GeminiValuationForm = {
  businessType: "SaaS",
  monetization: "Subscriptions",
  businessAgeValue: "",
  businessAgeUnit: "years",
  country: "United States",
  revenueMetric: "MRR",
  revenue: "",
  profit: "",
  revenueTrend: "Growing",
  visitors: "",
  churn: "",
  trafficSources: [],
  concentrationRisk: false,
  ownerTime: "Full-time",
  team: "Solo Founder",
  proprietaryIP: false,
  legalIssues: false,
  notes: "",
  key_metrics: "",
  // Physical business fields
  physicalAnnualRevenue: "",
  physicalAnnualProfit: "",
  physicalLocations: "",
  physicalGrossMargin: "",
  physicalRent: "",
  physicalPayroll: "",
  physicalDailyCustomers: "",
  physicalFuelVolume: "",
  physicalWashCount: ""
};

export default function GeminiValuationPage() {
    const [form, setForm] = useState<GeminiValuationForm>(initialForm);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ValuationAIResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [keyMetricsError, setKeyMetricsError] = useState<string | null>(null);

    // --- Derived business type helpers ---
    const isDigital = [
      "SaaS",
      "Ecommerce Store",
      "Marketplace",
      "Content / Media Site",
      "Agency / Service Business",
      "Other Digital"
    ].includes(form.businessType);
    const businessCategory = isDigital ? "digital" : "physical";

  // --- Form Handlers ---
  const handleChange = <K extends keyof GeminiValuationForm>(field: K, value: GeminiValuationForm[K]) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  // Only allow "trafficSources" for checkbox group
  const handleCheckboxGroup = (field: "trafficSources", value: string) => {
    setForm(f => {
      const arr = f.trafficSources;
      return {
        ...f,
        trafficSources: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value]
      };
    });
  };

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setKeyMetricsError(null);
    let parsedKeyMetrics;
    if (form.key_metrics) {
      try {
        parsedKeyMetrics = JSON.parse(cleanJsonString(form.key_metrics));
        if (
          typeof parsedKeyMetrics !== "object" ||
          parsedKeyMetrics === null ||
          Array.isArray(parsedKeyMetrics)
        ) {
          setKeyMetricsError("Your metrics must be a JSON object (e.g. {\"revenue\": 500000}).");
          setLoading(false);
          return;
        }
      } catch (err) {
        setKeyMetricsError("Your metrics must be valid JSON (e.g. {\"revenue\": 500000}).");
        setLoading(false);
        return;
      }
    }
    try {
      const payload: any = {
        business_type: form.businessType,
        businessCategory,
        monetization: form.monetization,
        businessAgeValue: form.businessAgeValue,
        businessAgeUnit: form.businessAgeUnit,
        country: form.country,
        operations: {
          ownerTime: form.ownerTime,
          team: form.team,
          ip: form.proprietaryIP,
          legalIssues: form.legalIssues
        },
        extraNotes: form.notes,
        key_metrics: form.key_metrics,
        parsedKeyMetrics: parsedKeyMetrics || null
      };
      if (isDigital) {
        payload.digitalMetrics = {
          revenueMetric: form.revenueMetric,
          annualRevenue: form.revenue,
          annualProfit: form.profit,
          trend: form.revenueTrend,
          monthlyVisitors: form.visitors,
          churn: form.churn,
          trafficSources: form.trafficSources
        };
      } else {
        payload.physicalMetrics = {
          annualRevenue: form.physicalAnnualRevenue,
          annualProfit: form.physicalAnnualProfit,
          locations: form.physicalLocations,
          grossMarginPercent: form.physicalGrossMargin,
          annualRent: form.physicalRent,
          annualPayroll: form.physicalPayroll,
          dailyCustomers: form.physicalDailyCustomers,
          fuelVolumeLitres: form.physicalFuelVolume,
          carWashCount: form.physicalWashCount
        };
      }
      const res = await fetch("/api/ai-valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch valuation.");
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers ---
  const formatNumber = (value: string) => {
    if (!value) return "";
    const num = Number(value);
    if (isNaN(num)) return value;
    return num.toLocaleString();
  };

  const countryOptions = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "India", "Singapore", "Netherlands", "Brazil", "Other"
  ];

  // --- Layout ---
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Gemini Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-10 flex items-center gap-4">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600">
            {/* Valuation/analytics icon */}
            <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><path d="M6 22v-7m4 7V10m4 12v-4m4 4V6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          </span>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gemini Valuation — Digital & Physical Businesses</h1>
            <p className="text-lg text-neutral-300 mb-4">Get an estimated value range for your SaaS, ecommerce, agency, gas station, car wash, or other operational business based on revenue, profit, and key metrics.</p>
            <span className="text-xs text-blue-300 mt-2 block">Powered by Gemini 3 Pro</span>
          </div>
        </div>
      </div>

      {/* Form Sections */}
      <form className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8" onSubmit={handleSubmit}>
        {/* Section A: Business Profile */}
        <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Business Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Business Type</label>
              <select
                value={form.businessType}
                onChange={e => handleChange("businessType", e.target.value)}
                className="w-full p-3 rounded bg-gray-950 border border-gray-700"
              >
                <optgroup label="Digital Businesses">
                  <option value="SaaS">SaaS</option>
                  <option value="Ecommerce Store">Ecommerce Store</option>
                  <option value="Marketplace">Marketplace</option>
                  <option value="Content / Media Site">Content / Media Site</option>
                  <option value="Agency / Service Business">Agency / Service Business</option>
                  <option value="Other Digital">Other Digital</option>
                </optgroup>
                <optgroup label="Physical / Operational Businesses">
                  <option value="Gas Station & C-Store">Gas Station & C-Store</option>
                  <option value="Car Wash (Standalone)">Car Wash (Standalone)</option>
                  <option value="Gas Station + Car Wash">Gas Station + Car Wash</option>
                  <option value="QSR / Restaurant">QSR / Restaurant</option>
                  <option value="Retail Store">Retail Store</option>
                  <option value="Warehouse / Industrial">Warehouse / Industrial</option>
                  <option value="Automotive / Service Center">Automotive / Service Center</option>
                  <option value="Hospitality / Accommodation">Hospitality / Accommodation</option>
                  <option value="Other Physical">Other Physical</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monetization Model</label>
              <select value={form.monetization} onChange={e => handleChange("monetization", e.target.value)} className="w-full p-3 rounded bg-gray-950 border border-gray-700">
                <option value="Subscriptions">Subscriptions (Recurring)</option>
                <option value="One-time Sales">One-time Sales</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Ads">Ads</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business Age</label>
              <div className="flex gap-2">
                <input type="number" min="0" value={form.businessAgeValue} onChange={e => handleChange("businessAgeValue", e.target.value)} placeholder="e.g. 3" className="w-2/3 p-3 rounded bg-gray-950 border border-gray-700" />
                <select value={form.businessAgeUnit} onChange={e => handleChange("businessAgeUnit", e.target.value as "years" | "months")} className="w-1/3 p-3 rounded bg-gray-950 border border-gray-700">
                  <option value="years">years</option>
                  <option value="months">months</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country / Region</label>
              <select value={form.country} onChange={e => handleChange("country", e.target.value)} className="w-full p-3 rounded bg-gray-950 border border-gray-700">
                {countryOptions.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </section>


        {/* DIGITAL METRICS */}
        {isDigital ? (
          <>
            {/* Revenue & Profit (Digital) */}
            <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Revenue & Profit (Digital)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Revenue Metric</label>
                  <div className="flex gap-3">
                    <label className="inline-flex items-center gap-2">
                      <input type="radio" name="revenueMetric" value="MRR" checked={form.revenueMetric === "MRR"} onChange={e => handleChange("revenueMetric", e.target.value)} />
                      <span>Monthly Recurring (MRR)</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="radio" name="revenueMetric" value="Annual" checked={form.revenueMetric === "Annual"} onChange={e => handleChange("revenueMetric", e.target.value)} />
                      <span>Annual Revenue</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Annual (or Monthly) Revenue ($)</label>
                  <input type="number" value={form.revenue} onChange={e => handleChange("revenue", e.target.value)} placeholder="e.g. 500000" className="w-full p-3 rounded bg-gray-950 border border-gray-700" min="0" />
                  {form.revenue && <div className="text-xs text-gray-400 mt-1">{formatNumber(form.revenue)}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Annual Net Profit / SDE ($)</label>
                  <input type="number" value={form.profit} onChange={e => handleChange("profit", e.target.value)} placeholder="e.g. 120000" className="w-full p-3 rounded bg-gray-950 border border-gray-700" min="0" />
                  {form.profit && <div className="text-xs text-gray-400 mt-1">{formatNumber(form.profit)}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Revenue Trend (YoY)</label>
                  <div className="flex gap-3">
                    {['Growing','Stable','Declining'].map(trend => (
                      <button type="button" key={trend} className={`px-3 py-2 rounded ${form.revenueTrend===trend?'bg-blue-700 text-white':'bg-gray-800 text-gray-300'}`} onClick={() => handleChange("revenueTrend", trend)}>{trend}</button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Metrics & Traction (Digital) */}
            <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Metrics & Traction (Digital)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Unique Visitors</label>
                  <input type="number" value={form.visitors} onChange={e => handleChange("visitors", e.target.value)} placeholder="e.g. 5000" className="w-full p-3 rounded bg-gray-950 border border-gray-700" min="0" />
                  {form.visitors && <div className="text-xs text-gray-400 mt-1">{formatNumber(form.visitors)}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Churn Rate (%)</label>
                  <input type="number" value={form.churn} onChange={e => handleChange("churn", e.target.value)} placeholder="e.g. 5" className="w-full p-3 rounded bg-gray-950 border border-gray-700" min="0" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Main Traffic Sources</label>
                  <div className="flex flex-wrap gap-3">
                    {['Organic','Paid','Email','Social','Affiliates','Other'].map(src => (
                      <label key={src} className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={form.trafficSources.includes(src)} onChange={() => handleCheckboxGroup("trafficSources", src)} />
                        <span>{src}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              {/* Risk Callout Bar */}
              <div className="mt-6 bg-orange-900/80 border-l-4 border-orange-500 p-3 rounded">
                <span className="text-orange-200 text-sm">High concentration risk: More than 30% of revenue comes from a single client or channel.</span>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Revenue & Profit (Physical / Operational) */}
            <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Revenue & Profit (Physical / Operational)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Total Annual Revenue ($)</label>
                  <input type="number" value={form.physicalAnnualRevenue} onChange={e => handleChange("physicalAnnualRevenue", e.target.value)} placeholder="e.g. 800000" className="w-full p-3 rounded bg-gray-950 border border-gray-700" min="0" />
                  {form.physicalAnnualRevenue && <div className="text-xs text-gray-400 mt-1">{formatNumber(form.physicalAnnualRevenue)}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Net Annual Profit / SDE ($)</label>
                  <input type="number" value={form.physicalAnnualProfit} onChange={e => handleChange("physicalAnnualProfit", e.target.value)} placeholder="e.g. 120000" className="w-full p-3 rounded bg-gray-950 border border-gray-700" min="0" />
                  {form.physicalAnnualProfit && <div className="text-xs text-gray-400 mt-1">{formatNumber(form.physicalAnnualProfit)}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Locations</label>
                  <input type="number" value={form.physicalLocations} onChange={e => handleChange("physicalLocations", e.target.value)} placeholder="e.g. 2" className="w-full p-3 rounded bg-gray-950 border border-gray-700" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Average Gross Margin (%)</label>
                  <input type="number" value={form.physicalGrossMargin} onChange={e => handleChange("physicalGrossMargin", e.target.value)} placeholder="e.g. 35" className="w-full p-3 rounded bg-gray-950 border border-gray-700" min="0" max="100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Annual Rent / Lease Cost ($)</label>
                  <input type="number" value={form.physicalRent} onChange={e => handleChange("physicalRent", e.target.value)} placeholder="e.g. 50000" className="w-full p-3 rounded bg-gray-950 border border-gray-700" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Annual Payroll / Wages ($)</label>
                  <input type="number" value={form.physicalPayroll} onChange={e => handleChange("physicalPayroll", e.target.value)} placeholder="e.g. 120000" className="w-full p-3 rounded bg-gray-950 border border-gray-700" min="0" />
                </div>
              </div>
            </section>

            {/* Site & Operations (Physical / Operational) */}
            <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Site & Operations (Physical / Operational)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Typical Daily Customer Count (optional)</label>
                  <input type="number" value={form.physicalDailyCustomers} onChange={e => handleChange("physicalDailyCustomers", e.target.value)} placeholder="e.g. 150" className="w-full p-3 rounded bg-gray-950 border border-gray-700" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Annual Fuel Volume (litres, optional)</label>
                  <input type="number" value={form.physicalFuelVolume} onChange={e => handleChange("physicalFuelVolume", e.target.value)} placeholder="e.g. 1000000" className="w-full p-3 rounded bg-gray-950 border border-gray-700" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Annual Car Wash Count (optional)</label>
                  <input type="number" value={form.physicalWashCount} onChange={e => handleChange("physicalWashCount", e.target.value)} placeholder="e.g. 20000" className="w-full p-3 rounded bg-gray-950 border border-gray-700" min="0" />
                </div>
              </div>
            </section>
          </>
        )}

        {/* Section D: Operations & Risk */}
        <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Operations & Risk</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Owner Time Commitment</label>
              <select value={form.ownerTime} onChange={e => handleChange("ownerTime", e.target.value)} className="w-full p-3 rounded bg-gray-950 border border-gray-700">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Passive">Passive (0–5h/week)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Team Structure</label>
              <select value={form.team} onChange={e => handleChange("team", e.target.value)} className="w-full p-3 rounded bg-gray-950 border border-gray-700">
                <option value="Solo Founder">Solo Founder</option>
                <option value="Small Team">Small Team</option>
                <option value="Larger Team">Larger Team</option>
                <option value="Outsourced">Outsourced</option>
              </select>
            </div>
            <div className="md:col-span-2 flex flex-col gap-2 mt-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.proprietaryIP} onChange={e => handleChange("proprietaryIP", e.target.checked)} />
                <span>Includes proprietary code or IP</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.legalIssues} onChange={e => handleChange("legalIssues", e.target.checked)} />
                <span>Has outstanding legal or policy issues (bans, disputes, etc.)</span>
              </label>
            </div>
          </div>
        </section>

        {/* Section E: Extra Notes for AI */}
        <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Extra notes for AI (optional)</h2>
          <textarea value={form.notes} onChange={e => handleChange("notes", e.target.value)} placeholder="Key customers, special contracts, one-off events, growth opportunities, etc." className="w-full p-3 rounded bg-gray-950 border border-gray-700" rows={4} />
        </section>

        {/* Key Metrics JSON (optional, hidden advanced) */}
        <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Key Metrics JSON (advanced, optional)</h2>
          <input type="text" value={form.key_metrics} onChange={e => handleChange("key_metrics", e.target.value)} placeholder='e.g. {"mrr":20000, "users":5000}' className="w-full p-3 rounded bg-gray-950 border border-gray-700" />
          {keyMetricsError && <p className="text-red-400 text-xs mt-2">{keyMetricsError}</p>}
        </section>

        {/* CTA Card */}
        <section className="bg-gradient-to-tr from-blue-700 to-purple-700 rounded-xl p-6 shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2">Ready to see your valuation?</h2>
          <p className="text-base text-blue-100 mb-4 text-center">Gemini will analyze your metrics against market benchmarks and recent deals to estimate a fair value range.</p>
          <button type="submit" disabled={loading} className="px-6 py-3 rounded bg-white text-blue-700 font-semibold text-lg shadow hover:bg-blue-50 transition">
            {loading ? "Generating Gemini Estimate…" : "Generate Gemini Estimate"}
          </button>
        </section>
      </form>

      {/* Result Panel */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {loading && (
          <div className="p-6 rounded-xl bg-gray-900 border border-blue-700 flex items-center gap-3 animate-pulse">
            <span className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            <div>
              <h3 className="font-semibold text-blue-200">Generating your valuation with Gemini…</h3>
              <p className="text-sm text-blue-300">This usually takes less than a minute.</p>
            </div>
          </div>
        )}
        {error && (
          <div className="p-6 rounded-xl bg-red-900 border border-red-700">
            <h3 className="font-semibold text-red-200 mb-2">Error</h3>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
        {result && !loading && !error && (
          <div className="p-6 rounded-xl bg-gray-900 border border-green-700">
            <h3 className="font-bold text-green-200 mb-2">Gemini Valuation Result</h3>
            <div className="mb-2">
              <strong>Estimated Value:</strong> <span className="text-green-300 text-lg font-bold">{result.valuation_min} – {result.valuation_max} {result.currency}</span>
            </div>
            <div className="mb-2">
              <strong>Method:</strong> <span className="text-green-100">{result.method || "AI market comparables"}</span>
            </div>
            {result.key_drivers && (
              <div className="mb-2">
                <strong>Key Drivers:</strong>
                <ul className="list-disc ml-6 text-green-100">
                  {result.key_drivers.map((d: string, i: number) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            )}
            {result.risks && (
              <div className="mb-2">
                <strong>Risks:</strong>
                <ul className="list-disc ml-6 text-red-200">
                  {result.risks.map((r: string, i: number) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
            {result.narrative && (
              <div className="mt-2">
                <strong>AI Notes:</strong>
                <p className="text-sm text-green-100 mt-1">{result.narrative}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="bg-gray-950 border-t border-gray-800 mt-12">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-2">✓ Private & Secure</h3>
              <p className="text-sm text-gray-400">Your data is encrypted and never shared with third parties</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-2">✓ AI-Powered</h3>
              <p className="text-sm text-gray-400">Powered by Gemini, trained on market and business data</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-2">✓ Instant Results</h3>
              <p className="text-sm text-gray-400">Get your valuation in seconds, not days</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



