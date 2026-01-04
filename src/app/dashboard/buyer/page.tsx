import { getUserDealRooms } from '@/app/actions/dealroom';
import { requireAuth } from '@/lib/auth';
import { createClient } from "@/utils/supabase/server";
import Link from 'next/link';
import GettingStartedCard from '@/components/buyer/GettingStartedCard';
import BuyerNextActions from '@/components/buyer/BuyerNextActions';

export const revalidate = 0; // Render on demand

type ListingData = {
  id: string;
  title: string;
  asking_price: number | null;
  status: string;
  asset_type: string;
};

type WatchlistWithDetails = {
  listing_id: string;
  created_at: string;
  listing: ListingData | null;
};

export default async function BuyerDashboardPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  // 1. Fetch Profile (Fixed: Was missing before)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 2. Fetch all buyer data
  // Fetch saved listings directly from saved_listings table
  const { data: savedListingsData } = await supabase
    .from('saved_listings')
    .select('listing_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const [dealRooms, ndas] = await Promise.all([
    getUserDealRooms(user.id).catch(() => []), // Catch errors if table missing
    fetchUserNDAs(user.id)
  ]);

  // 3. Fetch listing details for saved listings
  // Filter out null listing_id before mapping
  const watchlistWithDetails: WatchlistWithDetails[] = await Promise.all(
    (savedListingsData || [])
      .filter((item) => item.listing_id !== null)
      .map(async (item) => {
        const { data: listing } = await supabase
          .from('listings_v16')
          .select('id, title, asking_price, status, asset_type')
          .eq('id', item.listing_id!)
          .single();
        return {
          listing_id: item.listing_id!,
          created_at: item.created_at || '',
          listing: listing as ListingData | null
        };
      })
  );

  return (
    <main className="bg-[#0f172a] min-h-screen py-16 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Buyer Dashboard</h1>
          <p className="text-slate-400 mt-2">
            Manage your saved listings, deal rooms, and NDAs
          </p>
        </div>

        {/* Getting Started Card */}
        <GettingStartedCard />

        {/* Next Actions */}
        <BuyerNextActions />

        {/* Plan Status */}
        {profile && (
          <div className="mb-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-2">Current Plan</h2>
            <div className="flex items-center gap-2">
                <span className="capitalize text-blue-400 font-bold">Free Tier</span>
            </div>
          </div>
        )}

        {/* Saved Listings Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Your Saved Listings
          </h2>
          
          {watchlistWithDetails.length === 0 ? (
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8 text-center">
              <p className="text-slate-400">No saved listings yet.</p>
              <Link
                href="/browse"
                className="inline-block mt-4 px-6 py-2 bg-[#EAB308] text-slate-900 font-bold rounded-md hover:bg-[#CA8A04] transition"
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
                    className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-xl transition"
                  >
                    <h3 className="font-bold text-lg text-slate-900 mb-2">
                      {item.listing.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-2">
                      {item.listing.asset_type === 'operational' ? 'Physical Asset' : 'Digital Business'}
                    </p>
                    <p className="font-bold text-blue-600">
                      {item.listing.asking_price
                        ? `$${item.listing.asking_price.toLocaleString()}`
                        : 'Price on request'}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Saved {new Date(item.created_at || Date.now()).toLocaleDateString()}
                    </p>
                  </Link>
                )
              ))}
            </div>
          )}
        </section>

        {/* Deal Rooms Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Your Deal Rooms
          </h2>
          
          {dealRooms?.length === 0 ? (
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8 text-center">
              <p className="text-slate-400">No active deal rooms.</p>
              <p className="text-sm text-slate-500 mt-2">
                Deal rooms are created when you sign an NDA for a listing
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dealRooms?.map((room) => (
                <Link
                  key={room.id}
                  href={`/deal-room/${room.id}`}
                  className="block bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-blue-500 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-white mb-1">
                        Deal Room #{room.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-slate-400">
                        Listing ID: {room.listing_id}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Created {new Date(room.created_at || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        room.status === 'open' ? 'bg-green-900/30 text-green-400 border border-green-900' :
                        'bg-yellow-900/30 text-yellow-400 border border-yellow-900'
                      }`}>
                        {(room.status || 'pending').replace('_', ' ')}
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
          <h2 className="text-2xl font-semibold text-white mb-4">
            Your Signed NDAs
          </h2>
          
          {ndas.length === 0 ? (
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8 text-center">
              <p className="text-slate-400">No signed NDAs yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(ndas as any[]).map((nda) => (
                <Link
                  key={nda.listing_id}
                  href={`/listing/${nda.listing_id}`}
                  className="block bg-slate-800 rounded-lg border border-slate-700 p-4 hover:border-blue-500 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-white">
                        {nda.listing?.title || 'Unknown Listing'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Signed on {new Date(nda.signed_at || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-900/30 text-green-400 border border-green-900 rounded-full text-xs font-semibold">
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

// --- HELPER FUNCTIONS ---

type NDARow = {
  id: string;
  listing_id: string;
  signed_at: string;
  status: string;
  listings: { id: string; title: string } | { id: string; title: string }[];
};

async function fetchUserNDAs(userId: string) {
  const supabase = await createClient();
  const NDA_TABLE = "ndas";
  try {
    const { data: ndaRows, error: ndaError } = await supabase
      .from(NDA_TABLE)
      .select("listing_id,signed_at,status")
      .eq("buyer_id", userId)
      .order("updated_at", { ascending: false });
    if (ndaError) {
      console.log("Supabase NDA Error:", {
        message: (ndaError as any)?.message,
        code: (ndaError as any)?.code,
        details: (ndaError as any)?.details,
        hint: (ndaError as any)?.hint,
      });
      return [];
    }
    return ndaRows || [];
  } catch (err) {
    console.log("Critical NDA Fetch Error (Table likely missing):", err);
    return [];
  }
}