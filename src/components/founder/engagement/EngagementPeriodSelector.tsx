'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface EngagementPeriodSelectorProps {
  currentPeriod: '7d' | '30d';
}

export default function EngagementPeriodSelector({ currentPeriod }: EngagementPeriodSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePeriodChange = (period: '7d' | '30d') => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('period', period);
      router.push(`/founder/engagement?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
      <button
        onClick={() => handlePeriodChange('7d')}
        disabled={isPending}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          currentPeriod === '7d'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        7d
      </button>
      <button
        onClick={() => handlePeriodChange('30d')}
        disabled={isPending}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          currentPeriod === '30d'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        30d
      </button>
    </div>
  );
}


