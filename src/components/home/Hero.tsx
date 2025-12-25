'use client';

import { ArrowRight, CheckCircle, ChevronDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const HERO_COPY = {
  all: {
    title: "The Operating System for Business Acquisitions.",
    subtitle: "Canada’s premier marketplace. Buy and sell verified assets with bank-grade data and AI valuations.",
    placeholder: "Search 'SaaS', 'Car Wash', 'Marketing Agency'...",
  },
  operational: {
    title: "Institutional-Grade Operational Businesses.",
    subtitle: "Acquire verified brick-and-mortar businesses with real cash flow, audited fundamentals, and asset-backed value.",
    placeholder: "Search gas stations, car washes, QSRs, logistics...",
  },
  digital: {
    title: "Scalable Digital Businesses, Professionally Vetted.",
    subtitle: "Buy and sell SaaS, e-commerce, and online businesses with AI-normalized financials and verified performance data.",
    placeholder: "Search SaaS, e-commerce, agencies, content sites...",
  },
};

export default function Hero() {
  const [assetMode, setAssetMode] = useState<'all' | 'operational' | 'digital'>('all');
  const [search, setSearch] = useState('');
  const router = useRouter();

  const getAssetType = (mode: 'all' | 'operational' | 'digital') => {
    if (mode === 'all') return 'all';
    if (mode === 'operational') return 'physical';
    if (mode === 'digital') return 'digital';
    return 'all';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    params.set('assetType', getAssetType(assetMode));
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="relative bg-[#0B1221] text-white pt-20 pb-32 overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none opacity-50" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        
        {/* 1. HEADLINE (Dynamic based on mode) */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white drop-shadow-sm">
          {HERO_COPY[assetMode].title}
        </h1>

        {/* 2. SUBTITLE */}
        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          {HERO_COPY[assetMode].subtitle}
        </p>

        {/* 3. PILLS / FILTER TABS (Moved Below Text, Above Search) */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-800/50 p-1.5 rounded-full border border-slate-700/50 backdrop-blur-sm">
            {(['all', 'operational', 'digital'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setAssetMode(mode)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  assetMode === mode
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {mode === 'all' ? 'All Assets' : mode === 'operational' ? 'Operational' : 'Digital'}
              </button>
            ))}
          </div>
        </div>

        {/* 4. SEARCH BAR (Main Action) */}
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSearch} 
            className="bg-white p-2 rounded-2xl shadow-2xl shadow-blue-900/20 flex flex-col md:flex-row items-center gap-2 border border-slate-200"
          >
            {/* Input Field */}
            <div className="flex-1 w-full relative flex items-center px-4 py-3">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={HERO_COPY[assetMode].placeholder}
                className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400 font-medium text-lg"
              />
            </div>

            {/* Location Filter (Static for now) */}
            <div className="hidden md:flex items-center px-4 py-3 border-l border-slate-200 min-w-[160px] text-slate-600 font-medium cursor-pointer hover:text-slate-900 transition-colors">
              <span className="flex-1 text-left">Any Location</span>
              <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
            </div>

            {/* Search Button - UPDATED TO YELLOW */}
            <button 
              type="submit" 
              className="w-full md:w-auto bg-[#EAB308] hover:bg-[#CA8A04] text-slate-900 font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              Search
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>

        {/* 5. TRUST SIGNALS */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-slate-500 font-medium">
          {['Verified Listings', 'AI Due Diligence', 'Secure Deal Rooms', 'Bank-Grade Data'].map((item) => (
             <span key={item} className="flex items-center gap-2">
               <CheckCircle className="w-4 h-4 text-blue-500/80" /> {item}
             </span>
          ))}
        </div>
      </div>
    </div>
  );
}