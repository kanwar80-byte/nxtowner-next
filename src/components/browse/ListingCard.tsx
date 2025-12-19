import { Listing } from '@/types/database';
import { CheckCircle, Globe, MapPin, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// --- 1. SMART IMAGE DICTIONARY ---
// If a user doesn't upload a photo, we use these based on the category.
const FALLBACK_IMAGES: Record<string, string> = {
  'SaaS': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80', // Laptop/Charts
  'E-commerce': 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80', // Boxes/Shipping
  'Agency': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80', // Meeting room
  'Content': 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80', // Typing/Blog
  'Marketplace': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80', // Busy connection
  'Operational': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80', // Factory/Machine
  'Restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80', // Cafe
  'Retail': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80', // Storefront
  'Logistics': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80', // Warehouse
  'Default': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80' // Skyscraper (General)
};

export default function ListingCard({ listing }: { listing: Listing }) {
  // Determine if digital by type/category
  const isDigital = listing.type === 'Digital' || (listing.category && listing.category.toLowerCase().includes('digital'));
  const cashFlowLabel = isDigital ? 'Net Profit' : 'Cash Flow (SDE)';
  const revenueLabel = isDigital ? 'Annual Revenue' : 'Gross Revenue';

  // Use meta?.image_url if present, else fallback by category
  const bgImage = (listing.meta && typeof listing.meta.image_url === 'string' && listing.meta.image_url)
    || (listing.category && FALLBACK_IMAGES[listing.category])
    || FALLBACK_IMAGES['Default'];

  return (
    <Link href={`/listing/${listing.id}`} className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col">
      
      {/* IMAGE HEADER */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img 
          src={bgImage} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
           <span className="bg-white/95 backdrop-blur text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-slate-200 uppercase tracking-wide">
             {listing.category || 'Business'}
           </span>
        </div>

        {listing.is_verified && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 border border-emerald-600/40">
            <CheckCircle size={10} className="text-white" /> VERIFIED
          </div>
        )}
      </div>

      {/* CONTENT BODY */}
      <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center text-xs text-slate-500 mb-3 gap-2">
            {isDigital ? <Globe size={12} className="text-blue-500"/> : <MapPin size={12} className="text-orange-500"/>}
            <span className="font-medium">{listing.location || 'Remote'}</span>
          </div>

        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {listing.title}
        </h3>

        {/* Spacer to push metrics to bottom */}
        <div className="flex-1"></div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-slate-100 pt-4 mt-2">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{revenueLabel}</p>
            <p className="text-sm font-bold text-slate-900">${listing.annual_revenue?.toLocaleString() ?? '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{cashFlowLabel}</p>
            <p className="text-sm font-bold text-emerald-500">${listing.annual_cashflow?.toLocaleString() ?? '-'}</p>
          </div>
          <div className="col-span-2 pt-2 flex items-center justify-between">
            <div>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Asking Price</p>
               <p className="text-xl font-extrabold text-slate-900">${listing.asking_price?.toLocaleString() ?? 'Contact'}</p>
            </div>
            {listing.nxt_score && (
               <div className="text-right">
                 <span className="bg-[#EAB308]/10 text-[#a16207] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-[#EAB308]/20">
                   <TrendingUp size={12} className="text-[#EAB308]" /> {listing.nxt_score}
                 </span>
               </div>
             )}
          </div>
        </div>
      </div>
    </Link>
  );
}
