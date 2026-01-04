'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Globe, TrendingUp, DollarSign, Building2, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { useTrack } from '@/contexts/TrackContext';
import { Button } from '@/components/ui/button';

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
    <div className={cardBaseStyle}>
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
          <button className={cn("text-sm font-semibold hover:underline focus:outline-none", accentTextColor)}>View Deal &rarr;</button>
        </div>
      </div>
    </div>
  );
};

interface SmartListingGridProps {
  activeCategory: string;
}

export default function SmartListingGrid({ activeCategory }: SmartListingGridProps) {
  const { track } = useTrack();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  
  // Check if AI filters are active
  const hasAIFilters = !!(
    searchParams.get('q') ||
    searchParams.get('category') ||
    searchParams.get('location') ||
    searchParams.get('min_value') ||
    searchParams.get('is_verified')
  );

  // Fetch real data from Supabase with AI search filters
  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      
      // Get search params from URL (AI Super Search Edge Function format)
      const query = searchParams.get('q');
      const urlCategory = searchParams.get('category');
      const location = searchParams.get('location');
      const minValue = searchParams.get('min_value');
      const isVerified = searchParams.get('is_verified') === 'true';
      
      // Combine URL category with activeCategory from filter pills
      // Priority: URL category (from AI search) > activeCategory (from filter pills)
      const categoryFilter = urlCategory || (activeCategory !== "All Listings" ? activeCategory : null);
      
      let queryBuilder = supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .eq('deal_type', track); // Must match current mode (operational vs digital)
      
      // Apply text search
      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,listing_title.ilike.%${query}%,category.ilike.%${query}%`);
      }
      
      // Apply category filter (from AI search or filter pills)
      if (categoryFilter) {
        queryBuilder = queryBuilder.ilike('category', `%${categoryFilter}%`);
      }
      
      // Apply location filter
      if (location) {
        queryBuilder = queryBuilder.or(`location_city.ilike.%${location}%,location_province.ilike.%${location}%,city.ilike.%${location}%`);
      }
      
      // Apply financial filters (Edge Function structured format)
      // Mode-specific: operational uses ebitda/cash_flow, digital uses mrr
      if (minValue) {
        const minVal = parseFloat(minValue);
        if (track === 'operational') {
          queryBuilder = queryBuilder.gte('cash_flow', minVal);
        } else {
          queryBuilder = queryBuilder.gte('mrr', minVal);
        }
      }
      
      // Apply verification filter
      if (isVerified) {
        queryBuilder = queryBuilder.eq('is_ai_verified', true);
      }
      
      const { data, error } = await queryBuilder
        .order('created_at', { ascending: false })
        .limit(6); // Limit to top 6 matches for homepage

      if (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      } else if (data) {
        // Map database fields to SmartListingGrid Listing interface
        const mappedListings: Listing[] = data.map((item: any) => {
          const isOps = (item.deal_type || item.asset_type || 'operational') === 'operational';
          const ebitda = Number(item.cash_flow || item.ebitda) || 0;
          const mrr = Number(item.mrr || item.mrr_current) || 0;
          const arr = mrr * 12;

          // Determine metric label and value based on type
          let metricLabel = 'Revenue';
          let metricValue = fmtMoney(item.gross_revenue_annual || 0);
          
          if (isOps) {
            metricLabel = 'EBITDA';
            metricValue = ebitda > 0 ? fmtMoney(ebitda) : 'N/A';
          } else {
            if (mrr > 0) {
              metricLabel = 'ARR';
              metricValue = fmtMoney(arr);
            } else {
              metricLabel = 'Revenue';
              metricValue = fmtMoney(item.gross_revenue_annual || 0);
            }
          }

          // Generate badges from available data
          const badges: string[] = [];
          if (item.source_type === 'broker' || item.source_type === 'partner') {
            badges.push('Broker Listed');
          }
          if (item.ai_growth_score && item.ai_growth_score > 80) {
            badges.push('High Growth');
          }
          if (isOps && item.location_city) {
            badges.push('Prime Location');
          }
          if (!isOps && item.tech_stack && Array.isArray(item.tech_stack) && item.tech_stack.length > 0) {
            badges.push('Modern Stack');
          }
          // Fallback badges if none generated
          if (badges.length === 0) {
            badges.push('Verified', 'Active Listing');
          }

          return {
            id: String(item.id || ''),
            title: String(item.title || item.listing_title || 'Untitled'),
            category: String(item.category || item.subcategory || 'General'),
            type: isOps ? 'operational' : 'digital',
            price: fmtMoney(item.asking_price || 0),
            metricLabel,
            metricValue,
            locationOrModel: isOps 
              ? String(item.location_city || item.city || 'Location TBD')
              : (item.tech_stack && Array.isArray(item.tech_stack) && item.tech_stack.length > 0
                  ? item.tech_stack[0]
                  : 'Remote / Digital'),
            imageUrl: String(item.image_url || item.hero_image_url || '/images/placeholder.jpg'),
            badges: badges.slice(0, 2), // Limit to 2 badges
          };
        });
        
        setListings(mappedListings);
      }
      setLoading(false);
    }

    fetchListings();
  }, [track, supabase, searchParams, activeCategory]);

  // Determine if this is an AI search result
  const searchQuery = searchParams.get('q');
  const hasAISearch = !!searchQuery;
  const resultCount = listings.length;

  // Clear AI filters function
  function clearAIFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.delete('category');
    params.delete('location');
    params.delete('min_value');
    params.delete('is_verified');
    router.push(`/?${params.toString()}`, { scroll: false });
  }

  // Generate AI results summary text
  const getResultsSummary = () => {
    if (loading) return 'Loading...';
    
    if (hasAISearch) {
      return (
        <>
          <span className="font-semibold text-amber-600 dark:text-amber-400">AI found {resultCount} match{resultCount !== 1 ? 'es' : ''}</span>
          {' for '}
          <span className="font-semibold text-gray-900 dark:text-white">&quot;{searchQuery}&quot;</span>
          {resultCount === 0 && '. Try adjusting your search criteria.'}
        </>
      );
    }
    
    // Default text when no AI search
    if (activeCategory === "All Listings") {
      return `Showing ${resultCount} premium ${track === 'operational' ? 'operational' : 'digital'} opportunities.`;
    }
    
    return (
      <>
        Showing {resultCount} premium opportunities in{' '}
        <span className="font-semibold text-blue-600 dark:text-blue-400">{activeCategory}</span>.
      </>
    );
  };

  return (
    <section id="listings-section" className="w-full py-12 bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AI Results Summary - Positioned between Filter Pills and Grid */}
        {hasAIFilters && (
          <div className="mb-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {hasAISearch ? 'AI Search Results' : 'Filtered Results'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {getResultsSummary()}
                </p>
              </div>
              <Button
                onClick={clearAIFilters}
                variant="outline"
                size="sm"
                className="ml-4 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
              >
                <X className="w-4 h-4 mr-2" />
                Clear AI Filters
              </Button>
            </div>
          </div>
        )}
        
        {/* Default Header (when no AI filters) */}
        {!hasAIFilters && (
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Featured Acquisitions
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {getResultsSummary()}
              </p>
            </div>
            <a href="/listings" className="hidden md:block text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">View all listings &rarr;</a>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800">
             <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No listings found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {hasAISearch 
                ? `No results match "${searchQuery}". Try adjusting your search criteria.`
                : 'Try selecting a different category or adjusting your filters.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
