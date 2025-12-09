import { requireAuth } from '@/lib/auth';
import { getListingsForOwner } from '@/app/actions/listings';
import Link from 'next/link';
import { SubmitForReviewButton } from './SubmitForReviewButton';
import { supabase } from '@/lib/supabase';
import { PlanStatus } from '@/components/billing/PlanStatus';

export const revalidate = 0; // Render on demand, not at build time

const statusCopy: Record<string, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  active: "Active",
  under_nda: "Under NDA",
  under_offer: "Under Offer",
  closed: "Closed",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  pending_review: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  under_nda: "bg-blue-100 text-blue-800",
  under_offer: "bg-purple-100 text-purple-800",
  closed: "bg-red-100 text-red-800",
};

export default async function SellerDashboardPage() {
  const user = await requireAuth();
  const listings = await getListingsForOwner();

  // Fetch profile with plan info
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, plan_renews_at')
    .eq('id', user.id)
    .single();

  return (
    <main className="bg-brand-bg min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-text">Seller Dashboard</h1>
            <p className="text-brand-muted mt-2">
              Manage your listings and track their status
            </p>
          </div>
          <Link
            href="/sell"
            className="px-6 py-3 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition"
          >
            + Create New Listing
          </Link>
        </div>

        {/* Plan Status */}
        {profile && (
          <div className="mb-8">
            <PlanStatus 
              plan={
                // @ts-expect-error - plan fields added in migration
                profile.plan || 'free'
              } 
              planRenewsAt={
                // @ts-expect-error - plan fields added in migration
                profile.plan_renews_at
              }
            />
          </div>
        )}

        {/* Listings Section */}
        <section>
          <h2 className="text-2xl font-semibold text-brand-text mb-4">
            Your Listings
          </h2>
          
          {listings.length === 0 ? (
            <div className="bg-white rounded-lg border border-brand-border p-8 text-center">
              <p className="text-brand-muted mb-4">You haven&apos;t created any listings yet.</p>
              <Link
                href="/sell"
                className="inline-block px-6 py-2 bg-brand-orange text-white rounded-md hover:bg-orange-600 transition"
              >
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-brand-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-brand-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {listings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-brand-text">
                            {listing.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-brand-muted">
                          {listing.type === 'asset' ? 'Physical' : 'Digital'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            statusColors[listing.status] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {statusCopy[listing.status] || listing.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-brand-text">
                          {listing.asking_price
                            ? `$${listing.asking_price.toLocaleString()}`
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-brand-muted">
                          {new Date(listing.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            {listing.status === 'draft' && (
                              <SubmitForReviewButton listingId={listing.id} />
                            )}
                            {listing.status === 'pending_review' && (
                              <span className="text-brand-muted text-xs">
                                Under review
                              </span>
                            )}
                            {listing.status === 'active' && (
                              <Link
                                href={`/listing/${listing.id}`}
                                className="text-brand-orange hover:text-orange-600 font-medium"
                              >
                                View
                              </Link>
                            )}
                            {listing.status === 'draft' && (
                              <Link
                                href={`/sell?edit=${listing.id}`}
                                className="text-gray-600 hover:text-gray-800 font-medium"
                              >
                                Edit
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
