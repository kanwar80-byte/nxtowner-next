"use client";

import { useTrack } from "@/contexts/TrackContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, Lock, Zap } from "lucide-react";
import Link from "next/link";

export default function SellerCTA() {
  const { track } = useTrack();
  const isOps = track === 'operational';

  return (
    <section className="relative py-24 overflow-hidden bg-slate-950">
      {/* Background Gradient Blob */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none ${isOps ? 'bg-amber-600' : 'bg-teal-600'}`} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 backdrop-blur-sm">
          
          {/* LEFT: CONTENT */}
          <div className="lg:w-1/2 space-y-6">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${isOps ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-teal-500/10 text-teal-500 border-teal-500/20'}`}>
              {isOps ? "FOR BUSINESS OWNERS" : "FOR FOUNDERS"}
            </div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              {isOps ? "Exit with Intelligence." : "Scale or Exit. On Your Terms."}
            </h2>
            
            <p className="text-lg text-slate-400">
              {isOps 
                ? "Don't leave money on the table. Our V17 Valuation Engine analyzes EBITDA, assets, and local market trends to give you a bank-ready valuation." 
                : "Your code has value. Get matched with Micro-PE firms and strategic buyers looking for SaaS, AI, and E-commerce assets."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                { icon: Calculator, text: isOps ? "Asset-Based Valuation" : "MRR Multiple Check" },
                { icon: Lock, text: isOps ? "Discreet Broker Matching" : "Private Deal Room" },
                { icon: Zap, text: "Qualified Buyer Network" },
                { icon: ArrowRight, text: "Close in ~60 Days" }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-slate-300">
                  <item.icon className={`w-5 h-5 ${isOps ? 'text-amber-500' : 'text-teal-500'}`} />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Link href="/sell">
                <Button size="lg" className={`h-14 px-8 text-lg font-bold ${isOps ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-600 hover:bg-teal-700'} text-white border-0`}>
                  Start Your Valuation <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT: VISUAL (Abstract Card Stack) */}
          <div className="lg:w-5/12 relative">
             <div className="relative z-10 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase">Estimated Value</p>
                    <p className="text-3xl font-bold text-white">$1,250,000</p>
                  </div>
                  <div className={`px-3 py-1 rounded text-xs font-bold ${isOps ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {isOps ? '+12% vs Market' : '4.2x ARR'}
                  </div>
                </div>
                
                {/* Fake Chart Bars */}
                <div className="flex items-end space-x-2 h-32 mb-6">
                  {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                    <div key={i} className={`flex-1 rounded-t-sm ${isOps ? 'bg-amber-500' : 'bg-teal-500'}`} style={{ height: `${h}%`, opacity: (i + 3) / 10 }}></div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600 w-3/4"></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Profile Completeness</span>
                    <span>75%</span>
                  </div>
                </div>
             </div>

             {/* Background Decorative Card */}
             <div className="absolute top-4 -right-4 w-full h-full bg-slate-800/50 rounded-2xl -z-10 border border-slate-700/50 transform rotate-3"></div>
          </div>

        </div>
      </div>
    </section>
  );
}


