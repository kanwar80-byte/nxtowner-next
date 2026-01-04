'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';
import { getSavedIds } from '@/lib/buyer/savedListings';
import Link from 'next/link';

interface SavedListing {
  id: string;
  title: string | null;
  asking_price: number | null;
  city: string | null;
  province: string | null;
  asset_type: string | null;
}

export default function BuyerNextActions() {
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedListings = async () => {
      try {
        const savedIds = getSavedIds();
        if (savedIds.length === 0) {
          setSavedListings([]);
          setLoading(false);
          return;
        }

        const supabase = createSupabaseBrowserClient();
        const { data: listings, error } = await supabase
          .from('listings_v16')
          .select('id, title, asking_price, city, province, asset_type')
          .in('id', savedIds)
          .limit(3);

        if (error || !listings) {
          setSavedListings([]);
        } else {
          setSavedListings(listings as SavedListing[]);
        }
      } catch {
        setSavedListings([]);
      } finally {
        setLoading(false);
      }
    };

    loadSavedListings();

    // Re-check when localStorage changes
    const handleStorageChange = () => {
      loadSavedListings();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', loadSavedListings);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadSavedListings);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-8">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
          <div className="h-20 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (savedListings.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Next Actions</h2>
        <p className="text-slate-400 mb-4">Start exploring opportunities in the marketplace.</p>
        <Link
          href="/browse"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#EAB308] text-slate-900 font-semibold rounded-lg hover:bg-[#CA8A04] transition"
        >
          Start Browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Continue with Saved Listings</h2>
      <div className="space-y-3">
        {savedListings.map((listing) => (
          <Link
            key={listing.id}
            href={`/listing/${listing.id}`}
            className="block bg-slate-700/50 rounded-lg border border-slate-600 p-4 hover:border-[#EAB308] transition"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">
                  {listing.title || 'Untitled Listing'}
                </h3>
                <p className="text-sm text-slate-400">
                  {[listing.city, listing.province].filter(Boolean).join(', ') || 'Location TBD'}
                </p>
                {listing.asking_price && (
                  <p className="text-sm font-semibold text-[#EAB308] mt-1">
                    ${listing.asking_price.toLocaleString()}
                  </p>
                )}
              </div>
              <span className="text-xs text-slate-500 ml-4">
                {listing.asset_type === 'operational' ? 'Physical' : 'Digital'}
              </span>
            </div>
          </Link>
        ))}
      </div>
      {savedListings.length >= 3 && (
        <Link
          href="/browse"
          className="mt-4 inline-block text-sm text-[#EAB308] hover:underline"
        >
          View all saved listings →
        </Link>
      )}
    </div>
  );
}


