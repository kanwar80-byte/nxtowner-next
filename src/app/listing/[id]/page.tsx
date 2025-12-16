
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { MapPin, ShieldCheck, ArrowLeft, Lock, FileText, Globe, DollarSign, Zap } from 'lucide-react';
import { getBuyerAccessTier } from '@/app/actions/userAccess';
import { TieredContent } from '@/components/common/TieredContent';
import Image from 'next/image';

// Note: Assuming your 'PublicListing' type includes fields like cashflow_numeric, revenue, sde, etc.

// Next.js 16: params is a Promise
export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Await params before using them
  const { id } = await params;
  
  const supabase = createClient();
  
  // 2. Fetch the listing
  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !listing) {
    return notFound();
  }

  // 3. Format Currency Helper
  const formatMoney = (amount: number | null) => 
    amount ? `$${amount.toLocaleString()}` : 'Contact for Price';

  // 4. Get user access tier (server action)
  const userTier = await getBuyerAccessTier();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header / Breadcrumb */}
      <div className="bg-[#0a192f] text-white pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/browse" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Marketplace
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {listing.category || 'Business'}
                </span>
                {listing.is_verified && (
                  <span className="bg-green-500/20 border border-green-500/50 text-green-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{listing.title}</h1>
              <div className="flex items-center text-gray-300 gap-6 text-sm">
                <span className="flex items-center gap-2"><MapPin size={16} className="text-orange-500"/> {listing.location || 'Undisclosed'}</span>
                <span className="flex items-center gap-2"><Globe size={16} className="text-blue-400"/> {listing.asset_type === 'digital' ? 'Online Business' : 'Physical Location'}</span>
              </div>
            </div>
            
            <div className="text-right hidden md:block">
              <p className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-1">Asking Price</p>
              <p className="text-4xl font-bold text-white">{formatMoney(listing.price)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Image */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl h-[400px] md:h-[500px] relative">
             <Image 
                src={listing.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80'} 
                alt={listing.title}
                fill
                className="w-full h-full object-cover"
                priority
             />
          </div>

          {/* Description (FREE ACCESS) */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#0a192f] mb-6">Investment Highlights (Explorer View)</h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p>{listing.description || listing.short_description || "A detailed description is available upon signing the NDA."}</p>
              <ul className="mt-4 space-y-2 list-disc pl-5">
                <li>Primary category: {listing.category}</li>
                <li>Location: {listing.location}</li>
                <li>Asset Type: {listing.asset_type}</li>
              </ul>
            </div>
          </div>
          
          {/* ---------------------------------------------------- */}
          {/* 1. FINANCIAL DEEP-DIVE (Requires PRO Access) */}
          {/* ---------------------------------------------------- */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#0a192f] mb-6">Financial Summary & Metrics</h2>
            
            <TieredContent userTier={userTier} requiredTier="PRO">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-b border-gray-100 pb-6 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 uppercase font-medium">Annual Revenue</p>
                    <p className="text-3xl font-extrabold text-blue-600">{formatMoney(listing.revenue)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 uppercase font-medium">Seller's Discretionary Earnings (SDE)</p>
                    <p className="text-3xl font-extrabold text-green-600">{formatMoney(listing.cashflow_numeric)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 uppercase font-medium">Asking Price</p>
                    <p className="text-3xl font-extrabold text-orange-600">{formatMoney(listing.price)}</p>
                </div>
              </div>

              {/* Detailed Financials */}
              <h3 className="text-xl font-bold mb-4">Key Operating Metrics</h3>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-dashed pb-2">
                    <span className="font-medium text-gray-700">Annual Rent Expense</span>
                    <span className="font-bold">{formatMoney(listing.annual_rent_expense || 0)}</span>
                </li>
                 <li className="flex justify-between border-b border-dashed pb-2">
                    <span className="font-medium text-gray-700">Staff Count</span>
                    <span className="font-bold">{listing.staff_count || 'Varies'}</span>
                </li>
                {listing.annual_salary_expense && (
                    <li className="flex justify-between border-b border-dashed pb-2">
                        <span className="font-medium text-gray-700">Annual Salary Expense</span>
                        <span className="font-bold">{formatMoney(listing.annual_salary_expense)}</span>
                    </li>
                )}
                <li className="flex justify-between pt-2">
                    <span className="text-lg font-bold text-[#0a192f]">Normalized Cash Flow (Lender Ready)</span>
                    <span className="text-lg font-bold text-green-700">{formatMoney(listing.normalized_cashflow || listing.cashflow_numeric)}</span>
                </li>
              </ul>
            </TieredContent>
          </div>
          
          {/* ---------------------------------------------------- */}
          {/* 2. AI VALUATION & BENCHMARKING (Requires ELITE Access) */}
          {/* ---------------------------------------------------- */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
             <h2 className="text-2xl font-bold text-[#0a192f] mb-6">AI Valuation & Market Analysis</h2>
             <TieredContent userTier={userTier} requiredTier="ELITE" upgradeTitle="Elite Investor Access Required">
                <div className="flex justify-between items-center p-4 mb-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-lg font-bold text-yellow-800 flex items-center gap-2">
                        <Zap size={20}/> AI Estimated Valuation Range:
                    </p>
                    <p className="text-2xl font-extrabold text-yellow-800">
                         {formatMoney(listing.ai_min_valuation || 0)} - {formatMoney(listing.ai_max_valuation || 0)}
                    </p>
                </div>

                <h3 className="text-xl font-bold mb-4">Market Benchmarking</h3>
                <p className="text-gray-600 mb-4">
                    This listing's asking price multiple (Cash Flow / Price) is currently **3.2x**.
                    The industry average for {listing.category} assets in this region is **2.8x - 3.5x**. 
                </p>
                <button className="text-blue-600 font-medium text-sm hover:underline">Download Full Risk & Margin Report</button>
             </TieredContent>
          </div>
        </div>

        {/* RIGHT COLUMN: The "Deal Room" CTA */}
        <div className="lg:col-span-1">
          {/* Mobile Price (Visible only on small screens) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4 md:hidden">
            <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-1">Asking Price</p>
            <p className="text-3xl font-bold text-[#0a192f]">{formatMoney(listing.price)}</p>
          </div>

          {/* The "Buy Box" with TieredContent protection */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-24">
            <TieredContent userTier={userTier} requiredTier="PRO" upgradeTitle="Pro or Elite Access Required">
              <h3 className="text-xl font-bold text-[#0a192f] mb-2">Unlock Deal Room</h3>
              <p className="text-gray-500 text-sm mb-6">
                Access full financials, tax returns, and legal documents.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-900 font-medium">
                  <FileText size={18} /> P&L Statements (3 Years)
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-900 font-medium">
                  <FileText size={18} /> Staff & Payroll Data
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-900 font-medium">
                  <FileText size={18} /> Lease / Property Details
                </div>
              </div>
              <button className="w-full bg-[#0a192f] hover:bg-[#142642] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl mb-4">
                <Lock size={18} /> Sign NDA & View
              </button>
              <p className="text-center text-xs text-gray-400">
                Protected by NxtOwner Secure Vault™
              </p>
            </TieredContent>
          </div>

          {/* Broker Card */}
          <div className="mt-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">👤</div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Listed By</p>
              <p className="font-bold text-[#0a192f]">NxtOwner Brokerage</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
