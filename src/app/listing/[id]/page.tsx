'use client';

import { Listing } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Globe,
  Lock,
  MapPin,
  ShieldCheck,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ListingDetailsPage() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchListing() {
      if (!params.id) return;
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) console.error('Error:', error);
      else setListing(data);
      
      setLoading(false);
    }
    fetchListing();
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading deal data...</div>;
  if (!listing) return <div className="min-h-screen flex items-center justify-center text-slate-400">Listing not found.</div>;

  // Helpers
  const isDigital = listing.asset_type === 'Digital';
  const multiple = listing.asking_price && listing.annual_cashflow 
    ? (listing.asking_price / listing.annual_cashflow).toFixed(1) + 'x' 
    : '-';

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. HERO HEADER */}
      <div className="bg-[#0f172a] text-white pb-32 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/browse" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 text-sm font-bold">
            <ArrowLeft size={16} className="mr-2" /> Back to Marketplace
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* THUMBNAIL */}
            <div className="w-full md:w-96 aspect-video rounded-xl overflow-hidden relative border border-white/10 bg-slate-800 shadow-2xl">
              <img 
                src={listing.image_url || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80"} 
                alt={listing.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-3 left-3 flex gap-2">
                 <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    {listing.asset_type?.toUpperCase() || 'BUSINESS'}
                 </span>
              </div>
            </div>

            {/* TITLE & PRICE */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded">{listing.main_category || 'Business'}</span>
                {listing.sub_category && <span className="text-slate-400 text-xs flex items-center">• {listing.sub_category}</span>}
                <span className="flex items-center text-slate-400 text-xs">
                  <MapPin size={12} className="mr-1" /> {listing.location || 'Remote'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{listing.title}</h1>

              <div className="flex flex-wrap gap-8 border-t border-white/10 pt-6">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Asking Price</p>
                  <p className="text-3xl font-bold text-white">
                    {listing.asking_price ? `$${listing.asking_price.toLocaleString()}` : 'Contact'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Cash Flow</p>
                  <p className="text-3xl font-bold text-green-400">
                    {listing.annual_cashflow ? `$${listing.annual_cashflow.toLocaleString()}` : '-'}
                  </p>
                </div>
                <div>
                   <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Multiple</p>
                   <p className="text-2xl font-bold text-slate-200">{multiple}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: DETAILS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* EXECUTIVE SUMMARY */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="text-blue-600" size={20}/> Executive Summary
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed">
                {listing.description || "No description provided."}
              </div>
            </div>

            {/* FINANCIAL BREAKDOWN */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
               <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <DollarSign className="text-green-600" size={20}/> Financial Overview
               </h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <p className="text-xs text-slate-500 uppercase font-bold mb-1">Gross Revenue</p>
                     <p className="text-lg font-bold text-slate-900">${listing.annual_revenue?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                     <p className="text-xs text-green-700 uppercase font-bold mb-1">Cash Flow (SDE)</p>
                     <p className="text-lg font-bold text-green-700">${listing.annual_cashflow?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <p className="text-xs text-slate-500 uppercase font-bold mb-1">Expenses</p>
                     <p className="text-lg font-bold text-slate-900">${listing.expenses?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <p className="text-xs text-slate-500 uppercase font-bold mb-1">Gross Margin</p>
                     <p className="text-lg font-bold text-slate-900">{listing.gross_margin || '-'}%</p>
                  </div>
               </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* KEY FACTS CARD */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Key Facts</h3>
              <ul className="space-y-4 text-sm">
                 <li className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2"><Calendar size={14}/> Founded</span>
                    <span className="font-bold text-slate-900">{listing.founded_year || 'N/A'}</span>
                 </li>
                 <li className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2"><Users size={14}/> Employees</span>
                    <span className="font-bold text-slate-900">{listing.employee_count || 0}</span>
                 </li>
                 <li className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2"><MapPin size={14}/> Location</span>
                    <span className="font-bold text-slate-900">{listing.location || 'Remote'}</span>
                 </li>
                 <li className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-2"><Globe size={14}/> Website</span>
                    <span className="font-bold text-blue-600 truncate max-w-[150px]">
                       {listing.website_url ? (
                         <a href={listing.website_url} target="_blank" rel="noopener noreferrer">View Site ↗</a>
                       ) : 'Hidden'}
                    </span>
                 </li>
              </ul>
            </div>

            {/* CTA CARD */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-24">
               <div className="mb-4">
                 <div className="flex justify-between items-center mb-1">
                   <p className="text-xs font-bold text-slate-400 uppercase">NxtScore</p>
                   <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">{listing.nxt_score || 50}/100</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${listing.nxt_score || 50}%` }}></div>
                 </div>
               </div>

               <Link href={`/deal-room/${listing.id}`} className="w-full flex items-center justify-center gap-2 bg-[#EAB308] hover:bg-[#CA8A04] text-slate-900 font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg mb-3">
                  <Lock size={18} /> Unlock Deal Room
               </Link>
               <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors text-sm">
                  Contact Broker
               </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
