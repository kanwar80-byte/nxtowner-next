"use client";

import { Search, FileSearch, Activity, Handshake, Shield, Database } from "lucide-react";

interface ProcessRoadmapProps {
  viewMode?: 'real_world' | 'digital';
}

export default function ProcessRoadmap({ viewMode = 'real_world' }: ProcessRoadmapProps) {
  const isOps = viewMode === 'real_world';

  // Value Props: Different steps for Real World vs Digital
  const steps = isOps ? [
    {
      title: "Smart Discovery",
      desc: "Filter by EBITDA, Location, and Asset Type.",
      icon: Search,
    },
    {
      title: "NDA DealRoom",
      desc: "Unlock real financials. Our AI audits P&L, Tax Returns, and lease agreements instantly.",
      icon: FileSearch,
    },
    {
      title: "Live Deal Tracker",
      desc: "Don't get lost in emails. Track LOIs, Due Diligence, and Counter-Offers in one dashboard.",
      icon: Activity,
      highlight: true
    },
    {
      title: "Exit Planning",
      desc: "We connect you with vetted Lawyers & Lenders for smooth transitions.",
      icon: Handshake,
    }
  ] : [
    {
      title: "Smart Discovery",
      desc: "Filter by MRR, Tech Stack, Churn Rate, and Revenue Model.",
      icon: Search,
    },
    {
      title: "Tech Vetting",
      desc: "Unlock real metrics. Our AI audits Stripe data, code quality, and traffic sources instantly.",
      icon: Shield,
    },
    {
      title: "Live SaaS Data",
      desc: "Real-time MRR, churn, and customer metrics. Track deals with verified Stripe/Baremetrics integration.",
      icon: Database,
      highlight: true
    },
    {
      title: "Migration Support",
      desc: "Escrow integration, code transfer, and domain handover with expert technical support.",
      icon: Handshake,
    }
  ];

  return (
    <section className="py-20 bg-slate-950 relative border-t border-slate-900">
      <div className="container mx-auto px-4">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            The Operating System for {isOps ? "Real World" : "Digital"} Deals.
          </h2>
          <p className="text-slate-400">
            We don&apos;t just list businesses. We guide you through the chaos of 
            {isOps ? " offline negotiations " : " due diligence "} 
            with our proprietary deal tracker.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Connector Line (Hidden on Mobile) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-800 -z-10" />

          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              
              {/* Icon Circle */}
              <div className={`
                w-24 h-24 rounded-full flex items-center justify-center mb-6 border-4 transition-all duration-300 bg-slate-950 z-10
                ${step.highlight 
                  ? (isOps ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.3)]')
                  : 'border-slate-800 group-hover:border-slate-600'}
              `}>
                <step.icon className={`w-10 h-10 ${isOps ? 'text-amber-500' : 'text-teal-400'}`} />
              </div>

              {/* Text */}
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 px-2 leading-relaxed">
                {step.desc}
              </p>

              {/* Step Number Badge */}
              <div className="absolute top-0 right-10 md:right-16 bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
                0{i + 1}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}




