'use client';

import { Listing } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import {
  ArrowLeft,
  CheckCircle,
  Lock,
  MapPin,
  ShieldCheck
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

      if (error) {
        console.error('Error fetching listing:', error);
      } else {
        setListing(data);
      }
      setLoading(false);
    }

    fetchListing();
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading deal details...</div>;
  }

  if (!listing) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Listing not found.</div>;
  }

  // Helper to safely calculate multiple
  const multiple = listing.asking_price && listing.annual_cashflow 
    ? (listing.asking_price / listing.annual_cashflow).toFixed(1) + 'x' 
    : 'N/A';

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. HERO SECTION */}
      <div className="bg-[#020617] text-white pb-24 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/browse" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-6 text-sm">
            <ArrowLeft size={16} className="mr-2" /> Back to Listings
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Image Thumbnail */}
            <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden relative border border-white/10 bg-slate-800">
               {/* Use a placeholder if no image exists yet */}
              <img 
                src={(listing.metrics?.image_url as string) || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80"} 
                alt={listing.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-3 left-3 flex gap-2">
                {listing.is_ai_verified && (
                  <span className="flex items-center gap-1.5 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    <CheckCircle size={12} /> AI-VERIFIED
                  </span>
                )}
              </div>
              {listing.nxt_score && (
                <div className="absolute bottom-3 right-3 bg-[#FACC15] text-slate-900 text-xs font-bold px-2 py-1 rounded shadow-md">
                  NxtScore: {listing.nxt_score}
                </div>
              )}
            </div>

            {/* Title & Metrics */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded">{listing.category || 'Business'}</span>
                <span className="flex items-center text-slate-400 text-sm">
                  <MapPin size={14} className="mr-1" /> {listing.location || 'Remote'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                {listing.title}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-white/10 pt-6">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Asking Price</p>
                  <p className="text-2xl font-bold">
                    {listing.asking_price ? `$${listing.asking_price.toLocaleString()}` : 'Contact'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Cash Flow</p>
                  <p className="text-2xl font-bold text-green-400">
                    {listing.annual_cashflow ? `$${listing.annual_cashflow.toLocaleString()}` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Revenue</p>
                  <p className="text-xl font-bold text-slate-200">
                    {listing.annual_revenue ? `$${listing.annual_revenue.toLocaleString()}` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Multiple</p>
                  <p className="text-xl font-bold text-slate-200">{multiple}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: DETAILS */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Executive Summary</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                {listing.description || "No description provided for this listing yet."}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTION SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-24">
              <div className="mb-6 pb-6 border-b border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Asking Price</p>
                <p className="text-3xl font-extrabold text-slate-900">
                  {listing.asking_price ? `$${listing.asking_price.toLocaleString()}` : 'Contact'}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <Link 
                  href={`/deal-room/${listing.id}`} 
                  className="w-full flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  <Lock size={18} /> Unlock Deal Room
                </Link>
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">
                  Contact Broker
                </button>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs font-bold text-blue-900 mb-1">Verified Listing</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      NDA required for full access.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
