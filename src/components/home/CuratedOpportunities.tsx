import React from 'react';
import Link from 'next/link';
import { MapPin, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';

const DEMO_CURATED = [
  { id: 1, title: 'Fuel Site (Modern Store + Strong Throughput)', location: 'Brampton, ON', price: '$4,200,000', cashflow: '$480k EBITDA', category: 'Gas Station', isVerified: true },
  { id: 2, title: 'Vertical SaaS (Niche Dominant, High Retention)', location: 'Ottawa, ON', price: '$850,000', cashflow: '$190k ARR', category: 'SaaS', isVerified: true },
  { id: 3, title: 'Touchless Automatic Car Wash (Membership Ready)', location: 'Cambridge, ON', price: '$1,250,000', cashflow: '$210k Net', category: 'Car Wash', isVerified: false },
  { id: 4, title: 'Industrial Unit (Tenanted Cold/Dry)', location: 'Milton, ON', price: '$2,800,000', cashflow: '5.5% Cap', category: 'Industrial', isVerified: true },
];

export default function CuratedOpportunities() {
  return (
    <div className="w-full">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Featured Collection</span>
          </div>
          <h2 className="text-3xl font-bold text-[#0a192f]">Curated Opportunities</h2>
          {/* GAP E: TRUST EXPLANATION */}
          <p className="text-gray-500 mt-3 max-w-2xl text-sm leading-relaxed">
            Hand-picked for <span className="text-gray-800 font-semibold">financial health</span>, documentation readiness, and verified seller status.
          </p>
        </div>
        <Link href="/browse" className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-900 border-b border-gray-300 hover:border-gray-900 pb-1 transition-all">
          View all featured <ArrowRight size={14}/>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DEMO_CURATED.map((listing) => (
          <Link href={`/listing/${listing.id}`} key={listing.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            <div className="h-48 bg-gray-100 relative flex items-center justify-center text-gray-400">
               <span className="text-sm font-medium">{listing.category} Photo</span>
               {listing.isVerified && (
                 <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full shadow-md z-10" title="Verified Listing">
                    <ShieldCheck size={14} />
                 </div>
               )}
               {/* Visual overlay for demo */}
               <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 opacity-50" />
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight group-hover:text-blue-900 line-clamp-2">
                {listing.title}
              </h3>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <MapPin size={14} className="mr-1" /> {listing.location}
              </div>
              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Price</p>
                    <p className="text-lg font-bold text-[#0a192f]">{listing.price}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Performance</p>
                    <div className="flex items-center justify-end text-sm font-medium text-green-700">
                        <TrendingUp size={14} className="mr-1" /> {listing.cashflow}
                    </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
