"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ShieldCheck, Star, Globe, Building2 } from 'lucide-react';
import type { ListingTeaserV17 } from '@/types/v17/search';

interface SearchResultsV17Props {
  items: ListingTeaserV17[];
}

// Helper functions (shared between components)
const formatCurrency = (amount: number | null): string => {
  if (!amount) return 'Price on request';
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
    notation: 'compact',
  }).format(amount);
};

const getVerificationBadge = (status: ListingTeaserV17['verification_status']) => {
  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
        <ShieldCheck className="w-3 h-3" />
        Verified
      </span>
    );
  }
  return null;
};

const getFeaturedBadge = (level: ListingTeaserV17['featured_level']) => {
  if (level === 'premium' || level === 'boost') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
        <Star className="w-3 h-3" />
        {level === 'premium' ? 'Premium' : 'Featured'}
      </span>
    );
  }
  return null;
};

/**
 * V17 Search Results Component
 * Displays listing cards from search results
 */
export default function SearchResultsV17({ items }: SearchResultsV17Props) {

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400 text-lg">No listings found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((listing) => {
        // Determine image source in priority order
        // Note: ListingTeaserV17 from @/types/v17/search doesn't have image fields
        // But we check for them in case they're added via type extension
        const imageUrl = (listing as any).image_url || 
                        (listing as any).thumbnail_url || 
                        (listing as any).cover_image_url || 
                        (listing as any).hero_image_url || 
                        null;

        return (
          <ListingCard 
            key={listing.id} 
            listing={listing} 
            imageUrl={imageUrl}
          />
        );
      })}
    </div>
  );
}

// Separate card component to handle image state
function ListingCard({ 
  listing, 
  imageUrl 
}: { 
  listing: ListingTeaserV17; 
  imageUrl: string | null;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(imageUrl);

  // Handle image load error - show placeholder instead
  const handleImageError = () => {
    setImageError(true);
    setImageSrc(null);
  };

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group block bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-all"
    >
      {/* Image or placeholder */}
      <div className="relative h-48 w-full bg-gradient-to-br from-slate-100 to-slate-300 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden">
        {imageSrc && !imageError ? (
          <Image
            src={imageSrc}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              {listing.listing_type === 'digital' ? (
                <Globe className="w-12 h-12 mx-auto text-slate-400 dark:text-zinc-600 mb-2" />
              ) : (
                <Building2 className="w-12 h-12 mx-auto text-slate-400 dark:text-zinc-600 mb-2" />
              )}
              <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium">
                {listing.listing_type === 'digital' ? 'Digital Business' : 'Business Listing'}
              </p>
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {getVerificationBadge(listing.verification_status)}
          {getFeaturedBadge(listing.featured_level)}
        </div>

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 rounded text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
            {listing.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {listing.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
          {listing.location_city && (
            <>
              <MapPin className="w-4 h-4" />
              <span>
                {listing.location_city}
                {listing.location_province && `, ${listing.location_province}`}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-zinc-800">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Asking Price</p>
            <p className="font-bold text-lg text-slate-900 dark:text-slate-100">
              {formatCurrency(listing.asking_price)}
            </p>
          </div>
          {listing.subcategory && (
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Type</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {listing.subcategory}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

