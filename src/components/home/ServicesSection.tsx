"use client";

import { useTrack } from "@/contexts/TrackContext";
import { 
  Scale, FileSearch, HardHat, TrendingUp, 
  Code2, ServerCrash, ArrowRight, ShieldCheck 
} from "lucide-react";
import Link from "next/link";

export default function ServicesSection() {
  const { track } = useTrack();
  const isOperational = track === 'operational';

  // DYNAMIC SERVICES DATA
  const services = isOperational ? [
    { title: "Legal & Closing", desc: "Purchase agreements, lease transfers, and franchise reviews.", icon: Scale },
    { title: "Environmental (ESA)", desc: "Phase 1 & 2 site assessments for gas stations & industrial.", icon: HardHat }, // Specific to Operational
    { title: "Financial Diligence", desc: "Quality of Earnings (QoE) and tax return verification.", icon: TrendingUp },
    { title: "Equipment Appraisal", desc: "Certified valuation of physical assets and inventory.", icon: FileSearch },
  ] : [
    { title: "Legal & IP Transfer", desc: "Asset purchase agreements and code IP assignment.", icon: Scale },
    { title: "Tech Due Diligence", desc: "Code quality audits, security scans, and debt assessment.", icon: Code2 }, // Specific to Digital
    { title: "Financial Diligence", desc: "Stripe/SaaS metrics audit and churn analysis.", icon: TrendingUp },
    { title: "Migration Support", desc: "Server transfer, domain escrow, and admin handover.", icon: ServerCrash },
  ];

  return (
    <section className="py-24 bg-[#050505] relative border-t border-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Select Services for Your Deal
          </h2>
          <p className="text-slate-400">
            {isOperational 
              ? "Close confidently with partners who understand leases, franchises, and physical assets."
              : "Close faster with partners who understand code, traffic, and digital transfer."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div key={idx} className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                isOperational 
                  ? "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-black" 
                  : "bg-teal-500/10 text-teal-500 group-hover:bg-teal-500 group-hover:text-black"
              }`}>
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
              <p className="text-sm text-slate-400 mb-4 min-h-[40px]">{service.desc}</p>
              <Link href="/services" className={`text-sm font-bold flex items-center gap-1 ${
                isOperational ? "text-amber-500" : "text-teal-500"
              }`}>
                Book Expert <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
