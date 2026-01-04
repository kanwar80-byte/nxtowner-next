'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export type Track = 'all' | 'operational' | 'digital';

interface TrackToggleProps {
  value?: Track;                 // current value (from URL)
  paramName?: string;            // default "track"
  basePath?: string;             // optional; default uses current path
  className?: string;
}

export default function TrackToggle({ 
  value, 
  paramName = 'track',
  basePath,
  className 
}: TrackToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Determine current value
  const urlValue = searchParams.get(paramName) as Track | null;
  const current = (value ?? urlValue ?? 'all') as Track;
  // Normalize invalid values to "all"
  const normalizedCurrent: Track = (current === 'operational' || current === 'digital') ? current : 'all';

  const handleTrackChange = (track: Track) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (track === 'all') {
        params.delete(paramName);
      } else {
        params.set(paramName, track);
      }
      const targetPath = basePath ?? pathname;
      router.push(`${targetPath}?${params.toString()}`);
      router.refresh(); // Safe for server components
    });
  };

  return (
    <div className={`flex items-center gap-2 bg-slate-100 p-1 rounded-lg ${className || ''}`}>
      <button
        onClick={() => handleTrackChange('all')}
        disabled={isPending}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          normalizedCurrent === 'all'
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
          normalizedCurrent === 'operational'
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
          normalizedCurrent === 'digital'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Digital
      </button>
    </div>
  );
}

