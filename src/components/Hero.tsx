'use client';
import { Search, ShieldCheck, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function Hero() {
  // State to track the active asset type
  const [activeType, setActiveType] = useState<'all' | 'operational' | 'digital'>('all');

  // Dynamic content configuration
  const content = {
    all: {
      label: "All Assets",
      text: "Canada’s premier marketplace. Buy and sell verified assets with bank-grade data and AI valuations."
    },
    operational: {
      label: "Operational Assets",
      text: "Verified brick-and-mortar businesses with real cash flow, assets, and upside."
    },
    digital: {
      label: "Digital Assets",
      text: "Scalable online businesses with verified performance and AI-normalized financials."
    }
  };

  return (
    <section className="relative bg-[#0B1221] pt-28 pb-20 px-4 overflow-hidden min-h-[85vh] flex items-center">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Dynamic Asset Toggle */}
        <div className="inline-flex bg-white/5 p-1 rounded-full backdrop-blur-sm border border-white/10 mb-8 animate-fade-in-up">
          <button 
            onClick={() => setActiveType('all')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeType === 'all' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Assets
          </button>
          <button 
            onClick={() => setActiveType('operational')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeType === 'operational' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Operational
          </button>
          <button 
            onClick={() => setActiveType('digital')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeType === 'digital' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Digital
          </button>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          The Operating System for <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Business Acquisitions.
          </span>
        </h1>

        {/* Dynamic Subtitle */}
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed min-h-[3.5rem] transition-opacity duration-300">
          {content[activeType].text}
        </p>

        {/* Search Module */}
        <div className="bg-white p-2 rounded-2xl shadow-2xl shadow-blue-900/20 max-w-4xl mx-auto flex flex-col md:flex-row gap-2 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex-1 px-6 flex items-center border-b md:border-b-0 md:border-r border-slate-100 py-3 md:py-0">
            <Search className="w-5 h-5 text-slate-400 mr-4" />
            <input 
              type="text" 
              placeholder={
                activeType === 'digital' 
                  ? "Search 'SaaS', 'E-commerce', 'Agency'..." 
                  : activeType === 'operational'
                  ? "Search 'Gas Station', 'Manufacturing', 'Retail'..."
                  : "Search 'SaaS', 'Gas Station', 'Logistics'..."
              }
              className="w-full text-lg outline-none text-slate-900 placeholder:text-slate-400 bg-transparent"
            />
          </div>
          <button className="bg-[#0B1221] hover:bg-[#1a253a] text-white px-10 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
            Search
          </button>
        </div>

        {/* Quick Filters */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-400">
          <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            Under $500k
          </span>
          <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            Verified Cash Flow
          </span>
          {activeType !== 'digital' && (
            <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
              🏢 Franchise Resale
            </span>
          )}
        </div>

      </div>
    </section>
  );
}