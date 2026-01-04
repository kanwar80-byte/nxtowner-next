import { Suspense } from 'react';
import { generateExecBrief } from '@/lib/founder/aiReport';
import { computeConfidence } from '@/lib/founder/confidence';
import ExecReportView from '@/components/founder/ai/ExecReportView';
import TrackToggle from '@/components/shared/TrackToggle';
import ConfidenceMeter from '@/components/founder/ConfidenceMeter';

interface FounderAIReportPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function FounderAIReportPage({ searchParams }: FounderAIReportPageProps) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.track) ? sp.track[0] : sp.track;
  const track = (raw === 'operational' || raw === 'digital') ? raw : 'all';
  const [brief, confidence] = await Promise.all([
    generateExecBrief(track),
    computeConfidence(),
  ]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Founder • AI Report</h1>
            <p className="text-slate-600 mt-1">Data-driven executive brief with strategic insights and action plans.</p>
          </div>
          <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
            <TrackToggle value={track} />
          </Suspense>
        </div>
      </div>
      <div className="mb-4">
        <ConfidenceMeter confidence={confidence} />
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <ExecReportView brief={brief} />
      </div>
    </div>
  );
}

