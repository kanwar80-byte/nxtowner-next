'use client';

import { advanceDealStage } from '@/app/actions/deal-actions';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  dealId: string;
  currentStage: string;
}

export function AdvanceStageButton({ dealId, currentStage }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAdvance = async () => {
    setIsLoading(true);
    try {
      await advanceDealStage(dealId, currentStage);
    } catch (error) {
      console.error(error);
      alert('Failed to advance stage');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAdvance}
      disabled={isLoading}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          Next Stage
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  );
}
