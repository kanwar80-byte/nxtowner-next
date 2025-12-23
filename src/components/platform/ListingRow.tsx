"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

export default function ListingRow({ listing }: { listing: any }) {
  const router = useRouter();
  
  // FIX: Added .withDefault([]) to prevent "Cannot read length of null"
  const [selectedIds, setSelectedIds] = useQueryState(
    'selectedIds',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const isChecked = selectedIds.includes(listing.id);

  const handleCheckbox = (checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, listing.id]);
    } else {
      setSelectedIds(selectedIds.filter(id => id !== listing.id));
    }
  };

  const revenueMultiple = listing.asking_price && listing.gross_revenue 
    ? (listing.asking_price / listing.gross_revenue).toFixed(2) + 'x'
    : "-";

  return (
    <div 
      className={cn(
        "flex items-center gap-6 px-4 py-4 border-b hover:bg-slate-50 transition-colors cursor-pointer group",
        isChecked && "bg-blue-50/50 border-blue-100"
      )}
      onClick={() => router.push(`/platform/deals/${listing.id}`)}
    >
      {/* Selection & Thumbnail */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={isChecked} 
            onCheckedChange={handleCheckbox} 
          />
        </div>
        <div className="relative w-24 h-16 rounded overflow-hidden bg-gray-100 border">
          {listing.hero_image_url ? (
            <Image 
              src={listing.hero_image_url} 
              alt={listing.title} 
              fill 
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
      </div>

      {/* Info Core */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm text-slate-900 truncate">{listing.title}</h3>
        <p className="text-xs text-slate-500">{listing.city}, {listing.province}</p>
        {listing.ai_analysis?.executive_summary && (
          <p className="text-xs mt-1 text-slate-600 line-clamp-1 italic">
            "{listing.ai_analysis.executive_summary}"
          </p>
        )}
      </div>

      {/* High-Density Metrics Block */}
      <div className="grid grid-cols-4 gap-4 min-w-[320px] text-right">
        <div>
          <p className="text-[10px] uppercase text-slate-400 font-semibold">Price</p>
          <p className="text-sm font-bold text-slate-900">${listing.asking_price?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-slate-400 font-semibold">EBITDA</p>
          <p className="text-sm font-medium text-slate-700">${listing.ebitda?.toLocaleString() || "-"}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-slate-400 font-semibold">Multiple</p>
          <p className="text-sm font-medium text-blue-600">{revenueMultiple}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-slate-400 font-semibold">AI Growth</p>
          {listing.ai_analysis?.growth_score ? (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0 h-5">
              {listing.ai_analysis.growth_score}
            </Badge>
          ) : (
            <span className="text-sm text-slate-400">-</span>
          )}
        </div>
      </div>
    </div>
  );
}