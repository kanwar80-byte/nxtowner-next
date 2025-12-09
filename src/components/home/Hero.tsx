'use client';

import Link from 'next/link';
import { useState } from 'react';

type MarketplaceMode = 'all' | 'operational' | 'digital';

interface HeroProps {
  mode: MarketplaceMode;
  setMode: (mode: MarketplaceMode) => void;
}

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

export default function Hero({ mode, setMode }: HeroProps) {
  return (
    <section className="px-4 pt-16 pb-20 sm:pt-20 sm:pb-24 bg-slate-950">
      <div className="mx-auto max-w-6xl text-center">
        {/* 1. H1 Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white text-center max-w-4xl mx-auto">
          Buy & Sell Profitable Operational and Digital Assets.
        </h1>

        {/* 2. Mode Toggle Row */}
        <div className="mt-4 flex justify-center">
          <div className="inline-flex rounded-full bg-slate-900/70 p-1 text-sm">
          {(['all', 'operational', 'digital'] as MarketplaceMode[]).map(option => {
            const isActive = mode === option;
            const label =
              option === 'all'
                ? 'All Assets'
                : option === 'operational'
                ? 'Operational Assets'
                : 'Digital Assets';

            return (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className={`px-4 py-1.5 rounded-full transition whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-200/80 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
          </div>
        </div>

        {/* 3. Subtitle Paragraph */}
        <p className="mt-6 max-w-3xl mx-auto text-center text-lg md:text-xl text-slate-100/80">
          {MODE_CONFIG[mode].subtitle}
        </p>

        {/* 4. CTA Buttons Row */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/browse"
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold bg-orange-500 text-white hover:bg-orange-600 transition"
          >
            Browse Listings
          </Link>
          <Link
            href="/sell"
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold border border-slate-300/70 text-slate-100 hover:bg-slate-100 hover:text-slate-900 transition bg-transparent"
          >
            Sell Your Asset
          </Link>
        </div>

        {/* 5. Search Bar */}
        <div className="mt-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-gray-200 hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-all duration-300">
              <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <span className="text-gray-400 text-lg">🔍</span>
                <input
                  type="text"
                  placeholder={MODE_CONFIG[mode].searchPlaceholder}
                  className="flex-1 text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <span className="hidden sm:inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                  Ctrl + K
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 sm:w-48">
                  <select className="w-full px-4 py-3 text-gray-900 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>All Categories</option>
                    <option>Gas Stations</option>
                    <option>Car Washes</option>
                    <option>Restaurants</option>
                    <option>SaaS</option>
                    <option>E-commerce</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                </div>
                <button className="px-6 sm:px-7 py-3 bg-[#F97316] text-white rounded-2xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] hover:bg-[#ea580c] transition-all duration-300">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {TRUST_CHIPS.map((chip, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-slate-100 backdrop-blur-sm"
              >
                <span className="text-base">✓</span>
                {chip}
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}
