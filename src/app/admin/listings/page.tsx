'use client';

import { useEffect, useState, useRef } from 'react';
import { AuthGate } from '@/components/auth/AuthGate';
import { getPendingListingsAdmin, approveListingAdmin, rejectListingAdmin } from '@/app/actions/listings';
import type { Listing } from '@/types/database';

export default function AdminListingsPage() {
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  async function loadPendingListings() {
    setLoading(true);
    const listings = await getPendingListingsAdmin();
    setPendingListings(listings);
    setLoading(false);
  }

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadPendingListings();
    }
  }, []);

  async function handleApprove(id: string) {
    setActionLoading(id);
    const result = await approveListingAdmin(id);
    if (result.success) {
      await loadPendingListings();
    } else {
      alert(result.error || 'Failed to approve listing');
    }
    setActionLoading(null);
  }

  async function handleReject(id: string) {
    setActionLoading(id);
    const result = await rejectListingAdmin(id);
    if (result.success) {
      await loadPendingListings();
    } else {
      alert(result.error || 'Failed to reject listing');
    }
    setActionLoading(null);
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AuthGate requireAdmin={true}>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Pending Listings</h1>
            <p className="mt-2 text-slate-600">
              Review and approve listings submitted for publication
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
              <p className="mt-4 text-slate-600">Loading pending listings...</p>
            </div>
          ) : pendingListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                All caught up!
              </h2>
              <p className="text-slate-600">
                No pending listings to review at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-slate-900">
                            {listing.title}
                          </h2>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                            {listing.type === 'asset' ? 'Operational Asset' : 'Digital Asset'}
                          </span>
                        </div>
                        {listing.category && (
                          <p className="text-sm text-slate-600 mb-2">
                            Category: <span className="font-medium">{listing.category}</span>
                          </p>
                        )}
                        {listing.location && (
                          <p className="text-sm text-slate-600">
                            📍 {listing.location}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-orange-600">
                          {formatCurrency(listing.asking_price)}
                        </p>
                      </div>
                    </div>

                    {listing.summary && (
                      <p className="text-slate-700 mb-4 leading-relaxed">
                        {listing.summary}
                      </p>
                    )}

                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Annual Revenue</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatCurrency(listing.annual_revenue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Annual Cashflow</p>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatCurrency(listing.annual_cashflow)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Submitted</p>
                        <p className="text-sm font-medium text-slate-900">
                          {new Date(listing.created_at).toLocaleDateString('en-CA')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(listing.id)}
                        disabled={actionLoading === listing.id}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        {actionLoading === listing.id ? 'Processing...' : '✓ Approve & Publish'}
                      </button>
                      <button
                        onClick={() => handleReject(listing.id)}
                        disabled={actionLoading === listing.id}
                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        {actionLoading === listing.id ? 'Processing...' : '✗ Reject'}
                      </button>
                      <a
                        href={`/listing/${listing.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
                      >
                        View Details →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGate>
  );
}
