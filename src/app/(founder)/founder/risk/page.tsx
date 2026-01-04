import { Suspense } from 'react';
import { getRiskMetrics } from '@/lib/founder/risk';
import RiskPanels from '@/components/founder/risk/RiskPanels';
import TrackToggle from '@/components/shared/TrackToggle';

interface FounderRiskPageProps {
  searchParams: {
    track?: 'all' | 'operational' | 'digital';
  };
}

export default async function FounderRiskPage({ searchParams }: FounderRiskPageProps) {
  const track = (searchParams.track === 'operational' || searchParams.track === 'digital') ? searchParams.track : 'all';
  const metrics = await getRiskMetrics(track);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Founder • Risk</h1>
            <p className="text-slate-600 mt-1">View trust and risk metrics, compliance status, and risk indicators.</p>
          </div>
          <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
            <TrackToggle value={track} />
          </Suspense>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <RiskPanels metrics={metrics} />
      </div>
    </div>
  );
}

