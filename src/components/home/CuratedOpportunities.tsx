'use client';

import { Listing } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { ArrowRight, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CuratedOpportunities() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchListings() {
      // Fetch 3 Premium Listings
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_featured', true)
        .limit(3);

      if (error) {
        console.error('Error fetching listings:', error);
      } else if (data) {
        setListings(data);
      }
      setLoading(false);
    }

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-24 text-center text-slate-400 bg-white">
        Loading opportunities...
      </div>
    );
  }

  if (listings.length === 0) return null;

  return (
    <section className="py-20 bg-white"> {/* Matches the clean white background in your screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
             <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
              Curated Opportunities
            </h2>
            <p className="text-slate-500 text-lg">
              Hand-picked for financial health and documentation readiness.
            </p>
          </div>
          <Link 
            href="/browse?featured=true" 
            className="flex items-center font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            View All Listings <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {/* The Premium 3-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <Link
              href={`/listing/${listing.id}`}
              key={listing.id}
              className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* IMAGE SECTION */}
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <img
                  src={listing.metrics?.image_url as string || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80'}
                  alt={listing.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* TOP LEFT CHIPS */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                   {listing.is_ai_verified && (
                    <span className="flex items-center gap-1.5 bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                      <CheckCircle size={12} className="text-white" />
                      AI-VERIFIED
                    </span>
                   )}
                   {listing.has_deal_room && (
                    <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                      <Lock size={12} className="text-slate-500" />
                      DEAL ROOM
                    </span>
                   )}
                </div>

                {/* BOTTOM RIGHT SCORE BADGE */}
                {listing.nxt_score && (
                  <div className="absolute bottom-4 right-4 bg-[#FACC15] text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md border border-yellow-500/20">
                    NxtScore: {listing.nxt_score}
                  </div>
                )}
              </div>

              {/* DETAILS SECTION */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Category & Location */}
                <div className="flex items-center gap-2 mb-3 text-sm">
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {listing.category || 'Business'}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 flex items-center truncate">
                       {listing.location || 'Canada'}
                    </span>
                </div>
                
                {/* Title */}
                <h3 className="font-bold text-slate-900 text-xl mb-6 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                  {listing.title}
                </h3>

                {/* Financial Metrics Grid */}
                <div className="mt-auto grid grid-cols-2 gap-4 pt-5 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider mb-1">Asking Price</p>
                    <p className="text-xl font-extrabold text-slate-900">
                      {listing.asking_price
                        ? `$${listing.asking_price.toLocaleString()}`
                        : 'Contact'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider mb-1">Cash Flow (SDE)</p>
                    <p className="text-xl font-extrabold text-green-600">
                       {listing.annual_cashflow ? `$${listing.annual_cashflow.toLocaleString()}` : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}