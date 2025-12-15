'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// Define the shape of your database row
interface Listing {
  id: number;
  title: string;
  location: string;
  price: number | null; // Allow null prices
  cashflow: string;
  category: string;
  asset_type: string; // Matches your DB column
  image_url: string;
  is_verified: boolean;
}

export default function CuratedOpportunities() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchListings() {
      // Fetch only Featured listings
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_featured', true)
        .limit(4);

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
       <div className="w-full py-10 text-center text-gray-400">
          Loading opportunities...
       </div>
    );
  }

  // Fallback if DB is empty
  if (listings.length === 0) {
     return null; 
  }

  return (
    <div className="w-full">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Featured Collection</span>
          </div>
          <h2 className="text-3xl font-bold text-[#0a192f]">Curated Opportunities</h2>
          <p className="text-gray-500 mt-3 max-w-2xl text-sm leading-relaxed">
            Hand-picked for <span className="text-gray-800 font-semibold">financial health</span>, documentation readiness, and verified seller status.
          </p>
        </div>
        <Link href="/browse" className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-900 border-b border-gray-300 hover:border-gray-900 pb-1 transition-all">
          View all featured <ArrowRight size={14}/>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <Link href={`/listing/${listing.id}`} key={listing.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            <div className="h-48 bg-gray-100 relative overflow-hidden">
               {/* Use the DB image or a placeholder */}
               <img 
                 src={listing.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80'} 
                 alt={listing.title}
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
               />
               
               {/* Badges */}
               <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm text-gray-800 uppercase">
                        {/* Fallback if asset_type is missing */}
                        {listing.asset_type || 'Asset'}
                    </span>
               </div>

               {listing.is_verified && (
                 <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full shadow-md z-10" title="Verified Listing">
                    <ShieldCheck size={14} />
                 </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
                    <p className="text-lg font-bold text-[#0a192f]">
                      {/* SAFETY CHECK: If price exists, format it. If not, show text. */}
                      {listing.price 
                        ? `$${listing.price.toLocaleString()}` 
                        : 'Price on Request'}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Performance</p>
                    <div className="flex items-center justify-end text-sm font-medium text-green-700">
                        <TrendingUp size={14} className="mr-1" /> {listing.cashflow || 'N/A'}
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