"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";

// MOCK DATABASE OF ARTICLES (Matches the Home Page Data)
const ARTICLES: Record<string, any> = {
  "gas-station-multiples-2026": {
    title: "2026 Gas Station Multiples Report: Ontario & BC",
    date: "Jan 12, 2026",
    readTime: "5 min read",
    category: "Valuation",
    content: "Rural gas stations are currently trading at significantly higher cap rates than metro locations due to inventory scarcity...",
  },
  "commercial-lease-demolition-clauses": {
    title: "Commercial Lease Audits: The Hidden Killer",
    date: "Jan 08, 2026",
    readTime: "8 min read",
    category: "Legal",
    content: "Demolition clauses allow landlords to terminate your lease if they decide to redevelop. Here is how to spot them...",
  },
  "vtb-vs-bdc-financing-guide": {
    title: "VTB vs. BDC: Structuring Your Acquisition",
    date: "Jan 05, 2026",
    readTime: "6 min read",
    category: "Finance",
    content: "Vendor Take-Back (VTB) financing is becoming the standard gap filler as traditional lending tightens...",
  },
  "saas-valuation-benchmarks-2026": {
    title: "SaaS Valuation Benchmarks: Q1 2026",
    date: "Jan 10, 2026",
    readTime: "4 min read",
    category: "Valuation",
    content: "Micro-SaaS valuations are stabilizing at 3.5x SDE, while AI-wrapped tools are seeing premiums up to 8x...",
  },
  "technical-diligence-code-audit": {
    title: "The Code Audit: Red Flags in Legacy PHP",
    date: "Jan 07, 2026",
    readTime: "7 min read",
    category: "Due Diligence",
    content: "Legacy codebases can be a goldmine or a money pit. Here are the 5 red flags we look for in PHP applications...",
  },
  "seo-migration-checklist": {
    title: "SEO Migration Checklist for Acquirers",
    date: "Jan 04, 2026",
    readTime: "5 min read",
    category: "Growth",
    content: "Migrating a domain is the most dangerous moment for an acquired asset. Follow this 10-step checklist...",
  }
};

export default function ArticlePage() {
  const params = useParams();
  // Ensure slug is a string (handle array case just in case)
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  
  const article = ARTICLES[slug as string];

  if (!article) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-slate-400 mb-6">Article not found.</p>
          <Link href="/" className="text-teal-500 hover:underline">Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Intelligence
        </Link>

        {/* Header */}
        <div className="mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-teal-500 uppercase tracking-wider mb-4">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-slate-400 border-b border-slate-900 pb-8">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {article.date}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {article.readTime}</span>
            <button className="ml-auto hover:text-white transition-colors"><Share2 className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Content Body */}
        <article className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-slate-300 leading-relaxed mb-8">
            {article.content}
          </p>
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl my-8">
            <p className="text-sm text-slate-400 italic">
              "This is a preview of the full market report. NxtOwner members get access to the full dataset including comparable sales and off-market listings."
            </p>
          </div>
          <p className="text-slate-400">
            [Rest of the in-depth analysis would appear here...]
          </p>
        </article>

      </div>
    </main>
  );
}


