'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Listing } from '@/types/database';
import Link from 'next/link';
import { CheckCircle, Lock, Search } from 'lucide-react';

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const typeFilter = searchParams.get('type') || 'All';
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      let dbQuery = supabase.from('listings').select('*');

      // 1. Apply Text Search
      if (query) {
        // Search in title OR description OR category
        // Note: For simple 'ilike' to work on multiple columns, use 'or'
        dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);
      }

      // 2. Apply Type Filter (Operational/Digital)
      if (typeFilter !== 'All') {
        dbQuery = dbQuery.eq('asset_type', typeFilter);
      }

      // 3. Execute
      const { data, error } = await dbQuery;
      
      if (error) {
        console.error('Search error:', error);
      } else {
        setListings(data || []);
      }
      setLoading(false);
    }

    fetchListings();
  }, [query, typeFilter]);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {query ? `Search Results for "${query}"` : 'All Opportunities'}
          </h1>
          <p className="text-slate-500">
            Found {listings.length} listings {typeFilter !== 'All' ? `in ${typeFilter}` : ''}
          </p>
        </div>

        {/* Loading State */}
        {loading && <div className="text-center py-20 text-slate-400">AI scanning opportunities...</div>}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <Search className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No listings found</h3>
            <p className="text-slate-500">Try adjusting your search terms or filters.</p>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
             <Link
              href={`/listing/${listing.id}`}
              key={listing.id}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-video bg-slate-100">
                <img 
                   src={listing.metrics?.image_url as string || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80'} 
                   className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                   {listing.is_ai_verified && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">AI VERIFIED</span>}
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-[10px] font-bold uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600">{listing.asset_type || 'Business'}</span>
                   <span className="text-[10px] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded text-blue-600">{listing.main_category}</span>
                </div>
                <h3 className="font-bold text-slate-900 line-clamp-1 mb-4">{listing.title}</h3>
                
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                   <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Price</p>
                      <p className="font-bold text-slate-900">${listing.asking_price?.toLocaleString()}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Revenue</p>
                      <p className="font-bold text-green-600">${listing.annual_revenue?.toLocaleString()}</p>
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}