import { Suspense } from 'react';
import { getRevenueMetrics } from '@/lib/founder/revenue';
import RevenuePanels from '@/components/founder/revenue/RevenuePanels';
import TrackToggle from '@/components/shared/TrackToggle';

interface FounderRevenuePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function FounderRevenuePage({ searchParams }: FounderRevenuePageProps) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.track) ? sp.track[0] : sp.track;
  const track = (raw === 'operational' || raw === 'digital') ? raw : 'all';
  const metrics = await getRevenueMetrics(track);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Founder • Revenue</h1>
            <p className="text-slate-600 mt-1">View MRR/ARR, revenue by tier, and monetization trends.</p>
          </div>
          <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
            <TrackToggle value={track} />
          </Suspense>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <RevenuePanels metrics={metrics} />
      </div>
    </div>
  );
}

