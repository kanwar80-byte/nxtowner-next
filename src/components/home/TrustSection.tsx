"use client";

import Link from "next/link";
import { ShieldCheck, Lock, FileText } from "lucide-react";

interface TrustSectionProps {
  viewMode?: 'real_world' | 'digital';
}

export default function TrustSection({ viewMode = 'real_world' }: TrustSectionProps) {
  const isDigital = viewMode === 'digital';

  const theme = {
    accent: isDigital ? 'text-teal-400' : 'text-amber-500',
    button: isDigital ? 'text-teal-400 hover:text-teal-300' : 'text-amber-500 hover:text-amber-400',
    glow: isDigital ? 'bg-teal-400/10' : 'bg-amber-500/10',
  };

  return (
    <section className="py-20 bg-[#0A0A0A] border-y border-white/5">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* LEFT: TEXT */}
          <div className="flex-1 space-y-6">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
               <Lock className="w-3 h-3" /> BANK-LEVEL SECURITY
             </div>
             <h2 className="text-3xl md:text-5xl font-bold text-white">
               NDA-Gated <br />
               NxtDealRoom™
             </h2>
             <p className="text-lg text-slate-400 leading-relaxed">
               Sensitive financials (P&L, Tax Returns) are never public. 
               Buyers must sign a legally binding NDA and verify identity before accessing 
               {isDigital ? ' Stripe/Baremetrics data.' : ' lease agreements and tax filings.'}
             </p>
             <Link href="/trust" className={`text-sm font-bold flex items-center gap-2 ${theme.button}`}>
               View Security Protocols &rarr;
             </Link>
          </div>

          {/* RIGHT: UI MOCKUP */}
          <div className="flex-1 w-full relative">
             <div className="relative z-10 bg-[#050505] border border-slate-800 rounded-xl p-6 shadow-2xl">
                {/* Mock Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">2024_Tax_Returns.pdf</div>
                        <div className="text-xs text-slate-500">2.4 MB • Verified by NxtOwner</div>
                      </div>
                   </div>
                   <div className="px-3 py-1 rounded bg-green-900/20 text-green-500 text-xs font-bold border border-green-900/50">
                     VERIFIED
                   </div>
                </div>

                {/* Mock Form */}
                <div className="space-y-3">
                   <div className="h-2 w-3/4 bg-slate-800 rounded animate-pulse"></div>
                   <div className="h-2 w-1/2 bg-slate-800 rounded animate-pulse"></div>
                   
                   <div className="mt-6 p-4 bg-slate-900/50 rounded border border-slate-800 flex items-center gap-3">
                      <Lock className={`w-5 h-5 ${theme.accent}`} />
                      <div className="text-xs text-slate-400">
                        To view this document, you must <span className="text-white font-bold">Sign NDA</span> and connect LinkedIn.
                      </div>
                   </div>
                </div>
             </div>

             {/* Glow Effect */}
             <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full ${theme.glow} blur-[80px] -z-10`}></div>
          </div>

        </div>
      </div>
    </section>
  );
}