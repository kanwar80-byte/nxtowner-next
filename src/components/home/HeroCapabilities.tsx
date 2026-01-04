'use client';

import React from 'react';
import { 
  Activity,       // For Real-time Data
  ShieldCheck,    // For Verification
  Zap,            // For Speed/Direct
  Lock            // For Security
} from 'lucide-react';

const CAPABILITIES = [
  {
    icon: Activity,
    label: "Market Intelligence",
    sub: "Live Valuation Data", // Feature, not a claim
    color: "text-blue-500"
  },
  {
    icon: ShieldCheck,
    label: "Vetted Inventory",
    sub: "Strict Financial Audits",
    color: "text-emerald-500"
  },
  {
    icon: Zap,
    label: "Direct Deal Flow",
    sub: "No Middleman Fees",
    color: "text-orange-500"
  },
  {
    icon: Lock,
    label: "Secure Deal Rooms",
    sub: "Encrypted Diligence",
    color: "text-purple-500"
  }
];

export default function HeroCapabilities() {
  return (
    // VISUAL FIX: distinct from "Cards". This is a "Bar".
    <div className="w-full border-b border-white/10 bg-[#080808]"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5 border-x border-white/5">
          
          {CAPABILITIES.map((item, index) => (
            <div 
              key={item.label} 
              className="group flex flex-col items-center justify-center py-6 px-2 hover:bg-white/[0.02] transition-colors cursor-default"
            >
              <div className="flex items-center gap-3 mb-1">
                <item.icon size={18} className={`${item.color} opacity-80`} />
                <span className="text-gray-200 font-semibold text-sm tracking-wide">
                  {item.label}
                </span>
              </div>
              <span className="text-gray-500 text-xs font-mono uppercase tracking-wider">
                {item.sub}
              </span>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
