"use client";

import { ArrowRight, TrendingUp, Scale, FileText, Lock, Globe } from "lucide-react";
import Link from "next/link";

interface MarketInsightsProps {
  viewMode?: 'real_world' | 'digital';
}

// 1. DATA STRUCTURE (The Brain)
const INSIGHTS_DATA = [
  // --- OPERATIONAL (Real World) ARTICLES ---
  {
    id: "op-1",
    type: "operational",
    category: "Valuation",
    title: "2026 Gas Station Valuation Report",
    excerpt: "Why rural stations are trading at higher caps than metro locations this quarter.",
    date: "Jan 12, 2026",
    readTime: "5 min read",
    slug: "gas-station-valuation-report-2026",
    icon: TrendingUp
  },
  {
    id: "op-2",
    type: "operational",
    category: "Legal",
    title: "Commercial Lease Guide",
    excerpt: "How to spot 'Demolition Clauses' in standard commercial leases before you sign.",
    date: "Jan 08, 2026",
    readTime: "8 min read",
    slug: "commercial-lease-guide",
    icon: Scale
  },
  {
    id: "op-3",
    type: "operational",
    category: "Finance",
    title: "VTB vs. BDC: Structuring Your Acquisition",
    excerpt: "Vendor Take-Backs are rising. Here is the standard interest rate spread for 2026.",
    date: "Jan 05, 2026",
    readTime: "6 min read",
    slug: "vtb-vs-bdc-financing-guide",
    icon: FileText
  },

  // --- DIGITAL (Online) ARTICLES ---
  {
    id: "dig-1",
    type: "digital",
    category: "Valuation",
    title: "SaaS Valuation Benchmarks: Q1 2026",
    excerpt: "Why sub-$1M ARR startups are seeing a multiple compression while AI tools surge.",
    date: "Jan 10, 2026",
    readTime: "4 min read",
    slug: "saas-valuation-benchmarks-2026",
    icon: TrendingUp
  },
  {
    id: "dig-2",
    type: "digital",
    category: "Due Diligence",
    title: "The Code Audit Guide",
    excerpt: "What technical debt looks like in 10-year-old content sites and how to price it in.",
    date: "Jan 07, 2026",
    readTime: "7 min read",
    slug: "code-audit-guide",
    icon: Lock
  },
  {
    id: "dig-3",
    type: "digital",
    category: "Growth",
    title: "SEO Migration Checklist for Acquirers",
    excerpt: "Don't lose traffic on transfer. The definitive guide to switching hosting without 404s.",
    date: "Jan 04, 2026",
    readTime: "5 min read",
    slug: "seo-migration-checklist",
    icon: Globe
  }
];

export default function MarketInsights({ viewMode = 'real_world' }: MarketInsightsProps) {
  const isOperational = viewMode === 'real_world';

  // 2. FILTER LOGIC
  // Only show articles that match the current viewMode
  const currentInsights = INSIGHTS_DATA.filter(
    (item) => item.type === (isOperational ? 'operational' : 'digital')
  );

  return (
    <section className="py-24 bg-[#050505] border-t border-slate-900">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border mb-4 ${
              isOperational ? 'bg-amber-950/30 text-amber-500 border-amber-500/20' : 'bg-teal-950/30 text-teal-400 border-teal-400/20'
            }`}>
              NXTOWNER INTELLIGENCE
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Market Insights & Data
            </h2>
            <p className="text-slate-400 max-w-xl">
              {isOperational 
                ? "Stay ahead with weekly briefings on commercial valuations, lease structures, and lending rates."
                : "Stay ahead with weekly briefings on SaaS multiples, churn benchmarks, and tech trends."}
            </p>
          </div>
          <Link 
            href="/resources" 
            className="text-white font-semibold hover:text-slate-300 transition-colors flex items-center gap-2 group"
          >
            View All Reports <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentInsights.map((insight) => (
            <Link 
              key={insight.id} 
              href={`/resources/${insight.slug}`} // <--- 3. FIX: DYNAMIC LINKING
              className="group flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${
                  isOperational ? 'bg-amber-500/10 text-amber-500' : 'bg-teal-400/10 text-teal-400'
                }`}>
                  <insight.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {insight.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-tight">
                {insight.title}
              </h3>
              
              <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-grow">
                {insight.excerpt}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-800/50">
                <span>{insight.date}</span>
                <span>{insight.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* NEWSLETTER CTA - FIXED */}
        <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              Get the Executive Market Briefing
            </h3>
            <p className="text-slate-400 text-sm max-w-md">
              Exclusive deal flow, off-market alerts, and valuation trends for 
              {isOperational ? " Ontario's commercial sector." : " digital asset markets."}
            </p>
          </div>

          {/* THE MISSING FORM INPUTS */}
          <div className="flex-1 w-full max-w-md flex gap-2">
            <input 
              type="email" 
              placeholder="investor@example.com" 
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button className={`px-6 py-3 rounded-lg font-bold text-sm text-black whitespace-nowrap transition-transform hover:scale-105 ${
              isOperational ? "bg-amber-500 hover:bg-amber-400" : "bg-teal-400 hover:bg-teal-500"
            }`}>
              Get Data &rarr;
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
