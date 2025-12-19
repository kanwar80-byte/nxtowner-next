"use client";

import { saveListingDraft } from "@/utils/listingDraft";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
    getDigitalValuation,
    getListingReadiness,
    getOperationalValuation
} from "./valuationModels";

type Track = "operational" | "digital";
type Step = 0 | 1 | 2 | 3 | 4;

const operationalCategories = [
  "Gas Station",
  "Car Wash",
  "QSR/Franchise",
  "Convenience Retail",
  "Logistics",
  "Other",
];

const digitalModels = [
  "SaaS",
  "Ecom",
  "Agency",
  "Content",
  "Other",
];

const operationalRiskFlags = [
  "Lease expiry",
  "Customer concentration",
  "Supplier dependency",
  "Regulatory/environmental",
  "Low margin",
  "High staff turnover",
  "Other",
];

const digitalRiskFlags = [
  "Platform dependency",
  "High churn",
  "Customer concentration",
  "Paid traffic dependent",
  "Declining revenue",
  "Other",
];

function formatCAD(n: number | null | undefined) {
  if (typeof n !== "number" || isNaN(n)) return "—";
  return "$" + n.toLocaleString("en-CA", { maximumFractionDigits: 0 });
}

export function NexusValuationWizard() {
  // Wizard state
  const [track, setTrack] = useState<Track>("operational");
  const [step, setStep] = useState<Step>(0);

  // Shared state
  const [operational, setOperational] = useState({
    category: "",
    location: "",
    revenue: "",
    grossMargin: "",
    opex: "",
    addbacks: "",
    inventoryIncluded: "no",
    inventoryAmount: "",
    realEstateIncluded: "no",
    realEstateNOI: "",
    realEstateCap: "",
    riskFlags: [] as string[],
    highlights: "",
    risks: "",
  });

  const [digital, setDigital] = useState({
    model: "",
    revenue: "",
    profit: "",
    revenueTrend: "",
    recurring: "",
    concentration: "",
    traffic: "",
    platformRisk: "",
    riskFlags: [] as string[],
    highlights: "",
    risks: "",
  });

  // For results
  const [results, setResults] = useState<null | {
    low: number;
    base: number;
    high: number;
    multipleLow: number;
    multipleHigh: number;
    confidence: "Low" | "Medium" | "High";
    drivers: string[];
    risks: string[];
  }>(null);

  // Save Valuation UI state
  const [saveState, setSaveState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const router = useRouter();

  // Stepper
  const steps = [
    "Asset Type",
    "Financials",
    "Quality & Risk",
    "Growth & Defensibility",
    "Results",
  ];

  // Handlers
  function handleNext() {
    if (step === 3) {
      // Calculate results
      if (track === "operational") {
        const val = getOperationalValuation(operational);
        setResults(val);
      } else {
        const val = getDigitalValuation(digital);
        setResults(val);
      }
    }
    setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  }
  function handleBack() {
    setStep((s) => (s > 0 ? ((s - 1) as Step) : s));
  }
  function handleTab(t: Track) {
    setTrack(t);
    setStep(0);
    setResults(null);
  }

  // Field updaters
  function updateOperational<K extends keyof typeof operational>(k: K, v: any) {
    setOperational((prev) => ({ ...prev, [k]: v }));
  }
  function updateDigital<K extends keyof typeof digital>(k: K, v: any) {
    setDigital((prev) => ({ ...prev, [k]: v }));
  }

  // Validation (minimal)
  function canContinue(): boolean {
    if (step === 0) return true;
    if (track === "operational") {
      if (step === 1) return !!operational.revenue && !!operational.grossMargin;
      if (step === 2) return true;
      if (step === 3) return true;
    } else {
      if (step === 1) return !!digital.revenue && !!digital.profit;
      if (step === 2) return true;
      if (step === 3) return true;
    }
    return true;
  }

  // --- Save Valuation logic ---
  async function handleSaveValuation() {
    setSaveError(null);
    setSaveState("saving");
    const supabase = createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      setSaveState("idle");
      setShowSignInModal(true);
      return;
    }
    // Compose title
    let title = "";
    if (track === "operational") {
      title = `Operational Valuation — ${operational.category || "Unknown"} (${operational.location || "Unknown"})`;
    } else {
      title = `Digital Valuation — ${digital.model || "Unknown"}`;
    }
    // Compose insert
    const inputs = track === "operational" ? operational : digital;
    // Include readiness in outputs
    const outputs = { ...results, readiness };
    try {
      const { error } = await supabase.from("valuations").insert([
        {
          user_id: user.id,
          track,
          title,
          inputs,
          outputs,
          valuation_low: results?.low ?? null,
          valuation_base: results?.base ?? null,
          valuation_high: results?.high ?? null,
          confidence: (results?.confidence || "").toLowerCase(),
        },
      ]);
      if (error) {
        setSaveState("error");
        setSaveError("Could not save valuation. Please try again.");
      } else {
        setSaveState("success");
      }
    } catch (e) {
      setSaveState("error");
      setSaveError("Could not save valuation. Please try again.");
    }
  }

  function handleCreateListingDraft() {
    if (!results) return;
    const readiness =
      step === 4 && results
        ? getListingReadiness({
            track,
            operational: track === "operational" ? operational : undefined,
            digital: track === "digital" ? digital : undefined,
          })
        : null;
    const suggestedTitle =
      track === "operational"
        ? `For Sale — ${operational.category || "Business"} (${operational.location || "Location"})`
        : `For Sale — ${digital.model || "Digital Business"}`;
    const draft = {
      version: "v1",
      createdAt: new Date().toISOString(),
      source: "nxtai_valuation",
      track,
      suggestedTitle,
      location: track === "operational" ? operational.location : undefined,
      categoryOrModel:
        track === "operational" ? operational.category : digital.model,
      valuation: {
        low: results.low,
        base: results.base,
        high: results.high,
        confidence: (results.confidence || "").toLowerCase(),
      },
      readiness: readiness
        ? {
            score: readiness.score,
            tier: readiness.tier,
            missing: readiness.missing,
            strengths: readiness.strengths,
          }
        : undefined,
      inputs: track === "operational" ? operational : digital,
      outputs: results,
    };
    saveListingDraft(draft);
    router.push("/sell/onboarding?prefill=nxtai");
  }

  // Compute readiness on results
  const readiness =
    step === 4 && results
      ? getListingReadiness({
          track,
          operational: track === "operational" ? operational : undefined,
          digital: track === "digital" ? digital : undefined,
        })
      : null;

  // Step content
  function renderStep() {
    if (step === 0) {
      return (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Select your valuation track.</h2>
          <p className="text-slate-600 mb-4">
            NxtAI uses different underwriting logic for operational and digital assets.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Operational */}
            <button
              type="button"
              onClick={() => handleTab("operational")}
              className={`text-left rounded-xl border p-5 transition-all
                ${track === "operational"
                  ? "border-[#0B1221] bg-slate-50 ring-2 ring-[#0B1221]/10"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              <div className="font-semibold text-slate-900 mb-1">
                Operational Assets
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Brick-and-mortar businesses valued on cash flow durability,
                asset backing, and operational risk.
              </p>
            </button>

            {/* Digital */}
            <button
              type="button"
              onClick={() => handleTab("digital")}
              className={`text-left rounded-xl border p-5 transition-all
                ${track === "digital"
                  ? "border-[#0B1221] bg-slate-50 ring-2 ring-[#0B1221]/10"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              <div className="font-semibold text-slate-900 mb-1">
                Digital Assets
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Online businesses valued on margin quality,
                defensibility, and growth efficiency.
              </p>
            </button>
          </div>
        </div>
      );
    }
    if (step === 1) {
      return track === "operational" ? (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Core Financials (TTM)
          </h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Business Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              value={operational.category}
              onChange={(e) => updateOperational("category", e.target.value)}
              required
            >
              <option value="">Select...</option>
              {operationalCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="text-xs text-slate-500 mt-1">
              Determines baseline SDE multiple.
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location (City, Province/State) <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              value={operational.location}
              onChange={(e) => updateOperational("location", e.target.value)}
              required
              placeholder="e.g. Toronto, ON"
            />
            <div className="text-xs text-slate-500 mt-1">
              Used for market context and comparables.
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Annual Revenue (CAD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              value={operational.revenue}
              onChange={(e) => updateOperational("revenue", e.target.value)}
              required
              placeholder="e.g. 500000"
            />
            <div className="text-xs text-slate-500 mt-1">
              Total gross sales in the last 12 months.
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Gross Margin (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              max={100}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              value={operational.grossMargin}
              onChange={(e) => updateOperational("grossMargin", e.target.value)}
              required
              placeholder="e.g. 40"
            />
            <div className="text-xs text-slate-500 mt-1">
              Blended margin across all revenue streams.
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Annual Operating Expenses (CAD)
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              value={operational.opex}
              onChange={(e) => updateOperational("opex", e.target.value)}
              placeholder="e.g. 200000"
            />
            <div className="text-xs text-slate-500 mt-1">
              Rent, payroll, utilities, insurance, repairs, merchant fees, admin.
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Owner Add-Backs (CAD)
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              value={operational.addbacks}
              onChange={(e) => updateOperational("addbacks", e.target.value)}
              placeholder="e.g. 30000"
            />
            <div className="text-xs text-slate-500 mt-1">
              Owner salary, discretionary or one-time expenses (if defensible).
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Inventory Included?
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              value={operational.inventoryIncluded}
              onChange={(e) => updateOperational("inventoryIncluded", e.target.value)}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
            <div className="text-xs text-slate-500 mt-1">
              Include fuel or non-fuel inventory if transferred at close.
            </div>
            {operational.inventoryIncluded === "yes" && (
              <input
                type="number"
                min={0}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
                value={operational.inventoryAmount}
                onChange={(e) => updateOperational("inventoryAmount", e.target.value)}
                placeholder="Inventory Value"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Real Estate Included?
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              value={operational.realEstateIncluded}
              onChange={(e) => updateOperational("realEstateIncluded", e.target.value)}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
            <div className="text-xs text-slate-500 mt-1">
              If included, NxtAI will apply a blended valuation approach.
            </div>
            {operational.realEstateIncluded === "yes" && (
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  min={0}
                  className="w-1/2 rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
                  value={operational.realEstateNOI}
                  onChange={(e) => updateOperational("realEstateNOI", e.target.value)}
                  placeholder="NOI"
                />
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={0.1}
                  className="w-1/2 rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
                  value={operational.realEstateCap}
                  onChange={(e) => updateOperational("realEstateCap", e.target.value)}
                  placeholder="Cap Rate (%)"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Core Financials (TTM)
          </h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Business Model <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              value={digital.model}
              onChange={(e) => updateDigital("model", e.target.value)}
              required
            >
              <option value="">Select...</option>
              {digitalModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <div className="text-xs text-slate-500 mt-1">
              SaaS, E-commerce, Agency, Content, App.
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Annual Revenue (CAD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              value={digital.revenue}
              onChange={(e) => updateDigital("revenue", e.target.value)}
              required
              placeholder="e.g. 200000"
            />
            <div className="text-xs text-slate-500 mt-1">
              Gross revenue, last 12 months.
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Annual Profit / SDE (CAD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              value={digital.profit}
              onChange={(e) => updateDigital("profit", e.target.value)}
              required
              placeholder="e.g. 80000"
            />
            <div className="text-xs text-slate-500 mt-1">
              EBITDA or seller discretionary earnings.
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Revenue Trend
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              value={digital.revenueTrend}
              onChange={(e) => updateDigital("revenueTrend", e.target.value)}
            >
              <option value="">Select...</option>
              <option value="Growing">Growing</option>
              <option value="Stable">Stable</option>
              <option value="Declining">Declining</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Recurring Revenue (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              value={digital.recurring}
              onChange={(e) => updateDigital("recurring", e.target.value)}
              placeholder="e.g. 80"
            />
            <div className="text-xs text-slate-500 mt-1">
              Subscription or repeat revenue portion.
            </div>
          </div>
        </div>
      );
    }
    if (step === 2) {
      return (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {track === "operational"
              ? "Operational Quality & Risk Factors"
              : "Digital Quality & Risk Factors"}
          </h2>
          <div className="text-slate-600 mb-4">
            Select any known risks. NxtAI adjusts valuation multiples accordingly.
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {(track === "operational" ? operationalRiskFlags : digitalRiskFlags).map((flag) => (
              <button
                type="button"
                key={flag}
                className={`px-3 py-1 rounded-full border text-xs font-medium ${
                  (track === "operational"
                    ? operational.riskFlags
                    : digital.riskFlags
                  ).includes(flag)
                    ? "bg-red-50 border-red-300 text-red-700"
                    : "bg-white border-slate-200 text-slate-500"
                }`}
                onClick={() => {
                  if (track === "operational") {
                    updateOperational(
                      "riskFlags",
                      operational.riskFlags.includes(flag)
                        ? operational.riskFlags.filter((f) => f !== flag)
                        : [...operational.riskFlags, flag]
                    );
                  } else {
                    updateDigital(
                      "riskFlags",
                      digital.riskFlags.includes(flag)
                        ? digital.riskFlags.filter((f) => f !== flag)
                        : [...digital.riskFlags, flag]
                    );
                  }
                }}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>
      );
    }
    if (step === 3) {
      return (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Growth Levers &amp; Competitive Position
          </h2>
          <div className="text-slate-600 mb-4">
            Identify realistic expansion levers that a buyer would underwrite.
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Highlights (growth levers)
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              rows={3}
              value={track === "operational" ? operational.highlights : digital.highlights}
              onChange={(e) =>
                track === "operational"
                  ? updateOperational("highlights", e.target.value)
                  : updateDigital("highlights", e.target.value)
              }
              placeholder="e.g. New locations, pricing power, organic traffic, automation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Risks (optional)
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
              rows={2}
              value={track === "operational" ? operational.risks : digital.risks}
              onChange={(e) =>
                track === "operational"
                  ? updateOperational("risks", e.target.value)
                  : updateDigital("risks", e.target.value)
              }
              placeholder="e.g. Lease renewal, margin sensitivity, platform risk"
            />
          </div>
        </div>
      );
    }
    if (step === 4 && results) {
      return (
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Your NxtAI Valuation Range
          </h3>
          <div className="mb-2 text-slate-600 text-sm">
            This range reflects risk-adjusted multiples applied to normalized earnings.
          </div>
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="text-xs text-slate-500 mb-1">Low Estimate</div>
              <div className="text-2xl font-bold text-slate-800">
                {formatCAD(results.low)}
              </div>
            </div>
            <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="text-xs text-slate-500 mb-1">Base Case</div>
              <div className="text-2xl font-bold text-slate-800">
                {formatCAD(results.base)}
              </div>
            </div>
            <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="text-xs text-slate-500 mb-1">High Estimate</div>
              <div className="text-2xl font-bold text-slate-800">
                {formatCAD(results.high)}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="text-sm text-slate-700 mb-1">
              Multiple used:{" "}
              <span className="font-semibold text-slate-900">
                {results.multipleLow.toFixed(1)}x – {results.multipleHigh.toFixed(1)}x SDE
              </span>
            </div>
            <div className="text-sm text-slate-700 mb-1">
              NxtAI Confidence:{" "}
              <span className={`font-semibold ${
                results.confidence === "High"
                  ? "text-emerald-600"
                  : results.confidence === "Medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}>
                {results.confidence}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1">
                Key Value Drivers
              </div>
              <ul className="list-disc pl-5 text-slate-700 text-sm space-y-1">
                {results.drivers.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1">
                Key Risk Adjustments
              </div>
              <ul className="list-disc pl-5 text-slate-700 text-sm space-y-1">
                {results.risks.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* Listing Readiness Score */}
          {readiness && (
          <div className="mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-500 mb-1">Listing Readiness Score</div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-slate-900">{readiness.score}/100</span>
                  {readiness.tier === "deal_ready" && (
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-emerald-200 font-semibold">
                      Deal-Ready
                    </span>
                  )}
                  {readiness.tier === "nearly_ready" && (
                    <span className="text-xs px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/25 text-[#F6E7B0] font-semibold">
                      Nearly Ready
                    </span>
                  )}
                  {readiness.tier === "not_ready" && (
                    <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200 font-semibold">
                      Not Ready
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 sm:mt-0">
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1">What’s complete</div>
                  <ul className="list-disc pl-5 text-slate-700 text-sm space-y-1">
                    {readiness.strengths.length === 0 ? (
                      <li>No strengths detected yet.</li>
                    ) : (
                      readiness.strengths.map((s, i) => <li key={i}>{s}</li>)
                    )}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1">What’s missing</div>
                  <ul className="list-disc pl-5 text-slate-700 text-sm space-y-1">
                    {readiness.missing.length === 0 ? (
                      <li>All key items complete.</li>
                    ) : (
                      readiness.missing.map((m, i) => <li key={i}>{m}</li>)
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Deal-ready listings convert faster and support tighter pricing.
            </div>
          </div>
        )}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#0B1221] font-bold px-6 py-3 rounded-lg shadow transition"
              onClick={handleSaveValuation}
              disabled={saveState === "saving" || saveState === "success"}
            >
              {saveState === "saving" ? "Saving…" : saveState === "success" ? "Saved" : "Save Valuation"}
            </button>
            <button
              type="button"
              className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#0B1221] font-bold px-6 py-3 rounded-lg shadow transition"
              onClick={handleCreateListingDraft}
            >
              Create Listing Draft
            </button>
            <a
              href="/browse"
              className="bg-white border border-slate-200 text-slate-900 font-bold px-6 py-3 rounded-lg shadow hover:bg-slate-50 transition text-center"
            >
              Browse Comparable Listings
            </a>
          </div>
          {/* Save Valuation Feedback */}
          {saveState === "success" && (
            <div className="mt-4 text-emerald-700 font-semibold text-sm">
              Saved. View in your dashboard.
            </div>
          )}
          {saveState === "error" && (
            <div className="mt-4 text-red-600 font-semibold text-sm">
              {saveError || "Could not save valuation. Please try again."}
            </div>
          )}
          {/* Sign In Modal */}
          {showSignInModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full text-center">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Sign in to save this valuation</h2>
                <p className="text-slate-600 mb-4">
                  Save your NxtAI valuation memo, track changes, and compare deals over time.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href="/login"
                    className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#0B1221] font-bold px-4 py-2 rounded-lg shadow transition"
                  >
                    Sign In
                  </a>
                  <button
                    type="button"
                    className="bg-white border border-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition"
                    onClick={() => setShowSignInModal(false)}
                  >
                    Not now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  }

  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        if (canContinue()) handleNext();
      }}
    >
      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  i < step
                    ? "bg-[#D4AF37] text-[#0B1221]"
                    : i === step
                    ? "bg-[#0B1221] text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {i + 1}
              </div>
              <div className="text-xs mt-1 text-slate-600 w-20 text-center">
                {label}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-1 bg-slate-200 rounded" />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Global helper */}
      <div className="mb-6 text-xs text-slate-500">
        Use your most recent trailing-12-months (TTM) data. If fiscal-year only, enter that and note it in Highlights.
      </div>
      {/* Step content */}
      <div className="mb-8">
        {step === 4 && results ? renderResults() : renderStep()}
      </div>
      {/* Nav buttons */}
      {step < 4 && (
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-50"
            onClick={handleBack}
            disabled={step === 0}
          >
            Back
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg font-bold transition ${
              canContinue()
                ? "bg-[#D4AF37] hover:bg-[#C5A028] text-[#0B1221]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
            disabled={!canContinue()}
          >
            {step === 3 ? "View Valuation" : "Continue"}
          </button>
        </div>
      )}
    </form>
  );
}
