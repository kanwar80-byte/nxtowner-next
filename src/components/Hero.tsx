'use client';

import { MapPin, Search, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const MESSAGING = {
  All: {
    headlineStart: "The Operating System for",
    headlineGradient: "Business Acquisitions.",
    // Exact gradient from your screenshot (Blue -> Purple -> Pink)
    textGradientClass: "from-blue-500 via-purple-500 to-pink-500",
    
    subtitle: "Canada’s premier marketplace. Buy and sell verified assets with bank-grade data and AI valuations.",
    placeholder: "NxtSearch (e.g. SaaS under $500k with stable cash flow)", // updated placeholder
    glowColor: "from-blue-600/20 via-purple-600/20 to-pink-600/20"
  },
  Operational: {
    headlineStart: "Institutional-Grade",
    headlineGradient: "Operational Businesses.",
    textGradientClass: "from-cyan-400 via-blue-500 to-indigo-500",
    
    subtitle: "Acquire verified brick-and-mortar businesses with real cash flow, tangible assets, and lender-ready financials.",
    placeholder: "Search gas stations, car washes, QSRs, logistics...",
    glowColor: "from-cyan-500/20 via-blue-500/20 to-indigo-500/20"
  },
  Digital: {
    headlineStart: "Scalable",
    headlineGradient: "Digital Businesses.",
    textGradientClass: "from-fuchsia-400 via-pink-500 to-purple-500",
    
    subtitle: "Buy and sell SaaS, e-commerce, and online businesses with AI-normalized financials and verified performance.",
    placeholder: "Search SaaS, e-commerce, agencies, content sites...",
    glowColor: "from-fuchsia-500/20 via-pink-500/20 to-purple-500/20"
  }
};

type TabType = 'All' | 'Operational' | 'Digital';

export default function Hero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [query, setQuery] = useState('');

  const content = MESSAGING[activeTab];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/browse?q=${encodeURIComponent(query)}&type=${activeTab}`);
  };

  return (
    <div className="relative bg-[#050B14] overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32 px-4 flex flex-col items-center">
      
      {/* BACKGROUND GLOW */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] opacity-30 pointer-events-none transition-all duration-1000 bg-gradient-to-r ${content.glowColor} blur-[120px] rounded-full`}></div>

      <div className="relative max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
        
        {/* 1. TABS */}
        <div className="inline-flex bg-[#0F1623] p-1.5 rounded-full border border-slate-800 mb-10 shadow-xl">
          {(['All', 'Operational', 'Digital'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'All' ? 'All Assets' : tab}
            </button>
          ))}
        </div>

        {/* 2. HEADLINE */}
        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black text-white tracking-tight mb-6 leading-[1.1]">
          {content.headlineStart} 
          <br /> 
          <span className={`bg-clip-text text-transparent bg-gradient-to-r ${content.textGradientClass} animate-in fade-in duration-1000`}>
            {content.headlineGradient}
          </span>
        </h1>

        {/* 3. SUBTITLE */}
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          {content.subtitle}
        </p>

        {/* 4. SEARCH BAR */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative mb-8">
          <div className="relative bg-white rounded-full p-1.5 flex items-center shadow-2xl shadow-blue-900/10 h-14 pl-5">
            <Search className="text-slate-400 mr-3" size={20} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={content.placeholder}
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-sm md:text-base h-full outline-none"
            />
            <button 
              type="submit"
              className="bg-[#020617] text-white px-5 py-2.5 rounded-full font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-slate-800 transition-all mr-1"
            >
              <Sparkles size={14} className="text-[#EAB308]" /> {/* Gold Icon Accent */}
              Ask NxtOwner
            </button>
          </div>
        </form>

        {/* 5. TAGS: GREEN & ORANGE ACCENTS */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {/* GREEN: Verified / Money */}
          <button onClick={() => router.push('/browse?maxPrice=500000')} className="flex items-center gap-2 bg-[#0F1623] border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold hover:border-emerald-500/60 hover:text-emerald-400 transition-colors group">
            <TrendingUp size={14} className="text-emerald-500 group-hover:text-emerald-400" /> Under $500k
          </button>
          <button onClick={() => router.push('/browse?verified=true')} className="flex items-center gap-2 bg-[#0F1623] border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold hover:border-emerald-500/60 hover:text-emerald-400 transition-colors group">
            <ShieldCheck size={14} className="text-emerald-500 group-hover:text-emerald-400" /> Verified Cash Flow
          </button>
          {/* ORANGE: Opportunity / Franchise */}
          <button onClick={() => router.push('/browse?type=Franchise')} className="flex items-center gap-2 bg-[#0F1623] border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold hover:border-orange-500/60 hover:text-orange-400 transition-colors group">
            <MapPin size={14} className="text-orange-500 group-hover:text-orange-400" /> Franchise Resale
          </button>
        </div>

        {/* 6. MAIN CTA: GOLD (Matches List Your Business) */}
        <button 
          onClick={() => router.push('/sell/onboarding')}
          className="bg-[#EAB308] hover:bg-[#CA8A04] text-slate-900 px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-[#EAB308]/20 transition-all transform hover:-translate-y-1 hover:scale-105"
        >
          Sell Your Business
        </button>

      </div>
    </div>
  );
}