// src/components/browse/ListingGrid.tsx
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, TrendingUp, ShieldCheck, BarChart3 } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  location: string;
  asking_price: number;
  cashflow_sde: number;
  revenue: number;
  asset_type: string;
  main_category: string;
  category: string;
  is_verified: boolean;
  is_ai_verified: boolean;
  cover_image_url?: string;
}

interface ListingGridProps {
  listings: Listing[];
}

export default function ListingGrid({ listings }: ListingGridProps) {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
      notation: "compact", 
      compactDisplay: "short"
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Link 
          href={`/listings/${listing.id}`} 
          key={listing.id}
          className="group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full"
        >
          {/* --- TOP: IMAGE & BADGES --- */}
          <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
            {listing.cover_image_url ? (
               <Image 
                 src={listing.cover_image_url} 
                 alt={listing.title}
                 fill
                 className="object-cover group-hover:scale-105 transition-transform duration-500"
               />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
                 <div className="text-4xl font-light text-gray-300 mb-2">
                    {listing.asset_type === 'digital' ? '💻' : '🏢'}
                 </div>
                 <span className="text-xs font-medium uppercase tracking-wide">No Preview</span>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
               <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm border border-gray-100">
                 {listing.category}
               </span>
            </div>

            {/* Verified Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
              {listing.is_verified && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                </span>
              )}
              {listing.is_ai_verified && (
                <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center uppercase tracking-wider">
                  AI Vetted
                </span>
              )}
            </div>
          </div>

          {/* --- MIDDLE: INFO & METRICS --- */}
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
              {listing.title}
            </h3>
            
            <div className="flex items-center text-gray-500 text-xs mb-5">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {listing.location || 'Remote'}
              <span className="mx-2">•</span>
              <span className="capitalize">{listing.asset_type} Asset</span>
            </div>

            {/* Financial Grid (Flippa Style) */}
            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-0.5">Revenue</span>
                <span className="text-sm font-bold text-gray-900 flex items-center">
                  <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                  {listing.revenue ? formatCurrency(listing.revenue) : '-'}
                  <span className="text-[10px] text-gray-400 font-normal ml-0.5">/yr</span>
                </span>
              </div>
              <div className="flex flex-col border-l border-gray-200 pl-3">
                <span className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold mb-0.5">Profit (SDE)</span>
                <span className="text-sm font-bold text-green-600 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                  {listing.cashflow_sde ? formatCurrency(listing.cashflow_sde) : '-'}
                  <span className="text-[10px] text-gray-400 font-normal ml-0.5">/yr</span>
                </span>
              </div>
            </div>
          </div>

          {/* --- BOTTOM: PRICE --- */}
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Asking Price</p>
              <p className="text-xl font-bold text-blue-900">
                {formatCurrency(listing.asking_price)}
              </p>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
              View Details &rarr;
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}