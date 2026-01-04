'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';
import { getSavedIds, getSavedCount } from '@/lib/buyer/savedListings';
import Link from 'next/link';

type SavedListing = {
  id: string;
  title: string | null;
  asking_price: number | null;
  city: string | null;
  province: string | null;
  asset_type: string | null;
  hero_image_url: string | null;
};

export default function SavedListingsPage() {
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const loadSavedListings = async () => {
      try {
        // Check auth
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setAuthenticated(false);
          setLoading(false);
          // Redirect handled by client-side navigation
          window.location.href = '/login';
          return;
        }
        
        setAuthenticated(true);
        const savedIds = getSavedIds();
        
        if (savedIds.length === 0) {
          setSavedListings([]);
          setLoading(false);
          return;
        }

        const { data: listings, error } = await supabase
          .from('listings_v16')
          .select('id, title, asking_price, city, province, asset_type, hero_image_url')
          .in('id', savedIds);

        if (error || !listings) {
          console.error('Error fetching saved listings:', error);
          setSavedListings([]);
        } else {
          setSavedListings(listings as SavedListing[]);
        }
      } catch (err) {
        console.error('Error loading saved listings:', err);
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

  if (loading || authenticated === false) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900">Saved Listings</h1>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const savedCount = getSavedCount();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Saved Listings</h1>

      {savedListings.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600 mb-4">No saved listings yet.</p>
          <Link
            href="/browse/operational"
            className="inline-block px-6 py-2 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-700 transition"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">You have {savedCount} saved listing{savedCount !== 1 ? 's' : ''}.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listing/${listing.id}`}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                {listing.hero_image_url && (
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={listing.hero_image_url}
                      alt={listing.title || 'Listing'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-lg text-slate-900 mb-2">
                  {listing.title || 'Untitled Listing'}
                </h3>
                <p className="text-slate-500 text-sm mb-2 capitalize">
                  {listing.asset_type === 'operational' ? 'Physical Asset' : 'Digital Business'}
                </p>
                {listing.city && listing.province && (
                  <p className="text-slate-500 text-sm mb-2">
                    {listing.city}, {listing.province}
                  </p>
                )}
                <p className="font-bold text-blue-600 mb-2">
                  {listing.asking_price
                    ? `$${listing.asking_price.toLocaleString()}`
                    : 'Price on request'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
