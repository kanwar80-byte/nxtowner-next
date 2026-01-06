"use client";

import { useState } from "react";
import { 
  MapPin, Globe, ShieldCheck, Lock, CheckCircle2, 
  TrendingUp, FileText, ArrowRight, Building2, Server, Briefcase
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock Data (Replace with your actual fetch)
const MOCK_LISTING = {
  id: "1",
  type: "operational", // TOGGLE THIS TO 'digital' TO TEST THE OTHER MODE
  title: "Established Shell Gas Station & Convenience Store",
  price: 1850000,
  revenue: 2400000,
  profit: 320000,
  profitLabel: "SDE",
  multiplier: 3.5,
  location: "Shelburne, ON",
  model: "Retail Franchise",
  verified: true,
  verificationSource: "Tax Returns",
  images: ["/placeholder-gas.jpg"], // Ensure you have a placeholder or handle null
  description: "High-volume fuel station with attached convenience store. Real estate included. consistent year-over-year growth.",
};

export default function ListingDetailPage() {
  const listing = MOCK_LISTING; // In real app: use params.id to fetch
  const isOperational = listing.type === "operational";
  
  // Theme Colors
  const accentText = isOperational ? "text-amber-500" : "text-teal-500";
  const accentBg = isOperational ? "bg-amber-500" : "bg-teal-500";
  const accentBorder = isOperational ? "border-amber-500" : "border-teal-500";

  return (
    <main className="min-h-screen bg-[#050505] pt-24 pb-20">
      
      {/* 1. BREADCRUMBS & STATUS */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href={isOperational ? "/browse/operational" : "/browse/digital"} className="hover:text-white">
            {isOperational ? "Real World" : "Digital Assets"}
          </Link>
          <span>/</span>
          <span className="text-slate-300 truncate max-w-[200px]">{listing.title}</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            isOperational 
              ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
              : "bg-teal-500/10 text-teal-500 border-teal-500/20"
          }`}>
            {isOperational ? "Operational Asset" : "Digital Asset"}
          </span>
          {listing.verified && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> 
              Verified {listing.verificationSource}
            </span>
          )}
        </div>
      </div>

      {/* 2. MAIN LAYOUT GRID */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (Content) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* HERO CARD */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/50">
              {/* Image Area */}
              <div className="relative h-[300px] md:h-[400px] w-full bg-slate-800">
                {/* <Image src={...} /> Use real image here */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                   {/* Placeholder Icon if no image */}
                   {isOperational ? <Building2 className="w-20 h-20 opacity-20" /> : <Server className="w-20 h-20 opacity-20" />}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                
                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      {isOperational ? <MapPin className="w-4 h-4 text-amber-500" /> : <Globe className="w-4 h-4 text-teal-500" />}
                      {isOperational ? listing.location : "Global / Remote"}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-600" />
                    <div>{listing.model}</div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Bar */}
              <div className="grid grid-cols-3 divide-x divide-slate-800 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md">
                <div className="p-4 md:p-6 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Asking Price</p>
                  <p className={`text-xl md:text-2xl font-bold ${accentText}`}>
                    ${(listing.price / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div className="p-4 md:p-6 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Revenue (TTM)</p>
                  <p className="text-xl md:text-2xl font-bold text-white">
                    ${(listing.revenue / 1000).toFixed(0)}k
                  </p>
                </div>
                <div className="p-4 md:p-6 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{listing.profitLabel}</p>
                  <p className="text-xl md:text-2xl font-bold text-green-400">
                    ${(listing.profit / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>
            </div>

            {/* DESCRIPTION & AI INSIGHTS */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                Executive Summary
                {/* AI Badge */}
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                  GENERATED BY NXTAI™
                </span>
              </h2>
              <div className="prose prose-invert prose-slate max-w-none">
                <p className="text-slate-300 leading-relaxed">
                  {listing.description}
                </p>
                <div className="my-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h3 className={`text-sm font-bold mb-2 uppercase tracking-wider ${accentText}`}>
                    Why this deal works
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Consistent revenue history verified by {listing.verificationSource}.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{listing.multiplier}x Multiplier is below market average for this sector.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Transfer-ready with full SOP documentation included.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FINANCIALS PREVIEW (Blurred) */}
            <div className="relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Financial Performance</h2>
                <div className="text-sm text-slate-500">Trailing 12 Months</div>
              </div>
              
              {/* Fake Table (Blurred) */}
              <div className="space-y-4 blur-sm opacity-50 select-none">
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span>Gross Revenue</span>
                  <span>$2,400,000</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span>Cost of Goods</span>
                  <span>$1,800,000</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span>Operating Expenses</span>
                  <span>$280,000</span>
                </div>
                <div className="flex justify-between font-bold text-white">
                  <span>Net Profit (SDE)</span>
                  <span>$320,000</span>
                </div>
              </div>

              {/* Unlock Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px]">
                <div className="text-center">
                  <Lock className={`w-8 h-8 mx-auto mb-3 ${accentText}`} />
                  <h3 className="text-lg font-bold text-white mb-1">Unlock Financials</h3>
                  <p className="text-sm text-slate-400 mb-4">Sign NDA to view full P&L and Tax Returns.</p>
                  <button className={`px-6 py-2 rounded-lg font-bold text-black text-sm transition-transform hover:scale-105 ${accentBg}`}>
                    Access Deal Room
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (Sticky Sidebar) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* DEAL ROOM CARD */}
              <div className={`rounded-2xl border p-6 bg-slate-900/80 backdrop-blur-xl ${
                isOperational ? "border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)]" : "border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.1)]"
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Deal Room Status</p>
                    <p className="text-white font-bold flex items-center gap-2">
                      <Lock className="w-3 h-3" /> Locked
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 ${accentText}`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Multiplier</span>
                    <span className="text-white font-mono">{listing.multiplier}x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Founded</span>
                    <span className="text-white font-mono">2014</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Employees</span>
                    <span className="text-white font-mono">4 Full-time</span>
                  </div>
                </div>

                <button className={`w-full py-4 rounded-xl font-bold text-black text-lg shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${accentBg}`}>
                  Unlock Deal Room
                </button>
                <p className="text-xs text-center text-slate-500 mt-3">
                  Includes instant NDA & 24hr exclusivity access.
                </p>
              </div>

              {/* SELLER CARD */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Represented By</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-bold">NxtOwner Brokerage</p>
                    <p className="text-xs text-slate-400">Verified Partner</p>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-colors">
                  Contact Broker
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
