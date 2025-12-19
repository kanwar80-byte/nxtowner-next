import { Listing } from '@/types/database';
import { CheckCircle, Globe, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ListingCard({ listing }: { listing: Listing }) {
  // Determine if we show "SDE" (Operational) or "EBITDA/Profit"
  const isDigital = listing.asset_type === 'Digital';
  const cashFlowLabel = isDigital ? 'Net Profit' : 'Cash Flow (SDE)';
  const revenueLabel = isDigital ? 'Annual Revenue' : 'Gross Revenue';

  return (
    <Link href={`/listing/${listing.id}`} className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
      
      {/* IMAGE HEADER */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img 
          src={listing.metrics?.image_url as string || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-3 left-3 flex gap-2">
           <span className="bg-white/90 backdrop-blur text-slate-800 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-slate-200">
             {listing.sub_category || listing.main_category || 'Business'}
           </span>
        </div>
        {listing.is_ai_verified && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
            <CheckCircle size={10} /> VERIFIED
          </div>
        )}
      </div>

      {/* CONTENT BODY */}
      <div className="p-5">
        <div className="flex items-center text-xs text-slate-500 mb-2 gap-2">
           {isDigital ? <Globe size={12} /> : <MapPin size={12} />}
           <span>{listing.location || 'Remote'}</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {listing.title}
        </h3>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-slate-100 pt-4">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{revenueLabel}</p>
            <p className="text-sm font-bold text-slate-900">${listing.annual_revenue?.toLocaleString() ?? '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{cashFlowLabel}</p>
            <p className="text-sm font-bold text-green-600">${listing.annual_cashflow?.toLocaleString() ?? '-'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Asking Price</p>
            <p className="text-lg font-extrabold text-slate-900">${listing.asking_price?.toLocaleString() ?? 'Contact'}</p>
          </div>
          <div className="flex items-end justify-end">
             {listing.nxt_score && (
               <div className="text-right">
                 <span className="text-[10px] font-bold text-slate-400 block">NXT SCORE</span>
                 <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-1.5 py-0.5 rounded">
                   {listing.nxt_score}/100
                 </span>
               </div>
             )}
          </div>
        </div>
      </div>
    </Link>
  );
}
