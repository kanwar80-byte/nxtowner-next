'use client';

import FilterSidebar from '@/components/browse/FilterSidebar'; // 👈 This was missing
import ListingCard from '@/components/browse/ListingCard';
import { Listing } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function BrowseContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Extract params
  const query = searchParams.get('q');
  const type = searchParams.get('type');
  const category = searchParams.get('category');
  const sub = searchParams.get('sub');
  const maxPrice = searchParams.get('maxPrice');

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      let dbQuery = supabase.from('listings').select('*').eq('status', 'active');

      // --- APPLY FILTERS ---
      if (query) {
        // Search in title OR description
        dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }
      if (type && type !== 'All') {
        dbQuery = dbQuery.eq('asset_type', type);
      }
      if (category) {
        dbQuery = dbQuery.eq('main_category', category);
      }
      if (sub) {
        dbQuery = dbQuery.eq('sub_category', sub);
      }
      if (maxPrice) {
        dbQuery = dbQuery.lte('asking_price', Number(maxPrice));
      }

      const { data, error } = await dbQuery;
      
      if (error) console.error(error);
      else setListings(data || []);
      
      setLoading(false);
    }

    fetchListings();
  }, [searchParams]); // Re-run whenever URL changes

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 pt-16">
      
      {/* 1. LEFT SIDEBAR (Sticky on Desktop) */}
      {/* This ensures the sidebar is visible on the left */}
      <aside className="hidden md:block w-64 flex-shrink-0 border-r border-slate-200 bg-white h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        <FilterSidebar />
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {/* Header Stats */}
        <div className="mb-6 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            {category ? `${category} Opportunities` : (type ? `${type} Assets` : 'All Listings')}
          </h1>
          <span className="text-sm text-slate-500">{listings.length} results found</span>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-80 bg-white rounded-xl animate-pulse border border-slate-200"></div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && listings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <Search className="h-10 w-10 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No listings found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your filters.</p>
          </div>
        )}

        {/* RESULTS GRID */}
        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div>Loading marketplace...</div>}>
      <BrowseContent />
    </Suspense>
  );
}