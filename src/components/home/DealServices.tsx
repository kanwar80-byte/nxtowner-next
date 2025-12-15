import React from 'react';
import { Handshake, Scale, SearchCheck, Briefcase } from 'lucide-react';

const services = [
  { title: 'Brokers', icon: Handshake },
  { title: 'Legal & Contracts', icon: Scale },
  { title: 'Due Diligence', icon: SearchCheck },
  { title: 'Financing', icon: Briefcase },
];

export default function DealServices() {
  return (
    <div className="w-full bg-[#0a192f] py-20 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Select Services for Your Deal</h2>
        {/* GAP D: ECOSYSTEM INTENT */}
        <p className="text-gray-400 mb-12 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          We are building Canada’s verified deal ecosystem. <br className="hidden md:block"/>
          Access vetted brokers, legal, diligence, and financing partners — directly through NxtOwner.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-not-allowed group">
              <s.icon size={36} className="mb-4 text-gray-300" />
              <span className="font-bold text-lg tracking-wide">{s.title}</span>
              <span className="text-[10px] uppercase tracking-wider text-orange-400 mt-2 font-bold opacity-0 group-hover:opacity-100">Coming Soon</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
