"use client";

import { useTrack } from "@/contexts/TrackContext";
import Link from "next/link";
import { ArrowRight, TrendingUp, BookOpen, Scale, FileText } from "lucide-react";

export default function MarketInsights() {
  const { track } = useTrack();
  const isOps = track === 'operational';

  // DYNAMIC CONTENT DATA
  const insights = {
    operational: [
      {
        category: "VALUATION",
        title: "2026 Gas Station Multiples Report: Ontario & BC",
        excerpt: "Why rural stations are trading at higher caps than metro locations this quarter.",
        date: "Jan 12, 2026",
        readTime: "5 min read",
        icon: TrendingUp
      },
      {
        category: "LEGAL",
        title: "Commercial Lease Audits: The Hidden Killer",
        excerpt: "How to spot 'Demolition Clauses' in standard commercial leases before you sign.",
        date: "Jan 08, 2026",
        readTime: "8 min read",
        icon: Scale
      },
      {
        category: "FINANCE",
        title: "VTB vs. BDC: Structuring Your Acquisition",
        excerpt: "Vendor Take-Backs are rising. Here is the standard interest rate spread for 2026.",
        date: "Jan 05, 2026",
        readTime: "6 min read",
        icon: FileText
      }
    ],
    digital: [
      {
        category: "SAAS METRICS",
        title: "The 'Rule of 40' is Dead: New Efficiency Standards",
        excerpt: "Micro-PE firms are now prioritizing Net Dollar Retention over raw growth. Here is the data.",
        date: "Jan 14, 2026",
        readTime: "4 min read",
        icon: TrendingUp
      },
      {
        category: "DUE DILIGENCE",
        title: "Auditing AI Wrappers: Code Ownership Risks",
        excerpt: "If their core IP is just an OpenAI API call, what are you actually buying?",
        date: "Jan 10, 2026",
        readTime: "7 min read",
        icon: BookOpen
      },
      {
        category: "GROWTH",
        title: "SEO for Exit: Cleaning Up Your Backlink Profile",
        excerpt: "How toxic links can devalue your content site by 15% during due diligence.",
        date: "Jan 03, 2026",
        readTime: "5 min read",
        icon: FileText
      }
    ]
  };

  const currentInsights = isOps ? insights.operational : insights.digital;

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border mb-4 ${isOps ? 'bg-amber-900/20 text-amber-500 border-amber-500/20' : 'bg-teal-900/20 text-teal-500 border-teal-500/20'}`}>
              NXTOWNER INTELLIGENCE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Market Insights & Data
            </h2>
            <p className="text-slate-400 max-w-xl">
              Stay ahead of the market with our weekly briefings on {isOps ? 'commercial real estate' : 'digital asset'} valuations, legal structures, and deal flow.
            </p>
          </div>
          
          <Link href="/resources" className="group flex items-center text-white font-bold hover:text-blue-400 transition-colors">
            View All Reports <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentInsights.map((item, idx) => (
            <Link key={idx} href="#" className="group">
              <div className="h-full bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all hover:shadow-xl flex flex-col">
                
                {/* ICON & CATEGORY */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-lg ${isOps ? 'bg-amber-500/10 text-amber-500' : 'bg-teal-500/10 text-teal-500'}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 tracking-wider">{item.category}</span>
                </div>

                {/* CONTENT */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-tight">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                  {item.excerpt}
                </p>

                {/* FOOTER */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-900 text-xs text-slate-500">
                  <span>{item.date}</span>
                  <span className="flex items-center">
                    {item.readTime}
                  </span>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
