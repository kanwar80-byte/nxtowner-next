'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, TrendingUp, ShieldCheck, MapPin } from 'lucide-react';

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Operational', 'Digital'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Redirect to browse with query AND asset type
    const typeParam = activeTab !== 'All' ? `&type=${activeTab}` : '';
    router.push(`/browse?q=${encodeURIComponent(query)}${typeParam}`);
  };

  return (
    <div className="relative bg-[#020617] pt-20 pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl mix-blend-screen animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        {/* ASSET TABS */}
        <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full p-1 mb-8 backdrop-blur-sm">
          {['All Assets', 'Operational', 'Digital'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.split(' ')[0])}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.split(' ')[0]
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* HEADLINE */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          The Operating System for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Business Acquisitions.
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10">
          Canada’s premier marketplace. Buy and sell verified assets with bank-grade data and AI valuations.
        </p>

        {/* --- THE "ASK NXTOWNER" SEARCH BAR --- */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-12 pr-40 py-4 bg-white rounded-2xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-2xl transition-all text-lg"
              placeholder="Ask NxtOwner (e.g. 'SaaS under $500k with stable cash flow')..."
            />
            
            {/* THE MAGIC BUTTON */}
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-[#020617] hover:bg-slate-900 text-white px-6 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 border border-white/10"
            >
              <Sparkles size={16} className="text-blue-400 animate-pulse" />
              Ask NxtOwner
            </button>
          </form>

          {/* Quick Tags */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
            <button onClick={() => router.push('/browse?maxPrice=500000')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
              <TrendingUp size={14} /> Under $500k
            </button>
            <button onClick={() => router.push('/browse?verified=true')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
              <ShieldCheck size={14} /> Verified Cash Flow
            </button>
            <button onClick={() => router.push('/browse?q=franchise')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
              <MapPin size={14} /> Franchise Resale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}