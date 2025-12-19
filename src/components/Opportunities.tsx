
'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Zap, Globe, MapPin } from 'lucide-react';

// Curated Data Mock
const CURATED_DEALS = [
  {
    id: '101',
    title: 'Digital Agency: Web Development & Maintenance',
    location: 'Remote',
    price: 700000,
    cashflow: 250000,
    revenue: 950000,
    category: 'Agency',
    type: 'Digital',
    verified: true,
    score: 94,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80'
  },
  {
    id: '102',
    title: 'Web + SEO Agency (Long-Term Contracts)',
    location: 'Hamilton, Ontario',
    price: 295000,
    cashflow: 110000,
    revenue: 350000,
    category: 'Agency',
    type: 'Digital',
    verified: true,
    score: 89,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'
  },
  {
    id: '103',
    title: 'Digital Agency: Paid Media + SEO',
    location: 'Remote',
    price: 320000,
    cashflow: 145000,
    revenue: 400000,
    category: 'Agency',
    type: 'Digital',
    verified: true,
    score: 91,
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80'
  }
];

export default function Opportunities() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Curated Opportunities</h2>
            <p className="text-slate-500 mt-2">Hand-picked for financial health and documentation readiness.</p>
          </div>
          <Link href="/browse" className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm">
            View All Listings <ArrowRight size={16} />
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CURATED_DEALS.map((deal) => (
            <Link key={deal.id} href={`/listing/${deal.id}`} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col">
              {/* IMAGE */}
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img 
                  src={deal.image} 
                  alt={deal.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                
                {/* CATEGORY BADGE */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wide">
                    {deal.category} • {deal.location}
                  </span>
                </div>

                {/* VERIFIED BADGE -> NOW EMERALD GREEN ✅ */}
                {deal.verified && (
                  <div className="absolute top-4 right-4 bg-[#10B981] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-white" /> AI-VERIFIED
                  </div>
                )}
              </div>

              {/* DETAILS */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-6 leading-snug group-hover:text-blue-600 transition-colors">
                  {deal.title}
                </h3>
                
                <div className="mt-auto pt-6 border-t border-slate-100 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Asking Price</p>
                    <p className="text-xl font-extrabold text-slate-900">${deal.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Cash Flow (SDE)</p>
                    {/* CASH FLOW -> NOW EMERALD GREEN ✅ */}
                    <p className="text-lg font-bold text-[#10B981]">${deal.cashflow.toLocaleString()}</p>
                  </div>
                </div>

                {/* SCORE INDICATOR (Optional - Added for consistency) */}
                <div className="mt-4 flex items-center gap-2">
                   <span className="bg-[#EAB308]/10 text-[#a16207] text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-[#EAB308]/20">
                     <Zap size={10} className="text-[#EAB308]" fill="#EAB308" /> NxtScore: {deal.score}
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
