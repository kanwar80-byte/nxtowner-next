import React from 'react';
import StripeButton from '@/components/ui/StripeButton';
import { Check, ShieldCheck, Zap } from 'lucide-react';

// SAFETY: This is a Server Component (no 'use client' at the top).
// We do NOT import { stripe } from '@/lib/stripe' here.
// We only use the Price ID from env variables.

export default function PricingPage() {
  const verifiedPriceId = process.env.NEXT_PUBLIC_PRICE_ID_VERIFIED;

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#0a192f] mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Choose the plan that fits your deal flow. Whether you are buying one business or selling ten.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* FREE PLAN */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-[#0a192f]">Basic Buyer</h3>
            <div className="my-4">
              <span className="text-4xl font-bold">$0</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">For casual browsing and market research.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> Browse Public Listings
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> Basic Search Filters
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> Save Watchlist
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Get Started
            </button>
          </div>

          {/* VERIFIED SELLER (The One We Wired) */}
          <div className="bg-[#0a192f] rounded-2xl p-8 border border-[#0a192f] shadow-xl flex flex-col relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="text-green-400" size={20}/> Verified Seller
            </h3>
            <div className="my-4">
              <span className="text-4xl font-bold text-white">$100</span>
              <span className="text-gray-400">/listing</span>
            </div>
            <p className="text-gray-300 text-sm mb-6">Maximum trust & visibility for your sale.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <Check className="w-5 h-5 text-green-400" /> Verified Badge (Trust Signal)
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <Check className="w-5 h-5 text-green-400" /> Top of Search Results
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <Check className="w-5 h-5 text-green-400" /> Access Verified Buyers
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <Check className="w-5 h-5 text-green-400" /> NDA Management Tools
              </li>
            </ul>
            
            {/* THIS IS THE SAFE WAY TO USE STRIPE */}
            {verifiedPriceId ? (
               <StripeButton priceId={verifiedPriceId} label="Get Verified" />
            ) : (
               <div className="text-red-400 text-xs">Error: Price ID missing</div>
            )}
          </div>

          {/* PARTNER PRO */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-[#0a192f]">Partner Pro</h3>
            <div className="my-4">
              <span className="text-4xl font-bold">$250</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">For Brokers, Lawyers, and Lenders.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> Directory Listing
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <Check className="w-5 h-5 text-green-500" /> Direct Lead Generation
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <Zap className="w-5 h-5 text-orange-500" /> Deal Flow Access
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
