import { Suspense } from 'react';
import { getDealMetrics } from '@/lib/founder/deals';
import DealVelocityPanels from '@/components/founder/deals/DealVelocityPanels';
import TrackToggle from '@/components/shared/TrackToggle';

interface FounderDealsPageProps {
  searchParams: {
    track?: 'all' | 'operational' | 'digital';
  };
}

export default async function FounderDealsPage({ searchParams }: FounderDealsPageProps) {
  const track = (searchParams.track === 'operational' || searchParams.track === 'digital') ? searchParams.track : 'all';
  const metrics = await getDealMetrics('30d', track);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Founder • Deals</h1>
            <p className="text-slate-600 mt-1">View deal velocity and transaction metrics (legal-safe: no commissions / no brokerage success fees).</p>
          </div>
          <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
            <TrackToggle value={track} />
          </Suspense>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <DealVelocityPanels metrics={metrics} />
      </div>
    </div>
  );
}

