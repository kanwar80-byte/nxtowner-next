'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Globe, TrendingUp, DollarSign, Building2, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrack } from '@/contexts/TrackContext';
import { Button } from '@/components/ui/button';
import { mapV17ToGridListings } from '@/lib/v17/mappers';
import { manualSearch } from '@/lib/v17/search/client';
import type { ListingTeaserV17 } from '@/lib/v17/types';

type AssetType = 'operational' | 'digital';

interface Listing {
  id: string;
  title: string;
  category: string;
  type: AssetType;
  price: string;
  metricLabel: string;
  metricValue: string;
  locationOrModel: string;
  imageUrl: string;
  badges: string[];
}

// Helper function to format currency
const fmtMoney = (amount: number) => {
  if (!amount) return "Contact for Price";
  return new Intl.NumberFormat('en-CA', { 
    style: 'currency', 
    currency: 'CAD', 
    maximumFractionDigits: 0,
    notation: "compact" 
  }).format(amount);
};

const ListingCard = ({ listing }: { listing: Listing }) => {
  const isOps = listing.type === 'operational';
  
  const cardBaseStyle = cn(
    "group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1",
    "border bg-white dark:bg-zinc-900",
    isOps 
      ? "border-gray-200 shadow-sm hover:shadow-md hover:border-amber-500/50 dark:border-zinc-800"
      : "border-gray-100 dark:border-zinc-800/50 shadow-sm hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] hover:border-cyan-500/30"
  );

  const accentTextColor = isOps ? "text-amber-700 dark:text-amber-500" : "text-cyan-700 dark:text-cyan-500";
  const badgeBgColor = isOps
    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
    : "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800";
  const LocationIcon = isOps ? MapPin : Globe;

  return (
    <Link href={`/listing/${listing.id}`} className={cardBaseStyle}>
      <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-zinc-800">
        <Image src={listing.imageUrl} alt={listing.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
         <div className="absolute top-4 left-4">
            <span className={cn("px-3 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-full border", badgeBgColor)}>
                {listing.category}
            </span>
         </div>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2">{listing.title}</h3>
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <LocationIcon className="w-4 h-4 mr-1.5 opacity-70" />
            <span className="truncate">{listing.locationOrModel}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100 dark:border-zinc-800">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Asking Price</p>
            <p className={cn("text-xl font-extrabold font-mono", accentTextColor)}>{listing.price}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> {listing.metricLabel}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{listing.metricValue}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {listing.badges.slice(0, 2).map((b, i) => (
              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-300">{b}</span>
            ))}
          </div>
          <span className={cn("text-sm font-semibold", accentTextColor)}>
            View Deal &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};

interface SmartListingGridProps {
  activeCategory: string;
  initialListings?: Listing[]; // Optional server-provided listings
}

// Digital category chips for Featured Acquisitions
const DIGITAL_CATEGORY_CHIPS = [
  'All Listings',
  'SaaS',
  'E-Commerce',
  'AI Tools',
  'Content Sites',
];

export default function SmartListingGrid({ activeCategory, initialListings }: SmartListingGridProps) {
  const { track } = useTrack();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>(initialListings || []);
  const [loading, setLoading] = useState(!initialListings); // If we have initial listings, don't show loading
  const [selectedChip, setSelectedChip] = useState<string>('All Listings'); // Local state for chip selection

  // Read filters from URL params (single source of truth)
  const urlAssetType = searchParams.get('assetType');
  const urlCategoryId = searchParams.get('categoryId');
  const urlSubcategoryId = searchParams.get('subcategoryId');
  const searchQuery = searchParams.get('q');
  
  // Determine if we should use URL params or local state
  const hasUrlFilters = !!(urlAssetType || urlCategoryId || urlSubcategoryId || searchQuery);
  const effectiveAssetType = (urlAssetType || track) as "operational" | "digital";
  const effectiveCategoryId = urlCategoryId || undefined;
  const effectiveSubcategoryId = urlSubcategoryId || undefined;
  const effectiveQuery = searchQuery || undefined;

  // Helper: Fetch listings via server API route (supports UUID filtering)
  async function fetchV17Listings(params: {
    assetType?: "operational" | "digital";
    categoryId?: string | null;
    subcategoryId?: string | null;
    query?: string | null;
    limit?: number;
  }): Promise<ListingTeaserV17[]> {
    const sp = new URLSearchParams();
    if (params.assetType) sp.set("assetType", params.assetType);
    if (params.categoryId) sp.set("categoryId", params.categoryId);
    if (params.subcategoryId) sp.set("subcategoryId", params.subcategoryId);
    if (params.query) sp.set("query", params.query);
    sp.set("limit", String(params.limit ?? 20));

    const res = await fetch(`/api/search-listings?${sp.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Search failed");
    return res.json();
  }

  // Handle chip click - filter in place using manualSearch
  const handleChipClick = async (chipCategory: string) => {
    setSelectedChip(chipCategory);
    setLoading(true);
    
    try {
      const filters: Record<string, unknown> = {
        listing_type: 'digital',
        page_size: 6,
        sort: 'newest', // Use 'newest' as fallback (featured not yet supported)
      };
      
      // Only add category if not "All Listings"
      if (chipCategory !== 'All Listings') {
        filters.category = chipCategory;
      }
      
      const response = await manualSearch(filters);
      
      if (response.items && response.items.length > 0) {
        // Convert ListingTeaserV17 from @/types/v17/search to format expected by mapper
        // The mapper expects @/lib/v17/types format, so we need to adapt
        const adaptedItems = response.items.map((item) => ({
          id: item.id,
          title: item.title,
          asset_type: item.listing_type === 'digital' ? 'digital' : 'operational',
          asking_price: item.asking_price,
          cash_flow: item.owner_cashflow ?? 0,
          revenue_annual: item.annual_revenue ?? 0,
          status: item.featured_level === 'premium' || item.featured_level === 'boost' ? 'teaser' : 'published',
          city: item.location_city || '',
          category_id: item.category || '',
          subcategory_id: item.subcategory || '',
          hero_image_url: null, // Not available in ListingTeaserV17
        }));
        
        // Map adapted items to Listing format
        const mappedListings = mapV17ToGridListings(adaptedItems as any);
        setListings(mappedListings);
      } else {
        setListings([]);
      }
    } catch (error: any) {
      console.error("Error fetching listings via chip:", error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch from server API route (supports UUID category_id/subcategory_id filtering)
  // Use URL params as single source of truth
  useEffect(() => {
    // If we have initial listings and no URL filters, use them and skip fetch
    if (initialListings && initialListings.length > 0 && !hasUrlFilters && activeCategory === "All Listings" && selectedChip === "All Listings") {
      setListings(initialListings);
      setLoading(false);
      return;
    }

    // If chip is selected and not "All Listings", use chip filtering (handled by handleChipClick)
    if (selectedChip !== "All Listings" && !hasUrlFilters) {
      // Chip filtering is handled by handleChipClick, don't fetch here
      return;
    }

    async function fetchListings() {
      setLoading(true);
      
      try {
        // Use server API route (calls server repo with UUID support)
        const v17Listings = await fetchV17Listings({
          assetType: effectiveAssetType,
          categoryId: effectiveCategoryId,
          subcategoryId: effectiveSubcategoryId,
          query: effectiveQuery,
          limit: 6,
        });

        // Map V17 listings to grid format
        const mappedListings = mapV17ToGridListings(v17Listings);
        setListings(mappedListings);
      } catch (error: any) {
        console.error("Error fetching listings:", {
          message: error?.message,
          queryInputs: {
            assetType: effectiveAssetType,
            categoryId: effectiveCategoryId,
            subcategoryId: effectiveSubcategoryId,
            query: effectiveQuery,
          },
        });
        setListings([]);
      }
      setLoading(false);
    }

    fetchListings();
  }, [effectiveAssetType, effectiveCategoryId, effectiveSubcategoryId, effectiveQuery, initialListings, hasUrlFilters, activeCategory, searchParams, selectedChip]);

  const resultCount = listings.length;

  // Clear filters function - route to /browse with assetType only
  function clearFilters() {
    router.push(`/browse?assetType=${track}`);
  }

  // Generate results summary text
  const getResultsSummary = () => {
    if (loading) return 'Loading...';
    
    if (effectiveQuery) {
      return (
        <>
          <span className="font-semibold text-amber-600 dark:text-amber-400">Found {resultCount} match{resultCount !== 1 ? 'es' : ''}</span>
          {' for '}
          <span className="font-semibold text-gray-900 dark:text-white">&quot;{effectiveQuery}&quot;</span>
          {resultCount === 0 && '. Try adjusting your search criteria.'}
        </>
      );
    }
    
    // Default text when no search
    if (!effectiveCategoryId && !effectiveSubcategoryId) {
      return `Showing ${resultCount} premium ${effectiveAssetType === 'operational' ? 'operational' : 'digital'} opportunities.`;
    }
    
    return (
      <>
        Showing {resultCount} premium opportunities
        {effectiveCategoryId || effectiveSubcategoryId ? ' in selected category' : ''}.
      </>
    );
  };

  return (
    <section className="w-full py-12 bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Results Summary - Positioned between Filter Pills and Grid */}
        {(effectiveQuery || effectiveCategoryId || effectiveSubcategoryId) && (
          <div className="mb-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {effectiveQuery ? 'Search Results' : 'Filtered Results'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {getResultsSummary()}
                </p>
              </div>
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="ml-4 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        )}
        
        {/* Default Header (when no filters) */}
        {!effectiveQuery && !effectiveCategoryId && !effectiveSubcategoryId && (
          <div className="mb-8">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Featured Acquisitions
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {getResultsSummary()}
                </p>
              </div>
              <Link 
                href={selectedChip === 'All Listings' 
                  ? '/search?listing_type=digital'
                  : `/search?listing_type=digital&category=${encodeURIComponent(selectedChip)}`
                }
                className="hidden md:block text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all listings &rarr;
              </Link>
            </div>
            
            {/* Category Chips - Only show for digital track */}
            {track === 'digital' && (
              <div className="flex flex-wrap gap-3 justify-center">
                {DIGITAL_CATEGORY_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
                      selectedChip === chip
                        ? "bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                    )}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.slice(0, 6).map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800">
             <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No listings found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {effectiveQuery 
                ? `No results match "${effectiveQuery}". Try adjusting your search criteria.`
                : 'Try selecting a different category or adjusting your filters.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
