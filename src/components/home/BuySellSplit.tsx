import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function BuySellSplit() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Buyer Card */}
      <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm hover:shadow-md transition-all group">
        <div className="mb-4">
            <span className="text-blue-900 font-bold tracking-wide uppercase text-xs">For Buyers</span>
            {/* GAP C: OUTCOME HEADLINE */}
            <h3 className="text-2xl font-bold text-[#0a192f] mt-1">Buy with confidence, not guesswork.</h3>
            <p className="text-gray-500 text-sm mt-2">Find verified Deal Rooms, review vetted financials, and secure acquisitions.</p>
        </div>
        
        <ul className="space-y-3 mb-8">
          {['Verified Seller Data', 'NDA-Protected Deal Rooms', 'AI-Assisted Screening', 'Broker & Legal Support'].map(item => (
            <li key={item} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
              <CheckCircle2 className="w-5 h-5 text-green-500" /> {item}
            </li>
          ))}
        </ul>
        <Link href="/browse" className="inline-flex items-center gap-2 bg-[#0a192f] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#142642] transition-colors w-full md:w-auto justify-center">
          Browse Listings <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Seller Card */}
      <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 shadow-sm hover:shadow-md transition-all group">
        <div className="mb-4">
            <span className="text-orange-800 font-bold tracking-wide uppercase text-xs">For Sellers</span>
            {/* GAP C: OUTCOME HEADLINE */}
            <h3 className="text-2xl font-bold text-[#0a192f] mt-1">Sell once. Sell right.</h3>
            <p className="text-gray-600 text-sm mt-2">List confidently with verification, buyer screening, and premium exposure.</p>
        </div>

        <ul className="space-y-3 mb-8">
          {['Verified Badge Options', 'Controlled NDA Access', 'Qualified Buyer Leads', 'Featured Boosts'].map(item => (
            <li key={item} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
              <CheckCircle2 className="w-5 h-5 text-green-500" /> {item}
            </li>
          ))}
        </ul>
        <Link href="/sell" className="inline-flex items-center gap-2 bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors w-full md:w-auto justify-center">
          Sell Your Business <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}