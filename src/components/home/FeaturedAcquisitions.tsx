"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Globe, TrendingUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { manualSearch } from '@/lib/v17/search/client';
import { mapV17ToGridListings } from '@/lib/v17/mappers';
import type { ListingTeaserV17 } from '@/lib/v17/types';

// Digital category chips
const DIGITAL_CATEGORIES = [
  'All Digital',
  'SaaS',
  'E-Commerce',
  'AI Tools',
  'Content Sites',
];

interface Listing {
  id: string;
  title: string;
  category: string;
  type: 'operational' | 'digital';
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
  const cardBaseStyle = cn(
    "group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1",
    "border bg-white dark:bg-zinc-900",
    "border-gray-100 dark:border-zinc-800/50 shadow-sm hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] hover:border-cyan-500/30"
  );

  const accentTextColor = "text-cyan-700 dark:text-cyan-500";
  const badgeBgColor = "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800";
  const LocationIcon = Globe;

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

export default function FeaturedAcquisitions() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Digital');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch listings on mount and when category changes
  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      
      try {
        const filters: Record<string, unknown> = {
          listing_type: 'digital',
          page: 1,
          page_size: 6,
          sort: 'newest',
        };
        
        // Only add category if not "All Digital"
        if (selectedCategory !== 'All Digital') {
          filters.category = selectedCategory;
        }
        
        const response = await manualSearch(filters);
        
        if (response.items && response.items.length > 0) {
          // Convert ListingTeaserV17 from @/types/v17/search to format expected by mapper
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
            hero_image_url: null,
          }));
          
          // Map adapted items to Listing format
          const mappedListings = mapV17ToGridListings(adaptedItems as any);
          setListings(mappedListings);
        } else {
          setListings([]);
        }
      } catch (error: any) {
        console.error("Error fetching featured acquisitions:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [selectedCategory]);

  // Build "View all listings" URL
  const getViewAllUrl = () => {
    if (selectedCategory === 'All Digital') {
      return '/search?listing_type=digital';
    }
    return `/search?listing_type=digital&category=${encodeURIComponent(selectedCategory)}`;
  };

  return (
    <section className="w-full py-12 bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with chips */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Featured Digital Acquisitions
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Curated digital deals — SaaS, e-commerce, AI tools, and content assets.
              </p>
            </div>
            <Link 
              href={getViewAllUrl()}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 whitespace-nowrap"
            >
              View all listings &rarr;
            </Link>
          </div>
          
          {/* Category Chips */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            {DIGITAL_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
                  selectedCategory === category
                    ? "bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.slice(0, 6).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800">
            <Globe className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No listings found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try selecting a different category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}


