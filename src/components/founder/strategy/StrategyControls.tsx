'use client';

import { StrategyInputs } from '@/lib/founder/strategySim';

interface StrategyControlsProps {
  inputs: StrategyInputs;
  onInputChange: (inputs: StrategyInputs) => void;
}

export default function StrategyControls({ inputs, onInputChange }: StrategyControlsProps) {
  const handleTrackChange = (track: 'all' | 'operational' | 'digital') => {
    onInputChange({ ...inputs, track });
  };

  const handleListingsChange = (pct: 0 | 10 | 25 | 50) => {
    onInputChange({ ...inputs, listingsIncreasePct: pct });
  };

  const handleNdaConversionChange = (pts: 0 | 2 | 5 | 10) => {
    onInputChange({ ...inputs, ndaConversionUpliftPts: pts });
  };

  const handlePaidConversionChange = (pts: 0 | 0.5 | 1 | 2) => {
    onInputChange({ ...inputs, paidConversionUpliftPts: pts });
  };

  const handlePartnerLeadChange = (pct: 0 | 10 | 25 | 50) => {
    onInputChange({ ...inputs, partnerLeadIncreasePct: pct });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Track</h3>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => handleTrackChange('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              inputs.track === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleTrackChange('operational')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              inputs.track === 'operational'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Operational
          </button>
          <button
            onClick={() => handleTrackChange('digital')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              inputs.track === 'digital'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Digital
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Increase Listings Supply</h3>
        <div className="flex items-center gap-2">
          {([0, 10, 25, 50] as const).map((pct) => (
            <button
              key={pct}
              onClick={() => handleListingsChange(pct)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                inputs.listingsIncreasePct === pct
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">NDA Conversion Uplift</h3>
        <div className="flex items-center gap-2">
          {([0, 2, 5, 10] as const).map((pts) => (
            <button
              key={pts}
              onClick={() => handleNdaConversionChange(pts)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                inputs.ndaConversionUpliftPts === pts
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              +{pts} pts
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Paid Conversion Uplift</h3>
        <div className="flex items-center gap-2">
          {([0, 0.5, 1, 2] as const).map((pts) => (
            <button
              key={pts}
              onClick={() => handlePaidConversionChange(pts)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                inputs.paidConversionUpliftPts === pts
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              +{pts} pts
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Partner Lead Increase</h3>
        <div className="flex items-center gap-2">
          {([0, 10, 25, 50] as const).map((pct) => (
            <button
              key={pct}
              onClick={() => handlePartnerLeadChange(pct)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                inputs.partnerLeadIncreasePct === pct
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}




