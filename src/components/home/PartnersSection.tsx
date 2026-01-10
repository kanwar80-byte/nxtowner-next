"use client";

import { Building2, Landmark, Briefcase, Calculator } from "lucide-react";

interface PartnersSectionProps {
  viewMode?: 'real_world' | 'digital';
}

export default function PartnersSection({ viewMode = 'real_world' }: PartnersSectionProps) {
  const isDigital = viewMode === 'digital';

  const partners = [
    { 
      name: isDigital ? "Stripe" : "Pumo & Sharp", 
      role: isDigital ? "Payment Data" : "CPA Firm", 
      icon: Calculator 
    },
    { 
      name: isDigital ? "Flippa Legal" : "Smith & Pearson", 
      role: "Legal M&A", 
      icon: Briefcase 
    },
    { 
      name: isDigital ? "Pipe" : "LendAmerica", 
      role: isDigital ? "Recurring Revenue Financing" : "SBA Lending", 
      icon: Landmark 
    },
    { 
      name: isDigital ? "MicroAcquire" : "RealtyAdvisors", 
      role: isDigital ? "Marketplace Partner" : "Commercial RE", 
      icon: Building2 
    },
  ];

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-white mb-2">Verified Partners</h3>
        <p className="text-slate-400">Work with the best in the industry to close your deal.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {partners.map((p, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#0A0A0A] border border-slate-800 hover:border-slate-600 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
              <p.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{p.name}</div>
              <div className="text-xs text-slate-500">{p.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
