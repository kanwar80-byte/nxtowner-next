'use client';



const HERO_COPY = {
  all: {
    title: "The Operating System for Business Acquisitions.",
    subtitle:
      "Canada’s premier marketplace. Buy and sell verified assets with bank-grade data and AI valuations.",
    placeholder: "Search 'SaaS', 'Gas Station', 'Logistics'...",
  },
  operational: {
    title: "Institutional-Grade Operational Businesses.",
    subtitle:
      "Acquire verified brick-and-mortar businesses with real cash flow, audited fundamentals, and asset-backed value.",
    placeholder: "Search gas stations, car washes, QSRs, logistics...",
  },
  digital: {
    title: "Scalable Digital Businesses, Professionally Vetted.",
    subtitle:
      "Buy and sell SaaS, e-commerce, and online businesses with AI-normalized financials and verified performance data.",
    placeholder: "Search SaaS, e-commerce, agencies, content sites...",
  },
};

const TRUST_CHIPS = [
  "Verified Listings",
  "AI Due Diligence",
  "Secure Deal Rooms",
  "Broker & Legal Support",
];

import { ArrowRight, CheckCircle, ChevronDown, Search } from 'lucide-react';
import React, { useState } from 'react';

export default function Hero() {
  const [assetMode, setAssetMode] = useState<'all' | 'operational' | 'digital'>('all');
  const [search, setSearch] = useState('');
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (router) {
      router.push(`/browse?type=${assetMode}${search ? `&q=${encodeURIComponent(search)}` : ''}`);
    }
  };

  return (
    <div className="relative bg-[#0a192f] text-white pt-24 pb-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* H1 Headline */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {HERO_COPY[assetMode].title}
        </h1>

        {/* Subtext */}
        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-10">
          {HERO_COPY[assetMode].subtitle}
        </p>

        {/* Search Interface Container */}
        <div className="max-w-4xl mx-auto relative">
          {/* GAP A: MODE SELECTION CHIPS (Now Prominent) */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex bg-white/10 rounded-full p-1 backdrop-blur-md border border-white/10 shadow-lg">
              <button
                type="button"
                onClick={() => setAssetMode('all')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${assetMode === 'all' ? 'bg-orange-500 text-white shadow-md transform scale-105' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
              >
                All Assets
              </button>
              <button
                type="button"
                onClick={() => setAssetMode('operational')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${assetMode === 'operational' ? 'bg-orange-500 text-white shadow-md transform scale-105' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
              >
                Operational Assets
              </button>
              <button
                type="button"
                onClick={() => setAssetMode('digital')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${assetMode === 'digital' ? 'bg-orange-500 text-white shadow-md transform scale-105' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
              >
                Digital Assets
              </button>
            </div>
          </div>

          {/* Search Inputs */}
          <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 w-full relative flex items-center px-4 py-3 border-b md:border-b-0 border-gray-100">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={HERO_COPY[assetMode].placeholder}
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 font-medium"
              />
            </div>
            <div className="w-full md:w-auto relative flex items-center px-4 py-3 border-b md:border-b-0 md:border-l border-gray-100 min-w-[180px]">
              <span className="text-gray-800 flex-1 truncate font-medium">All Locations</span>
              <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
            </div>
            <button type="submit" className="w-full md:w-auto bg-[#0a192f] hover:bg-[#142642] text-white font-bold py-3 px-8 rounded-xl md:rounded-full transition-colors shadow-lg flex items-center justify-center gap-2">
              Search <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* GAP F: SOCIAL PROOF / TRUST CHIPS */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-400 font-medium opacity-90">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" /> Verified Listings
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" /> AI Due Diligence
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" /> Secure Deal Rooms
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" /> Broker & Legal Support
          </span>
        </div>
      </div>
    </div>
  );
}
