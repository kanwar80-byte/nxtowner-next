import { requireAuth } from '@/lib/auth';
import { getListingsForOwner } from '@/app/actions/listings';
import Link from 'next/link';
import { SubmitForReviewButton } from './SubmitForReviewButton';
import { supabase } from '@/lib/supabase';
import { PlanStatus } from '@/components/billing/PlanStatus';
import { Zap, ShieldCheck } from 'lucide-react';

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
                {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Active Listings" 
          value={data.totalActiveListings} 
          icon={BarChart2} 
          colorClass="text-indigo-600" 
        />
        <StatCard 
          title="Total Views" 
          value={data.listingPerformance.reduce((sum, l) => sum + l.views, 0).toLocaleString()} 
          icon={Eye} 
          colorClass="text-blue-600" 
        />
        <StatCard 
          title="NDAs Signed" 
          value={data.totalNDAsSigned} 
          icon={FileText} 
          colorClass="text-green-600" 
        />
        <StatCard 
          title="Qualified Buyers" 
          value={data.listingPerformance.reduce((sum, l) => sum + l.qualifiedBuyers, 0)} 
          icon={ShieldCheck} // Changed icon to ShieldCheck for 'Qualified'
          colorClass="text-purple-600" // New color for emphasis
        />
      </div>
            <div className="bg-white rounded-lg border border-brand-border overflow-hidden">
              <div className="overflow-x-auto">
                <div className="flex p-4 bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                  <div className="w-1/4">Listing Title</div>
                  <div className="w-1/6 text-center">AI Status</div>
                  <div className="w-1/6 text-center">Views</div>
                  <div className="w-1/6 text-center">Qualified</div>
                  <div className="w-1/6 text-center">NDAs</div>
                  <div className="w-1/6 text-center">Age (Days)</div>
                </div>
                {listings.map((listing) => (
                  <ListingRow key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const ListingRow = ({ listing }) => {
  const statusColor = listing.aiVerificationStatus === 'Verified' 
      ? 'text-green-600 bg-green-50' 
      : listing.aiVerificationStatus === 'Pending' 
      ? 'text-orange-600 bg-orange-50' 
      : 'text-red-600 bg-red-50';

  return (
      <div className="flex items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
          <div className="w-1/4 min-w-0">
              <Link href={`/listing/${listing.listingId}/analytics`} className="font-semibold text-blue-600 hover:underline truncate block">
                  {listing.title}
              </Link>
              <span className="text-xs text-gray-500">{listing.listingStatus}</span>
          </div>
          <div className="w-1/6 text-center">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                  <Zap size={10} className="inline mr-1" />
                  {listing.aiVerificationStatus}
              </span>
          </div>
          <div className="w-1/6 text-center text-sm font-medium text-gray-700">{listing.views}</div>
          <div className="w-1/6 text-center text-sm font-medium text-purple-600 font-bold">{listing.qualifiedBuyers}</div>
          <div className="w-1/6 text-center text-sm font-medium text-gray-700">{listing.ndasSigned}</div>
          <div className="w-1/6 text-center text-sm text-gray-700">{listing.timeOnMarketDays} days</div>
      </div>
  );
};
