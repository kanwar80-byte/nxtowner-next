'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, CheckCircle2 } from 'lucide-react';

interface AdminListing {
  id: string;
  title: string;
  asking_price: number | null;
  is_featured: boolean;
  featured_until: string | null;
  is_ai_verified: boolean;
  ai_verified_at: string | null;
  status: string;
  created_at: string;
}

export default function AdminListingUpgradesPage() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdminAndLoadListings() {
      try {
        // Check if user is admin
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError('Not authenticated');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single() as { data: { role: string } | null };

        if (!profile || profile.role !== 'admin') {
          setError('Admin access required');
          return;
        }

        setIsAdmin(true);

        // Load all active listings
        const { data, error: listingsError } = await supabase
          .from('listings')
          .select(
            'id, title, asking_price, is_featured, featured_until, is_ai_verified, ai_verified_at, status, created_at'
          )
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (listingsError) throw listingsError;
        setListings(data || []);
      } catch (err) {
        console.error('Error loading listings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    }

    checkAdminAndLoadListings();
  }, []);

  const handleToggleFeatured = async (
    listingId: string,
    currentFeatured: boolean
  ) => {
    try {
      let featuredUntil = null;
      if (!currentFeatured) {
        // Setting featured - set expiry to 30 days from now
        const date = new Date();
        date.setDate(date.getDate() + 30);
        featuredUntil = date.toISOString();
      }

      const { error } = await supabase
        .from('listings')
        // @ts-expect-error - Column added in migration, not yet reflected in generated types
        .update({
          is_featured: !currentFeatured,
          featured_until: featuredUntil,
        })
        .eq('id', listingId);

      if (error) throw error;

      // Update local state
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === listingId
            ? {
                ...listing,
                is_featured: !currentFeatured,
                featured_until: featuredUntil,
              }
            : listing
        )
      );
    } catch (err) {
      console.error('Error toggling featured:', err);
      alert('Failed to toggle featured status');
    }
  };

  const handleToggleAiVerified = async (listingId: string, currentVerified: boolean) => {
    try {
      const aiVerifiedAt = !currentVerified ? new Date().toISOString() : null;

      const { error } = await supabase
        .from('listings')
        // @ts-expect-error - Column added in migration, not yet reflected in generated types
        .update({
          is_ai_verified: !currentVerified,
          ai_verified_at: aiVerifiedAt,
        })
        .eq('id', listingId);

      if (error) throw error;

      // Update local state
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === listingId
            ? {
                ...listing,
                is_ai_verified: !currentVerified,
                ai_verified_at: aiVerifiedAt,
              }
            : listing
        )
      );
    } catch (err) {
      console.error('Error toggling AI verified:', err);
      alert('Failed to toggle AI verified status');
    }
  };

  const handleRemoveFeatured = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        // @ts-expect-error - Column added in migration, not yet reflected in generated types
        .update({
          is_featured: false,
          featured_until: null,
        })
        .eq('id', listingId);

      if (error) throw error;

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === listingId
            ? {
                ...listing,
                is_featured: false,
                featured_until: null,
              }
            : listing
        )
      );
    } catch (err) {
      console.error('Error removing featured:', err);
      alert('Failed to remove featured status');
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'TBD';
    return price.toLocaleString('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-CA');
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">Loading listings...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-red-600">{error || 'Access denied'}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Listing Upgrades</h1>
          <p className="text-gray-600 mt-2">
            Manage featured and AI-verified badges for active listings
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  Listing Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  Price
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  Featured
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  AI-Verified
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  Featured Until
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <a
                        href={`/listing/${listing.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-900 hover:text-orange-600 line-clamp-2"
                      >
                        {listing.title}
                      </a>
                      <p className="text-sm text-gray-500 mt-1">{listing.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">
                    {formatPrice(listing.asking_price)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        handleToggleFeatured(
                          listing.id,
                          listing.is_featured
                        )
                      }
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                        listing.is_featured
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      {listing.is_featured ? 'Featured' : 'Feature'}
                    </button>
                    {listing.is_featured && listing.featured_until && (
                      <button
                        onClick={() => handleRemoveFeatured(listing.id)}
                        className="block mt-2 text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        handleToggleAiVerified(listing.id, listing.is_ai_verified)
                      }
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                        listing.is_ai_verified
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {listing.is_ai_verified ? 'Verified' : 'Verify'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {listing.is_featured && listing.featured_until ? (
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatDate(listing.featured_until)}
                        </p>
                        {isExpired(listing.featured_until) && (
                          <p className="text-xs text-red-600 mt-1">Expired</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">-</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {listings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No active listings found</p>
          </div>
        )}
      </div>
    </main>
  );
}
