import { Suspense } from 'react';
import { createClient } from "@/utils/supabase/server";
import TrackToggle from '@/components/shared/TrackToggle';
import { getListingTrack } from '@/lib/track';

interface FounderMarketplacePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function FounderMarketplacePage({ searchParams }: FounderMarketplacePageProps) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.track) ? sp.track[0] : sp.track;
  const track = (raw === 'operational' || raw === 'digital') ? raw : 'all';
  const supabase = await createClient();
  
  // Get basic marketplace stats
  let totalListings = null;
  let publishedListings = null;
  let operationalListings = null;
  let digitalListings = null;

  try {
    // Get all listings to determine track
    const { data: allListings } = await supabase
      .from('listings_v16')
      .select('id, asset_type, meta, track, tax_category, category, status');

    if (allListings) {
      totalListings = allListings.length;
      publishedListings = allListings.filter((l: any) => l.status === 'published').length;
      
      // Use track helper to determine operational/digital
      operationalListings = allListings.filter((l: any) => 
        l.status === 'published' && getListingTrack(l) === 'operational'
      ).length;
      
      digitalListings = allListings.filter((l: any) => 
        l.status === 'published' && getListingTrack(l) === 'digital'
      ).length;
    }
  } catch {
    // Table may not exist
  }

  const formatValue = (value: number | null): string => {
    return value === null ? '—' : value.toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Founder • Marketplace</h1>
            <p className="text-slate-600 mt-1">View marketplace dynamics, trends, and segmentation.</p>
          </div>
          <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
            <TrackToggle value={track} />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Total Listings</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(totalListings)}</div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Published</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(publishedListings)}</div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Operational</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(operationalListings)}</div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600 mb-1">Digital</div>
          <div className="text-2xl font-bold text-slate-900">{formatValue(digitalListings)}</div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-slate-500">Additional marketplace analytics (category breakdown, price distribution, etc.) will be implemented here.</p>
      </div>
    </div>
  );
}

