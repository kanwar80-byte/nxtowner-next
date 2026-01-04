// src/app/pricing/page.tsx
'use client';

import Navbar from '@/components/layout/Navbar';
import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  // FIRST LEVEL: Choose your "World"
  const [assetType, setAssetType] = useState<'operational' | 'digital'>('operational');

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="bg-white border-b border-gray-200 pt-16 pb-12 text-center px-4">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">
          Simple, Transparent Pricing
        </h1>

        {/* THE CRITICAL SPLIT: Operational vs Digital */}
        <div className="inline-flex bg-gray-100 p-1.5 rounded-lg border border-gray-200 mb-8">
          <button
            onClick={() => setAssetType('operational')}
            className={`px-6 py-2.5 text-sm font-bold rounded-md transition-all flex items-center gap-2 ${
              assetType === 'operational' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-slate-900'
            }`}
          >
            🏢 Operational Assets <span className="text-xs font-normal text-gray-400">(Real Estate)</span>
          </button>
          <button
            onClick={() => setAssetType('digital')}
            className={`px-6 py-2.5 text-sm font-bold rounded-md transition-all flex items-center gap-2 ${
              assetType === 'digital' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-slate-900'
            }`}
          >
            💻 Digital Assets <span className="text-xs font-normal text-gray-400">(SaaS/Online)</span>
          </button>
        </div>

        {/* EXPLANATION OF THE MODEL */}
        <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
          {assetType === 'operational' ? (
            <p><strong>Model:</strong> Subscription & Listing Fees. <span className="font-bold">0% Commission on Sale.</span></p>
          ) : (
            <p><strong>Model:</strong> Low Listing Fees. <span className="font-bold">10% Success Fee upon Closing.</span></p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* === SCENARIO 1: OPERATIONAL PRICING (LoopNet Style) === */}
        {assetType === 'operational' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* BUYER CARD */}
            <PricingCard 
              type="Buyer"
              title="Pro Access"
              price="$49"
              period="/mo"
              features={['Unlock NOI & Lease Data', 'Full Address Reveal', 'Unlimited NDAs']}
              cta="Start Trial"
              href="/signup?role=buyer"
            />
             {/* SELLER CARD */}
             <PricingCard 
              type="Seller"
              title="Premium Listing"
              price="$399"
              period="one-time"
              isHighlight
              features={['Listed Until Sold', 'Email Blast to 5k Buyers', '0% Success Fee', 'Direct Buyer Inquiries']}
              cta="List Asset"
              href="/list-business?type=operational"
            />
            {/* BROKER CARD */}
            <PricingCard 
              type="Partner"
              title="Broker Plan"
              price="$199"
              period="/mo"
              features={['Unlimited Listings', 'Agent Profile', 'CRM Lead Routing', 'Top of Search']}
              cta="Join Network"
              href="/partners/join"
            />
          </div>
        )}

        {/* === SCENARIO 2: DIGITAL PRICING (Flippa Style) === */}
        {assetType === 'digital' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* BUYER CARD */}
             <PricingCard 
              type="Buyer"
              title="First Look"
              price="$29"
              period="/mo"
              features={['See Listings 7 Days Early', 'View P&L / Stripe Data', 'AI Code Audit']}
              cta="Start Trial"
              href="/signup?role=buyer"
            />
            {/* SELLER CARD */}
            <PricingCard 
              type="Seller"
              title="Listing Fee"
              price="$29"
              period="to list"
              isHighlight
              features={['Verification Check', 'Escrow Integration', 'Seller Dashboard', '8-10% Success Fee on Close']}
              cta="List Startup"
              href="/list-business?type=digital"
            />
             {/* ENTERPRISE CARD */}
             <PricingCard 
              type="Acquirer"
              title="Private Equity"
              price="$499"
              period="/mo"
              features={['API Access', 'Raw Data Feed', 'Dedicated Account Manager', 'Success Fee Cap']}
              cta="Contact Sales"
              href="/contact"
            />
          </div>
        )}

      </div>
    </main>
  );
}

// HELPER
function PricingCard({ type, title, price, period, features, cta, href, isHighlight }: any) {
  return (
    <div className={`bg-white rounded-xl p-8 border ${isHighlight ? 'border-blue-500 shadow-xl ring-1 ring-blue-100' : 'border-gray-200 shadow-sm'}`}>
      <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{type}</div>
      <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      <div className="mt-4 mb-6">
        <span className="text-4xl font-extrabold text-slate-900">{price}</span>
        <span className="text-slate-500 text-sm ml-1 font-medium">{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-start text-sm text-slate-600">
            <span className="mr-2 text-green-500 font-bold">✓</span> {f}
          </li>
        ))}
      </ul>
      <Link href={href} className={`block w-full text-center py-3 rounded-lg font-bold transition-all ${isHighlight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
        {cta}
      </Link>
    </div>
  );
}
