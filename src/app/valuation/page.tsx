import { NxtAIValuationWizard } from "@/components/valuation/NxtAIValuationWizard";
import { BarChart3, Lock, Sparkles } from "lucide-react";

export default function ValuationPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0B1221] py-14 md:py-20 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            NxtAI Business Valuation — Deal-Grade, Not Guesswork.
          </h1>
          <p className="text-lg text-slate-300 mb-6">
            Get a valuation range built from verified inputs, normalization rules, and risk-adjusted multiples — tailored for operational and digital assets.
          </p>
          {/* Beta disclaimer */}
          <div className="mt-6">
            <p className="text-xs text-slate-300/80">
              <span className="font-medium text-slate-200">NxtAI Beta:</span>{" "}
              Estimates are for planning and deal screening. Final value depends on diligence,
              documentation, and buyer terms.
            </p>
          </div>
          {/* Underwriting Guarantees band */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-stretch justify-center">
            <div className="flex-1 min-w-[200px] flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <Lock className="w-6 h-6 text-slate-200 mb-2" />
              <div className="text-xs font-semibold tracking-wide text-slate-200 mb-1">
                PRIVATE &amp; SECURE
              </div>
              <div className="text-[13px] leading-snug text-slate-300/80">
                Your inputs stay private. No public listing is created.
              </div>
            </div>
            <div className="flex-1 min-w-[200px] flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <Sparkles className="w-6 h-6 text-slate-200 mb-2" />
              <div className="text-xs font-semibold tracking-wide text-slate-200 mb-1">
                AI-ASSISTED UNDERWRITING
              </div>
              <div className="text-[13px] leading-snug text-slate-300/80">
                Valuations are generated using structured models and risk-adjusted logic.
              </div>
            </div>
            <div className="flex-1 min-w-[200px] flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <BarChart3 className="w-6 h-6 text-slate-200 mb-2" />
              <div className="text-xs font-semibold tracking-wide text-slate-200 mb-1">
                INSTANT RANGE + DRIVERS
              </div>
              <div className="text-[13px] leading-snug text-slate-300/80">
                See low, base, and high valuation ranges with clear drivers and risks.
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Wizard */}
      <section className="py-12 bg-[#F8FAFC] min-h-[60vh]">
        <div className="max-w-2xl mx-auto px-4">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-0 sm:p-6">
            <NxtAIValuationWizard />
          </div>
        </div>
      </section>
    </div>
  );
}


