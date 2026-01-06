"use client";

import { useTrack, TrackProvider } from "@/contexts/TrackContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Calculator, FileCheck, ShieldCheck } from "lucide-react";

// --- COMPONENTS ---
import HeroSection from "@/components/home/HeroSection"; // <--- NEW IMPORT
import CategoryGrid from "@/components/home/CategoryGrid"; // <--- NOW HANDLES BOTH
import FeaturedDigitalAcquisitions from "@/components/home/FeaturedDigitalAcquisitions";
import FeaturedOperationalAcquisitions from "@/components/home/FeaturedOperationalAcquisitions";
import ServicesSection from "@/components/home/ServicesSection";
import SellerCTA from "@/components/home/SellerCTA";
import MarketInsights from "@/components/home/MarketInsights";

// --- TYPES ---
interface HomePageClientProps {
  initialData?: any; // Replace with specific type if you have it
}

function HomeContent({ initialData }: HomePageClientProps) {
  const { track } = useTrack();
  const router = useRouter();
  const isOperational = track === 'operational';
  const modeParam = isOperational ? 'operational' : 'digital';

  return (
    <main className="min-h-screen bg-[#050505] text-slate-200 selection:bg-teal-500/30">
      
      {/* 1. NEW SMART HERO (Handles Toggle & Search) */}
      <HeroSection />

      {/* 2. UNIFIED BROWSE GRID (Auto-switches based on track) */}
      <section id="browse-models" className="relative z-20 -mt-10 mb-12">
        <CategoryGrid /> 
      </section>

      {/* 3. FEATURED LISTINGS (DUAL TRACK) */}
      <section id="featured-listings" className="py-12 border-t border-slate-900 bg-slate-950/50">
        <div className="container mx-auto px-4">
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">
              Featured <span className={isOperational ? "text-amber-500" : "text-teal-500"}>
                {isOperational ? "Real World" : "Digital"}
              </span> Listings
            </h2>
            <Link 
              href={isOperational ? "/browse/operational" : "/browse/digital"} 
              className={`font-medium flex items-center gap-1 transition-colors ${
                isOperational ? "text-amber-500 hover:text-amber-400" : "text-teal-500 hover:text-teal-400"
              }`}
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Conditional Rendering based on Track */}
          {isOperational ? (
            <FeaturedOperationalAcquisitions />
          ) : (
            <FeaturedDigitalAcquisitions /> 
          )}

        </div>
      </section>

      {/* 4. VALUE PROPOSITION (Context Aware) */}
      <section id="value-prop-section" className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              The Operating System for <br />
              <span className={isOperational ? "text-amber-500" : "text-teal-500"}>
                {isOperational ? "Real World Deals." : "Digital Deals."}
              </span>
            </h2>
            <p className="text-slate-400 text-lg">
              {isOperational 
                ? "From Main Street to Industrial, we provide the data, verification, and deal rooms to close confidently."
                : "From SaaS to E-commerce, we provide the metrics, code audits, and migration support to close faster."}
            </p>
          </div>
          
          {/* 3-Column Value Prop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                isOperational ? "bg-amber-500/10 text-amber-500" : "bg-teal-500/10 text-teal-500"
              }`}>
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Discovery</h3>
              <p className="text-slate-400">
                {isOperational 
                  ? "Filter by EBITDA, location, and asset type. Verified financials only."
                  : "Filter by MRR, churn, and tech stack. API-verified metrics only."}
              </p>
            </div>

             {/* Card 2 */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                isOperational ? "bg-amber-500/10 text-amber-500" : "bg-teal-500/10 text-teal-500"
              }`}>
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">NDA-Gated Rooms</h3>
              <p className="text-slate-400">
                Securely access P&L, tax returns, and operational data behind instant NDAs.
              </p>
            </div>

             {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                isOperational ? "bg-amber-500/10 text-amber-500" : "bg-teal-500/10 text-teal-500"
              }`}>
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fair Valuation</h3>
              <p className="text-slate-400">
                 {isOperational 
                  ? "Market-based multiples for Main Street & Franchise assets."
                  : "Data-driven multiples for SaaS & Digital assets."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEAL ROOMS / TRUST SECTION */}
      <section id="deal-rooms-section" className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
             <div className="flex-1">
               <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border mb-4 ${
                 isOperational ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-teal-500/10 text-teal-500 border-teal-500/20'
               }`}>
                 SECURE NXTDEAL™ FLOW
               </div>
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                 NDA-Gated NxtDealRoom™
               </h2>
               <p className="text-slate-400 text-lg mb-6">
                 {isOperational
                   ? "Sensitive financials and tax documents stay protected behind NDA-gated rooms."
                   : "Source code, analytics access, and sensitive IP stay protected behind NDA-gated rooms."}
               </p>
               <Link href={`/how-it-works?mode=${modeParam}`} className={`font-semibold hover:opacity-80 transition-colors flex items-center gap-2 ${
                 isOperational ? 'text-amber-500' : 'text-teal-500'
               }`}>
                 How verification works <ArrowRight className="w-4 h-4" />
               </Link>
             </div>
             {/* Visual representation of a locked file */}
             <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-sm">Profit & Loss (2024)</span>
                    <Lock className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-sm">Tax Returns (T2)</span>
                    <Lock className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-sm">Bank Statements</span>
                    <Lock className="w-4 h-4 text-red-400" />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. AI TOOLS / VALUATION */}
      <section id="ai-tools-section" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Valuation & Due Diligence Made Simple
            </h2>
            <p className="text-slate-400 text-lg">
              {isOperational
                ? "Use NxtValuation™ to estimate fair market value based on SDE and EBITDA."
                : "Use NxtValuation™ to estimate value based on MRR multiples and growth rate."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href={`/sell/valuation?mode=${modeParam}`} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all group">
              <Calculator className={`w-10 h-10 mb-4 ${isOperational ? 'text-amber-500' : 'text-teal-500'}`} />
              <h3 className="text-xl font-bold text-white mb-2">NxtValuation™</h3>
              <p className="text-slate-400 text-sm">Instant, data-backed price estimates.</p>
            </Link>

            <Link href={`/tools/diligence?mode=${modeParam}`} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all group">
              <FileCheck className={`w-10 h-10 mb-4 ${isOperational ? 'text-amber-500' : 'text-teal-500'}`} />
              <h3 className="text-xl font-bold text-white mb-2">NxtAI™ Diligence</h3>
              <p className="text-slate-400 text-sm">Automated risk checklist.</p>
            </Link>

            <Link href={`/tools/risk?mode=${modeParam}`} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all group">
              <ShieldCheck className={`w-10 h-10 mb-4 ${isOperational ? 'text-amber-500' : 'text-teal-500'}`} />
              <h3 className="text-xl font-bold text-white mb-2">Risk Scan</h3>
              <p className="text-slate-400 text-sm">Identify red flags early.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. SHARED FOOTER SECTIONS */}
      <ServicesSection />
      <SellerCTA />
      <MarketInsights />
      
    </main>
  );
}

// Wrapper to ensure Context exists
export default function HomePageClient(props: HomePageClientProps) {
  return (
    <TrackProvider>
      <HomeContent {...props} />
    </TrackProvider>
  );
}