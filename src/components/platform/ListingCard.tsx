"use client";

import Link from "next/link";
import { MapPin, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ListingCard({ listing }: { listing: any }) {
  // 1. SMART LOGIC: Determine Type and Metric
  const isDigital = listing.deal_type === 'digital';
  const metricLabel = isDigital ? "MRR" : "EBITDA";
  // The Fix: Always look at cash_flow for Operational deals
  const metricValue = isDigital ? listing.mrr : listing.cash_flow;

  const fmtMoney = (val: number) => {
    if (val === null || val === undefined) return "N/A";
    return new Intl.NumberFormat('en-CA', { 
      style: 'currency', currency: 'CAD', maximumFractionDigits: 0, notation: "compact" 
    }).format(val);
  };

  return (
    <Link href={`/listing/${listing.id}`} className="block group h-full">
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-500 transition-all shadow-lg h-full flex flex-col">
        <div className="relative h-48 w-full bg-slate-800">
          <img src={listing.image_url || '/images/placeholder.jpg'} alt={listing.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
          <div className="absolute top-3 right-3">
            <Badge className={`${listing.ai_growth_score > 80 ? 'bg-green-500' : 'bg-yellow-500'} text-black font-bold border-none`}>
               AI SCORE: {listing.ai_growth_score || 'N/A'}
            </Badge>
          </div>
          <div className="absolute bottom-3 right-3">
             <div className="bg-slate-950/90 text-white px-3 py-1 rounded text-sm font-bold shadow-sm border border-slate-700">
              {fmtMoney(listing.asking_price)}
            </div>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-blue-400">{listing.title}</h3>
          <p className="text-xs text-slate-500 mb-4">{isDigital ? "Founder Direct" : "Partner Broker"}</p>
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              {isDigital ? <Globe className="w-3.5 h-3.5 text-teal-500"/> : <MapPin className="w-3.5 h-3.5 text-amber-500"/>}
              {isDigital ? "Global" : (listing.location_province || "Ontario")}
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{metricLabel}</p>
              <p className="text-sm font-bold text-emerald-400">{fmtMoney(metricValue)}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
