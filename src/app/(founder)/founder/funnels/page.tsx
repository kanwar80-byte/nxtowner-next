import { Suspense } from 'react';
import { getFunnelData } from '@/lib/founder/funnelRepo';
import { computeConfidence } from '@/lib/founder/confidence';
import FunnelTable from '@/components/founder/funnels/FunnelTable';
import FunnelLeakInsights from '@/components/founder/funnels/FunnelLeakInsights';
import FunnelPeriodSelector from '@/components/founder/funnels/FunnelPeriodSelector';
import TrackToggle from '@/components/shared/TrackToggle';
import ConfidenceMeter from '@/components/founder/ConfidenceMeter';

interface FounderFunnelsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function FounderFunnelsPage({ searchParams }: FounderFunnelsPageProps) {
  const sp = await searchParams;
  const periodRaw = Array.isArray(sp.period) ? sp.period[0] : sp.period;
  const period = (periodRaw === '7d' || periodRaw === '30d') ? periodRaw : '30d';
  const trackRaw = Array.isArray(sp.track) ? sp.track[0] : sp.track;
  const track = (trackRaw === 'operational' || trackRaw === 'digital') ? trackRaw : 'all';
  const [funnel, confidence] = await Promise.all([
    getFunnelData(period, track),
    computeConfidence(),
  ]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Founder • Funnels</h1>
            <p className="text-slate-600 mt-1">View funnel conversion metrics, step-by-step conversion, and funnel leaks.</p>
          </div>
          <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
            <FunnelPeriodSelector currentPeriod={period} />
          </Suspense>
        </div>
        <div className="flex items-center justify-end">
          <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
            <TrackToggle value={track} />
          </Suspense>
        </div>
      </div>

      <ConfidenceMeter confidence={confidence} />

      <div className="space-y-6">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Funnel Overview ({period})</h2>
          <FunnelTable funnel={funnel} />
        </div>

        <FunnelLeakInsights funnel={funnel} />
      </div>
    </div>
  );
}

