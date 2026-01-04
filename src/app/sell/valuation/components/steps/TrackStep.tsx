'use client';

import { Building2, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TrackStepProps {
  initialTrack?: 'operational' | 'digital' | null;
  onTrackSelect: (track: 'operational' | 'digital') => void;
  isLocked?: boolean;
}

export default function TrackStep({ initialTrack, onTrackSelect, isLocked = false }: TrackStepProps) {
  const [selectedTrack, setSelectedTrack] = useState<'operational' | 'digital' | null>(initialTrack ?? null);

  useEffect(() => {
    if (selectedTrack == null && initialTrack) {
      setSelectedTrack(initialTrack);
    }
  }, [initialTrack, selectedTrack]);

  const handleSelect = (track: 'operational' | 'digital') => {
    setSelectedTrack(track);
    onTrackSelect(track);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          What type of asset are you selling?
        </h2>
        <p className="text-slate-600 mb-2">
          This selection will lock your valuation flow to the appropriate track.
        </p>
        <p className="text-sm font-semibold text-red-600 mb-8">
          * Required - You must select a track to continue
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Operational */}
          <button
            onClick={() => handleSelect('operational')}
            className={`p-6 border-2 rounded-xl text-left transition-all ${
              selectedTrack === 'operational'
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                selectedTrack === 'operational' ? 'bg-blue-600' : 'bg-slate-200'
              }`}>
                <Building2
                  className={selectedTrack === 'operational' ? 'text-white' : 'text-slate-600'}
                  size={24}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Operational Business
                </h3>
                <p className="text-sm text-slate-600">
                  Physical businesses, real estate, franchises, retail, restaurants, manufacturing, etc.
                </p>
              </div>
            </div>
          </button>

          {/* Digital */}
          <button
            onClick={() => handleSelect('digital')}
            className={`p-6 border-2 rounded-xl text-left transition-all ${
              selectedTrack === 'digital'
                ? 'border-purple-600 bg-purple-50 shadow-md'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                selectedTrack === 'digital' ? 'bg-purple-600' : 'bg-slate-200'
              }`}>
                <Monitor
                  className={selectedTrack === 'digital' ? 'text-white' : 'text-slate-600'}
                  size={24}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Digital Asset
                </h3>
                <p className="text-sm text-slate-600">
                  SaaS, online businesses, apps, e-commerce, content sites, digital products, etc.
                </p>
              </div>
            </div>
          </button>
        </div>

        {selectedTrack && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your valuation flow will be locked to{' '}
              <strong>{selectedTrack === 'operational' ? 'operational' : 'digital'}</strong> assets.
              {isLocked && (
                <span className="block mt-2 font-semibold">
                  Track is locked. Use "Reset valuation" to change.
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

