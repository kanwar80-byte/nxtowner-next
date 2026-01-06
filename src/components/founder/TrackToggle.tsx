'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface TrackToggleProps {
  currentTrack: 'all' | 'operational' | 'digital';
  basePath: string;
}

export default function TrackToggle({ currentTrack, basePath }: TrackToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleTrackChange = (track: 'all' | 'operational' | 'digital') => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (track === 'all') {
        params.delete('track');
      } else {
        params.set('track', track);
      }
      router.push(`${basePath}?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
      <button
        onClick={() => handleTrackChange('all')}
        disabled={isPending}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          currentTrack === 'all'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        All
      </button>
      <button
        onClick={() => handleTrackChange('operational')}
        disabled={isPending}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          currentTrack === 'operational'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Operational
      </button>
      <button
        onClick={() => handleTrackChange('digital')}
        disabled={isPending}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          currentTrack === 'digital'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Digital
      </button>
    </div>
  );
}




