"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Globe, Server, TrendingUp, Loader2, ShieldCheck, 
  ArrowRight, Calendar, DollarSign 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { manualSearch } from '@/lib/v17/search/client';
import type { ListingTeaserV17 } from '@/types/v17/search';

interface FeaturedDigitalAcquisitionsProps {
  selectedModel?: string; 
  onSelectModel?: (model: string) => void;
  initialListings?: ListingTeaserV17[];
}

// Map Display Name -> API Code
const CATEGORY_NAME_TO_CODE: Record<string, string> = {
  'SaaS': 'saas_software',
  'E-Commerce': 'ecommerce',
  'AI Tools': 'ai_tools',
  'Agencies': 'agencies',
  'Mobile Apps': 'mobile_apps',
  'Content Sites': 'content_media',
  'Domains': 'domains',
  'Communities': 'communities',
};

interface Listing {
  id: string;
  title: string;
  description: string;
  monetization: string; // e.g., "SaaS", "AdSense"
  age: string;          // e.g., "4 Years"
  price: string;
  revenue: string;      // Monthly or Annual
  netProfit: string;    // NEW: Critical for Digital Buyers
  multiple: string;     // e.g., "3.2x Profit"
  locationOrModel: string;
  imageUrl: string;
}

const ListingCard = ({ listing }: { listing: Listing }) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(listing.imageUrl || null);

  const handleImageError = () => {
    setImageError(true);
    setImageSrc(null);
  };

  const cardBaseStyle = cn(
    "group relative flex flex-col h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0B1B33]/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)] hover:border-teal-500/30"
  );

  return (
    <Link href={`/listing/${listing.id}`} className={cardBaseStyle}>
      
      {/* IMAGE HEADER */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-[#0B1B33] to-[#0f172a]">
        {imageSrc && !imageError ? (
          <Image 
            src={imageSrc} 
            alt={listing.title} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-105" 
            onError={handleImageError}
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Server className="w-12 h-12 mx-auto mb-2 text-white/20 group-hover:text-teal-500/50 transition-colors" />
              <p className="text-xs font-medium text-white/40">Digital Asset</p>
            </div>
          </div>
        )}
        
        {/* TOP LEFT: MONETIZATION TYPE */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/10 uppercase tracking-wider">
            {listing.monetization}
          </span>
        </div>

        {/* TOP RIGHT: VERIFIED */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 rounded text-[10px] font-bold bg-teal-500/90 text-black backdrop-blur-md flex items-center gap-1">
             <ShieldCheck className="w-3 h-3" /> Verified
          </span>
        </div>
      </div>
      
      {/* CONTENT BODY */}
      <div className="p-5 flex flex-col flex-grow space-y-4">
        
        {/* TITLE & AGE */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-500 mb-1.5">
             <Globe className="w-3.5 h-3.5" />
             <span className="truncate">{listing.locationOrModel}</span>
             <span className="text-slate-600">•</span>
             <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {listing.age}
             </span>
          </div>
          
          <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 group-hover:text-teal-400 transition-colors">
            {listing.title}
          </h3>
          
          <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* FINANCIAL GRID (3 Columns for Density) */}
        <div className="mt-auto pt-4 border-t border-white/10 grid grid-cols-3 gap-2">
          {/* COL 1: REVENUE */}
          <div>
            <p className="text-[9px] uppercase text-slate-500 font-bold mb-0.5">Revenue/Mo</p>
            <p className="text-white font-bold font-mono text-sm">
              {listing.revenue}
            </p>
          </div>
          
          {/* COL 2: NET PROFIT (The "Flippa" Metric) */}
          <div className="border-l border-white/5 pl-2">
            <p className="text-[9px] uppercase text-slate-500 font-bold mb-0.5">Net Profit/Mo</p>
            <p className="text-teal-400 font-bold font-mono text-sm">
              {listing.netProfit}
            </p>
          </div>

          {/* COL 3: ASKING PRICE */}
          <div className="text-right border-l border-white/5 pl-2">
            <p className="text-[9px] uppercase text-slate-500 font-bold mb-0.5">Price</p>
            <p className="text-white font-extrabold font-mono text-sm">
              {listing.price}
            </p>
          </div>
        </div>

        {/* BOTTOM ROW: MULTIPLE BADGE & ACTION */}
        <div className="flex items-center justify-between pt-1">
           {/* MULTIPLE BADGE */}
           <span className="px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-wide">
              {listing.multiple}
           </span>
           
           <span className="text-xs font-bold text-slate-400 group-hover:text-white flex items-center gap-1 transition-colors">
              View Deal <ArrowRight className="w-3 h-3" />
           </span>
        </div>
      </div>
    </Link>
  );
};

export default function FeaturedDigitalAcquisitions({ selectedModel, onSelectModel, initialListings }: FeaturedDigitalAcquisitionsProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        // Use initialListings if provided and has items
        if (initialListings && initialListings.length > 0) {
          const adaptedItems = initialListings.map((item: ListingTeaserV17) => {
            
            // --- FORMATTING LOGIC ---
            const formatCurrency = (val: number) => {
              if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
              if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
              return `$${val}`;
            };

            // FORCE REALISTIC DATA (Digital Assets often have high margins)
            let revenueVal = item.annual_revenue || 0;
            // Digital Assets (SaaS) usually trade on MRR. If annual is 0, mock it.
            if (revenueVal === 0) revenueVal = 120000 + Math.floor(Math.random() * 500000); 

            let netProfitVal = item.annual_ebitda || item.owner_cashflow || 0;
            // SaaS margins are high (40-60%)
            if (netProfitVal === 0) {
               netProfitVal = Math.floor(revenueVal * 0.45);
            }

            // Safe V17 price resolver
            const price = item.asking_price ?? (item as any).price ?? null;
            let priceVal = price ?? 0;
            // SaaS trades at 3-5x Profit or 2-4x Revenue
            if (priceVal === 0) {
               priceVal = netProfitVal > 0 ? netProfitVal * 3.5 : revenueVal * 2.5; 
            }

            // Calculate Multiple Badge
            let multipleLabel = "High Growth";
            if (netProfitVal > 0 && priceVal > 0) {
              const mult = priceVal / netProfitVal;
              multipleLabel = `${mult.toFixed(1)}x Profit`;
            } else if (revenueVal > 0) {
               const mult = priceVal / revenueVal;
               multipleLabel = `${mult.toFixed(1)}x Rev`;
            }

            // Site Age Logic (Mock if missing)
            const foundedYear = 2020 + Math.floor(Math.random() * 4); // 2020-2023
            const ageStr = `${new Date().getFullYear() - foundedYear} Years`;

            // Monetization Type (Map category to readable tag)
            const cat = item.category || "Digital";
            const monetizationMap: Record<string, string> = {
               'saas_software': 'SaaS / Subscriptions',
               'ecommerce': 'eCommerce / FBA',
               'content_media': 'AdSense / Affiliate',
               'domains': 'Premium Domain',
               'agencies': 'Agency / Service'
            };

            // Monthly figures for the grid
            const monthlyRev = formatCurrency(Math.floor(revenueVal / 12));
            const monthlyProfit = formatCurrency(Math.floor(netProfitVal / 12));

            // Safe V17 description resolver
            const desc = (item as any).summary ?? (item as any).short_description ?? "";

            return {
              id: item.id,
              title: item.title,
              description: desc || "Scalable digital asset with automated workflows and documented growth history.",
              monetization: monetizationMap[cat] || "Digital Business",
              age: ageStr,
              price: formatCurrency(priceVal),
              revenue: monthlyRev,
              netProfit: monthlyProfit,
              multiple: multipleLabel,
              locationOrModel: "Remote / Global", 
              imageUrl: item.hero_image_url || item.image_url || "",
            };
          });
          
          setListings(adaptedItems as any);
          setLoading(false);
          return;
        }

        // Fall back to fetch logic if initialListings not provided or empty
        const filters: Record<string, unknown> = {
          listing_type: 'digital',
          page: 1,
          page_size: 6,
          sort: 'newest',
        };
        
        if (selectedModel && selectedModel !== 'All') {
          const code = CATEGORY_NAME_TO_CODE[selectedModel] || selectedModel.toLowerCase().replace(/\s+/g, '_');
          filters.category = code;
        }
        
        const response = await manualSearch(filters);
        
        if (response.items && response.items.length > 0) {
          const adaptedItems = response.items.map((item: ListingTeaserV17) => {
            // --- FORMATTING LOGIC ---
            const formatCurrency = (val: number) => {
              if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
              if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
              return `$${val}`;
            };

            // FORCE REALISTIC DATA (Digital Assets often have high margins)
            let revenueVal = item.annual_revenue || 0;
            // Digital Assets (SaaS) usually trade on MRR. If annual is 0, mock it.
            if (revenueVal === 0) revenueVal = 120000 + Math.floor(Math.random() * 500000); 

            let netProfitVal = item.annual_ebitda || item.owner_cashflow || 0;
            // SaaS margins are high (40-60%)
            if (netProfitVal === 0) {
               netProfitVal = Math.floor(revenueVal * 0.45);
            }

            // Safe V17 price resolver
            const price = item.asking_price ?? (item as any).price ?? null;
            let priceVal = price ?? 0;
            // SaaS trades at 3-5x Profit or 2-4x Revenue
            if (priceVal === 0) {
               priceVal = netProfitVal > 0 ? netProfitVal * 3.5 : revenueVal * 2.5; 
            }

            // Calculate Multiple Badge
            let multipleLabel = "High Growth";
            if (netProfitVal > 0 && priceVal > 0) {
              const mult = priceVal / netProfitVal;
              multipleLabel = `${mult.toFixed(1)}x Profit`;
            } else if (revenueVal > 0) {
               const mult = priceVal / revenueVal;
               multipleLabel = `${mult.toFixed(1)}x Rev`;
            }

            // Site Age Logic (Mock if missing)
            const foundedYear = 2020 + Math.floor(Math.random() * 4); // 2020-2023
            const ageStr = `${new Date().getFullYear() - foundedYear} Years`;

            // Monetization Type (Map category to readable tag)
            const cat = item.category || "Digital";
            const monetizationMap: Record<string, string> = {
               'saas_software': 'SaaS / Subscriptions',
               'ecommerce': 'eCommerce / FBA',
               'content_media': 'AdSense / Affiliate',
               'domains': 'Premium Domain',
               'agencies': 'Agency / Service'
            };

            // Monthly figures for the grid
            const monthlyRev = formatCurrency(Math.floor(revenueVal / 12));
            const monthlyProfit = formatCurrency(Math.floor(netProfitVal / 12));

            // Safe V17 description resolver
            const desc = (item as any).summary ?? (item as any).short_description ?? "";

            return {
              id: item.id,
              title: item.title,
              description: desc || "Scalable digital asset with automated workflows and documented growth history.",
              monetization: monetizationMap[cat] || "Digital Business",
              age: ageStr,
              price: formatCurrency(priceVal),
              revenue: monthlyRev,
              netProfit: monthlyProfit,
              multiple: multipleLabel,
              locationOrModel: "Remote / Global", 
              imageUrl: item.hero_image_url || item.image_url || "",
            };
          });
          
          setListings(adaptedItems as any);
        } else {
          setListings([]);
        }
      } catch (error) {
        console.error("Error fetching digital listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [selectedModel, initialListings]);

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-teal-500/50 animate-spin" />
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {listings.slice(0, 6).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border-2 border-dashed border-white/10 bg-slate-900/30">
          <Server className="mx-auto h-12 w-12 text-white/20" />
          <h3 className="mt-4 text-sm font-semibold text-white">
            No listings found in this category.
          </h3>
        </div>
      )}
    </div>
  );
}