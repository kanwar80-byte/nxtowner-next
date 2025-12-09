'use client';

import { useState, useEffect, useRef } from 'react';
import { toggleWatchlist, isListingWatchlisted } from '@/app/actions/watchlist';

interface WatchlistButtonProps {
  listingId: string;
  className?: string;
}

export function WatchlistButton({ listingId, className = '' }: WatchlistButtonProps) {
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const hasCheckedRef = useRef(false);

  async function checkWatchlistStatus() {
    setChecking(true);
    const status = await isListingWatchlisted(listingId);
    setIsWatchlisted(status);
    setChecking(false);
  }

  useEffect(() => {
    if (!hasCheckedRef.current) {
      hasCheckedRef.current = true;
      void checkWatchlistStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    const result = await toggleWatchlist(listingId);
    
    if (result.success) {
      setIsWatchlisted(result.isWatchlisted);
    } else {
      if (result.error === 'Not authenticated') {
        window.location.href = '/login?redirect=/browse';
      } else {
        alert(result.error || 'Failed to update watchlist');
      }
    }
    setLoading(false);
  }

  if (checking) {
    return (
      <button
        disabled
        className={`p-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 ${className}`}
      >
        <svg className="w-5 h-5 text-slate-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full bg-white/80 backdrop-blur-sm border transition-all hover:scale-110 hover:shadow-md ${
        isWatchlisted
          ? 'border-red-500 text-red-500'
          : 'border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {loading ? (
        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill={isWatchlisted ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
}
