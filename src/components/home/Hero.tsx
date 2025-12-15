'use client';

import Link from 'next/link';

type MarketplaceMode = 'all' | 'operational' | 'digital';

const MODE_CONFIG: Record<MarketplaceMode, {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
}> = {
  all: {
    title: 'Buy & Sell Profitable Operational and Digital Assets.',
    subtitle:
      "Canada's #1 hybrid marketplace for Gas Stations, Car Washes, QSRs, Warehouses, SaaS, E-commerce, Agencies, and more. Verified financials, NDA-protected deal rooms, AI-powered valuations, and secure offer flows — all in one platform.",
    searchPlaceholder: "Search gas stations, SaaS, car washes, Shopify stores…",
  },
  operational: {
    title: 'Buy & Sell Profitable Operational and Digital Assets.',
    subtitle:
      "Discover cash-flowing gas stations, car washes, QSRs, warehouses, and franchise businesses. Verified volumes, NOI breakdowns, and site-level due diligence for serious buyers.",
    searchPlaceholder: "Search gas stations, car washes, QSRs, warehouses…",
  },
  digital: {
    title: 'Buy & Sell Profitable Operational and Digital Assets.',
    subtitle:
      "Browse vetted SaaS, e-commerce stores, content & media sites, agencies, and marketplaces. Clean P&Ls, traffic analytics, and growth metrics—structured for fast, confident acquisitions.",
    searchPlaceholder: "Search SaaS, e-commerce, content sites, agencies…",
  },
};

const TRUST_CHIPS = [
  "Verified Listings",
  "AI Due Diligence",
  "Secure Deal Rooms",
  "Broker & Legal Support",
];

import React, { useState } from 'react';
import { Search, ChevronDown, CheckCircle, ArrowRight } from 'lucide-react';

export default function Hero() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="relative bg-[#0a192f] text-white pt-24 pb-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* H1 Headline */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Buy & Sell Profitable <br />
          <span className="text-white">Operational and Digital Assets.</span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-10">
          Canada’s #1 hybrid marketplace for Gas Stations, Car Washes, QSRs, SaaS, and E-commerce. 
          Verified financials, NDA-protected deal rooms, and AI-powered valuations.
        </p>

        {/* Search Interface Container */}
        <div className="max-w-4xl mx-auto relative">
          {/* GAP A: MODE SELECTION CHIPS (Now Prominent) */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex bg-white/10 rounded-full p-1 backdrop-blur-md border border-white/10 shadow-lg">
              {['All Assets', 'Operational', 'Digital'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    activeTab === tab.toLowerCase().split(' ')[0]
                      ? 'bg-orange-500 text-white shadow-md transform scale-105'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search Inputs */}
          <div className="bg-white p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 w-full relative flex items-center px-4 py-3 border-b md:border-b-0 border-gray-100">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input 
                type="text" 
                placeholder="Search gas stations, SaaS, car washes..." 
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 font-medium"
              />
            </div>
            <div className="w-full md:w-auto relative flex items-center px-4 py-3 border-b md:border-b-0 md:border-l border-gray-100 min-w-[180px]">
              <span className="text-gray-800 flex-1 truncate font-medium">All Locations</span>
              <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
            </div>
            <button className="w-full md:w-auto bg-[#0a192f] hover:bg-[#142642] text-white font-bold py-3 px-8 rounded-xl md:rounded-full transition-colors shadow-lg flex items-center justify-center gap-2">
              Search <ArrowRight size={16} />
            </button>
          </div>
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
