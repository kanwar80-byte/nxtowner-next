import { Suspense } from 'react';
import { getEngagementMetrics } from '@/lib/founder/engagement';
import EngagementPanels from '@/components/founder/engagement/EngagementPanels';
import EngagementPeriodSelector from '@/components/founder/engagement/EngagementPeriodSelector';
import TrackToggle from '@/components/shared/TrackToggle';

interface FounderEngagementPageProps {
  searchParams: {
    period?: '7d' | '30d';
    track?: 'all' | 'operational' | 'digital';
  };
}

export default async function FounderEngagementPage({ searchParams }: FounderEngagementPageProps) {
  const period = (searchParams.period === '7d' || searchParams.period === '30d') ? searchParams.period : '30d';
  const track = (searchParams.track === 'operational' || searchParams.track === 'digital') ? searchParams.track : 'all';
  const metrics = await getEngagementMetrics(period, track);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Founder • Engagement</h1>
            <p className="text-slate-600 mt-1">View user engagement metrics, feature usage, and activity trends.</p>
          </div>
          <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
            <EngagementPeriodSelector currentPeriod={period} />
          </Suspense>
        </div>
        <div className="flex items-center justify-end">
          <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
            <TrackToggle value={track} />
          </Suspense>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <EngagementPanels metrics={metrics} period={period} />
      </div>
    </div>
  );
}

