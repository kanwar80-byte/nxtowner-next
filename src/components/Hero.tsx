'use client';

import { MapPin, Search, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const HERO_COPY = {
  all: {
    title: 'The Operating System for Business Acquisitions.',
    subtitle:
      'Canada’s premier marketplace. Buy and sell verified assets with bank-grade data and AI valuations.',
    placeholder: "Search 'SaaS', 'Gas Station', 'Logistics'...",
  },
  operational: {
    title: 'Institutional-Grade Operational Businesses.',
    subtitle:
      'Acquire verified brick-and-mortar businesses with real cash flow, audited fundamentals, and asset-backed value.',
    placeholder: 'Search gas stations, car washes, QSRs, logistics...',
  },
  digital: {
    title: 'Scalable Digital Businesses, Professionally Vetted.',
    subtitle:
      'Buy and sell SaaS, e-commerce, and online businesses with AI-normalized financials and verified performance data.',
    placeholder: 'Search SaaS, e-commerce, agencies, content sites...',
  },
} as const;

const TRUST_CHIPS = ['Verified Listings', 'AI Due Diligence', 'Secure Deal Rooms', 'Broker & Legal Support'] as const;

type Tab = 'All' | 'Operational' | 'Digital';
type CopyKey = keyof typeof HERO_COPY;

export default function Hero() {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const copyKey: CopyKey = useMemo(() => {
    if (activeTab === 'Operational') return 'operational';
    if (activeTab === 'Digital') return 'digital';
    return 'all';
  }, [activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    // Keep browse contract: type=Operational|Digital, omit for All
    const typeParam = activeTab !== 'All' ? `&type=${encodeURIComponent(activeTab)}` : '';
    router.push(`/browse?q=${encodeURIComponent(q)}${typeParam}`);
  };

  return (
    <div className="relative bg-[#020617] pt-20 pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl mix-blend-screen animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* ASSET TABS */}
        <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full p-1 mb-8 backdrop-blur-sm">
          {(['All Assets', 'Operational', 'Digital'] as const).map((label) => {
            const tabValue: Tab = label === 'All Assets' ? 'All' : label;
            const isActive = activeTab === tabValue;

            return (
              <button
                key={label}
                type="button"
                onClick={() => setActiveTab(tabValue)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* HEADLINE */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          {HERO_COPY[copyKey].title.includes('Business Acquisitions') ? (
            <>
              The Operating System for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Business Acquisitions.
              </span>
            </>
          ) : (
            <>
              {HERO_COPY[copyKey].title.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {HERO_COPY[copyKey].title.split(' ').slice(-1)}
              </span>
            </>
          )}
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10">{HERO_COPY[copyKey].subtitle}</p>

        {/* --- SEARCH BAR --- */}
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
              placeholder={HERO_COPY[copyKey].placeholder}
            />

            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-[#020617] hover:bg-slate-900 text-white px-6 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 border border-white/10"
            >
              <Sparkles size={16} className="text-blue-400 animate-pulse" />
              Ask NxtOwner
            </button>
          </form>

          {/* TRUST CHIPS */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {TRUST_CHIPS.map((chip) => (
              <span
                key={chip}
                className="px-3 py-1.5 rounded-full text-xs sm:text-sm bg-white/5 border border-white/10 text-slate-300"
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
            <button
              type="button"
              onClick={() => router.push('/browse?maxPrice=500000')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <TrendingUp size={14} /> Under $500k
            </button>

            <button
              type="button"
              onClick={() => router.push('/browse?verified=true')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ShieldCheck size={14} /> Verified Cash Flow
            </button>

            <button
              type="button"
              onClick={() => router.push('/browse?q=franchise')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <MapPin size={14} /> Franchise Resale
            </button>
          </div>
        </div>

        {/* SELL YOUR BUSINESS LINK */}
        <div className="mt-12">
          <Link
            href="/sell/onboarding"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 transition-all"
          >
            Sell Your Business
          </Link>
        </div>
      </div>
    </div>
  );
}
