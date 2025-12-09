import { requireAuth } from '@/lib/auth';
import { getWatchlistForUser } from '@/app/actions/watchlist';
import { getUserDealRooms } from '@/app/actions/dealroom';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ValuationBadgeFetcher } from './ValuationBadgeFetcher';
import { PlanStatus } from '@/components/billing/PlanStatus';

export const revalidate = 0; // Render on demand, not at build time

type ListingData = {
  id: string;
  title: string;
  asking_price: number | null;
  status: string;
  type: string;
};

type WatchlistWithDetails = {
  listing_id: string;
  created_at: string;
  listing: ListingData | null;
};

export default async function BuyerDashboardPage() {
  const user = await requireAuth();
  
  // Fetch all buyer data
  const [watchlistItems, dealRooms, ndas] = await Promise.all([
    getWatchlistForUser(),
    getUserDealRooms(),
    fetchUserNDAs(user.id)
  ]);

  // Fetch profile with plan info
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, plan_renews_at')
    .eq('id', user.id)
    .single();

  // Fetch listing details for watchlist
  const watchlistWithDetails: WatchlistWithDetails[] = await Promise.all(
    watchlistItems.map(async (item) => {
      const { data: listing } = await supabase
        .from('listings')
        .select('id, title, asking_price, status, type')
        .eq('id', item.listing_id)
        .single();
      return { 
        listing_id: item.listing_id,
        created_at: item.created_at,
        listing: listing as ListingData | null 
      };
    })
  );

  return (
    <main className="bg-brand-bg min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-brand-text">Buyer Dashboard</h1>
          <p className="text-brand-muted mt-2">
            Manage your saved listings, deal rooms, and NDAs
          </p>
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

        {/* Saved Listings Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-brand-text mb-4">
            Your Saved Listings
          </h2>
          
          {watchlistWithDetails.length === 0 ? (
            <div className="bg-white rounded-lg border border-brand-border p-8 text-center">
              <p className="text-brand-muted">No saved listings yet.</p>
              <Link
                href="/browse"
                className="inline-block mt-4 px-6 py-2 bg-brand-orange text-white rounded-md hover:bg-orange-600 transition"
              >
                Browse Listings
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlistWithDetails.map((item) => (
                item.listing && (
                  <Link
                    key={item.listing.id}
                    href={`/listing/${item.listing.id}`}
                    className="bg-white rounded-lg border border-brand-border p-6 hover:shadow-md transition"
                  >
                    <h3 className="font-semibold text-lg text-brand-text mb-2">
                      {item.listing.title}
                    </h3>
                    <p className="text-brand-muted text-sm mb-2">
                      {item.listing.type === 'asset' ? 'Physical Asset' : 'Digital Business'}
                    </p>
                    <p className="font-semibold text-brand-text">
                      {item.listing.asking_price
                        ? `$${item.listing.asking_price.toLocaleString()}`
                        : 'Price on request'}
                    </p>
                    <div className="mt-2">
                      <ValuationBadgeFetcher listingId={item.listing.id} />
                    </div>
                    <p className="text-xs text-brand-muted mt-2">
                      Saved {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </Link>
                )
              ))}
            </div>
          )}
        </section>

        {/* Deal Rooms Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-brand-text mb-4">
            Your Deal Rooms
          </h2>
          
          {dealRooms.length === 0 ? (
            <div className="bg-white rounded-lg border border-brand-border p-8 text-center">
              <p className="text-brand-muted">No active deal rooms.</p>
              <p className="text-sm text-brand-muted mt-2">
                Deal rooms are created when you sign an NDA for a listing
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dealRooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/deal-room/${room.id}`}
                  className="block bg-white rounded-lg border border-brand-border p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-brand-text mb-1">
                        Deal Room #{room.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-brand-muted">
                        Listing ID: {room.listing_id.slice(0, 8)}...
                      </p>
                      <p className="text-xs text-brand-muted mt-2">
                        Created {new Date(room.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        room.status === 'open' ? 'bg-green-100 text-green-800' :
                        room.status === 'under_offer' ? 'bg-blue-100 text-blue-800' :
                        room.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {room.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* NDAs Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-brand-text mb-4">
            Your Signed NDAs
          </h2>
          
          {ndas.length === 0 ? (
            <div className="bg-white rounded-lg border border-brand-border p-8 text-center">
              <p className="text-brand-muted">No signed NDAs yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ndas.map((nda) => (
                <Link
                  key={nda.id}
                  href={`/listing/${nda.listing.id}`}
                  className="block bg-white rounded-lg border border-brand-border p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-brand-text">
                        {nda.listing.title}
                      </h3>
                      <p className="text-xs text-brand-muted mt-1">
                        Signed on {new Date(nda.signed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      {nda.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

type NDARow = {
  id: string;
  listing_id: string;
  signed_at: string;
  status: string;
  listings: { id: string; title: string } | { id: string; title: string }[];
};

async function fetchUserNDAs(userId: string) {
  const { data, error } = await supabase
    .from('ndas')
    .select(`
      id,
      listing_id,
      signed_at,
      status,
      listings:listing_id (
        id,
        title
      )
    `)
    .eq('buyer_id', userId)
    .order('signed_at', { ascending: false });

  if (error) {
    console.error('Error fetching NDAs:', error);
    return [];
  }

  return (data as NDARow[] || []).map((nda) => ({
    id: nda.id,
    listing_id: nda.listing_id,
    signed_at: nda.signed_at,
    status: nda.status,
    listing: Array.isArray(nda.listings) ? nda.listings[0] : nda.listings
  })) as Array<{
    id: string;
    listing_id: string;
    signed_at: string;
    status: string;
    listing: { id: string; title: string };
  }>;
}
