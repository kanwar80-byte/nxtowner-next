'use client';

import React from 'react';
import { CheckCircle2, Star } from 'lucide-react';

interface ListingBadgesProps {
  isAiVerified: boolean;
  aiVerifiedAt?: string | null;
  isFeatured: boolean;
  featuredUntil?: string | null;
  className?: string;
}

/**
 * ListingBadges Component
 * Displays premium upgrade badges on listings
 * - AI-Verified: Trust indicator
 * - Featured: Premium placement indicator with expiration
 */
export default function ListingBadges({
  isAiVerified,
  aiVerifiedAt,
  isFeatured,
  featuredUntil,
  className = '',
}: ListingBadgesProps) {
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    
    // If date is in the past, return "Expired"
    if (date < now) return 'Expired';
    
    // Calculate days until expiry
    const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    if (daysUntil <= 7) return `${daysUntil} days left`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Don't render anything if no badges
  if (!isAiVerified && !isFeatured) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {isFeatured && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
          <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
          <span className="text-sm font-medium text-amber-900">Featured</span>
          {featuredUntil && (
            <span className="text-xs text-amber-700 ml-1">({formatDate(featuredUntil)})</span>
          )}
        </div>
      )}

      {isAiVerified && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-900">AI-Verified</span>
          {aiVerifiedAt && (
            <span className="text-xs text-green-700 ml-1">
              (verified {new Date(aiVerifiedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
