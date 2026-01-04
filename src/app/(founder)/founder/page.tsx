import { Suspense } from 'react';
import { requireRole } from '@/lib/auth/getProfile';
import { getFounderMetrics } from '@/lib/founder/founderMetrics';
import { computeGrowthBlockers } from '@/lib/founder/growthBlockers';
import { getPartnerMetrics, type PartnerMetrics } from '@/lib/founder/partners';
import { computeConfidence, type ConfidenceSummary } from '@/lib/founder/confidence';
import type { GrowthBlocker } from '@/components/founder/FounderBlockers';
import type { FounderMetrics } from '@/lib/founder/founderMetrics';
import FounderKpiTiles from '@/components/founder/FounderKpiTiles';
import FounderTrendBlocks from '@/components/founder/FounderTrendBlocks';
import FounderBlockers from '@/components/founder/FounderBlockers';
import PartnerPanels from '@/components/founder/PartnerPanels';
import TrackToggle from '@/components/shared/TrackToggle';
import ConfidenceMeter from '@/components/founder/ConfidenceMeter';

interface FounderPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function FounderPage({ searchParams }: FounderPageProps) {
  // Enforce founder role - redirects to /dashboard if role doesn't match
  await requireRole('founder', '/founder');
  const sp = await searchParams;
  const raw = Array.isArray(sp.track) ? sp.track[0] : sp.track;
  const track = (raw === 'operational' || raw === 'digital') ? raw : 'all';
  
  let metrics: FounderMetrics;
  let blockers: GrowthBlocker[];
  let partnerMetrics: PartnerMetrics;
  let confidence: ConfidenceSummary;
  let errorMessage: string | null = null;

  try {
    [metrics, blockers, partnerMetrics, confidence] = await Promise.all([
      getFounderMetrics(track),
      computeGrowthBlockers(),
      getPartnerMetrics(track),
      computeConfidence(),
    ]);
  } catch (err) {
    console.error("[FounderPage] Error loading data:", err);
    errorMessage = err instanceof Error ? err.message : "Unknown error";
    metrics = {
      visitors: { label: "Visitors", value7d: 0, value30d: 0, isEstimated: true },
      registrations: { label: "Registrations", value7d: 0, value30d: 0 },
      paidUsers: { label: "Paid Users", value7d: 0, value30d: 0 },
      mrr: { label: "MRR", value7d: 0, value30d: 0, isEstimated: true },
      ndaSigned: { label: "NDAs Signed", value7d: 0, value30d: 0 },
      enquiries: { label: "Enquiries", value7d: 0, value30d: 0 },
      dealRoomsActive: { label: "Deal Rooms Active", value7d: 0, value30d: 0 },
    };
    blockers = [];
    partnerMetrics = {
      leadsByPartner: [],
      leadsByTrack: { operational: null, digital: null },
      dataQualityNote: "Partner lead data not configured",
    };
    confidence = {
      level: "low",
      score: 0,
      coverageDays: 0,
      sessions30d: 0,
      events30d: 0,
      estimatedMetrics: 0,
      lowVolumeWarnings: 0,
      notes: ["Event tracking not available"],
    };
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Founder • Executive Overview</h1>
            <p className="text-slate-600 mt-1">Strategic intelligence system for growth, monetization, engagement, risk, and funnel intelligence.</p>
            {errorMessage && (
              <p className="text-sm text-amber-600 mt-2">
                ⚠️ Unable to load some data: {errorMessage}
              </p>
            )}
          </div>
          <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
            <TrackToggle value={track} />
          </Suspense>
        </div>
      </div>

      <ConfidenceMeter confidence={confidence} />

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Key Metrics</h2>
        <FounderKpiTiles metrics={metrics} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <section>
          <FounderTrendBlocks metrics={metrics} />
        </section>
        <section>
          <FounderBlockers blockers={blockers} />
        </section>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Partner Intelligence</h2>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <PartnerPanels metrics={partnerMetrics} />
        </div>
      </section>
    </div>
  );
}

