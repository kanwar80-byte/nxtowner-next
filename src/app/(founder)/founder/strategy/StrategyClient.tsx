'use client';

import { useState, useTransition, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { StrategyInputs, StrategyOutputs } from '@/lib/founder/strategySim';
import { runStrategySimulation } from '@/app/actions/strategy';
import StrategyControls from '@/components/founder/strategy/StrategyControls';
import StrategyOutputsComponent from '@/components/founder/strategy/StrategyOutputs';
import ConfidenceMeter from '@/components/founder/ConfidenceMeter';
import TrackToggle from '@/components/shared/TrackToggle';

export default function StrategyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialTrack = (searchParams.get('track') === 'operational' || searchParams.get('track') === 'digital')
    ? searchParams.get('track') as 'operational' | 'digital'
    : 'all';

  const [inputs, setInputs] = useState<StrategyInputs>({
    track: initialTrack,
    listingsIncreasePct: 0,
    ndaConversionUpliftPts: 0,
    paidConversionUpliftPts: 0,
    partnerLeadIncreasePct: 0,
  });

  const [outputs, setOutputs] = useState<StrategyOutputs | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<import('@/lib/founder/confidence').ConfidenceSummary | null>(null);

  // Fetch confidence on mount
  useEffect(() => {
    const fetchConfidence = async () => {
      try {
        const { getConfidence } = await import('@/app/actions/confidence');
        const conf = await getConfidence();
        setConfidence(conf);
      } catch (err) {
        // Silently fail - confidence is optional
      }
    };
    fetchConfidence();
  }, []);

  // Sync URL track changes to inputs
  useEffect(() => {
    const urlTrack = (searchParams.get('track') === 'operational' || searchParams.get('track') === 'digital')
      ? searchParams.get('track') as 'operational' | 'digital'
      : 'all';
    if (urlTrack !== inputs.track) {
      setInputs(prev => ({ ...prev, track: urlTrack }));
    }
  }, [searchParams, inputs.track]);

  const handleInputChange = (newInputs: StrategyInputs) => {
    setInputs(newInputs);
    // Update URL (TrackToggle will handle this, but we sync for consistency)
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (newInputs.track === 'all') {
        params.delete('track');
      } else {
        params.set('track', newInputs.track);
      }
      router.push(`/founder/strategy?${params.toString()}`);
    });
  };

  const handleSimulate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await runStrategySimulation(inputs);
      setOutputs(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to simulate strategy');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Founder • Strategy Simulator</h1>
            <p className="text-slate-600 mt-1">Model the impact of strategic changes using rule-based heuristics.</p>
          </div>
          <div className="flex items-center gap-4">
            {confidence && (
              <ConfidenceMeter confidence={confidence} compact />
            )}
            <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
              <TrackToggle value={initialTrack} />
            </Suspense>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Strategy Controls</h2>
          <StrategyControls inputs={inputs} onInputChange={handleInputChange} />
          <div className="mt-6">
            <button
              onClick={handleSimulate}
              disabled={isLoading || isPending}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Simulating...' : 'Run Simulation'}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Projected Outputs</h2>
          {outputs ? (
            <StrategyOutputsComponent outputs={outputs} />
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>Adjust strategy controls and click "Run Simulation" to see projected impacts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

