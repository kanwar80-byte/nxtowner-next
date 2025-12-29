"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

export default function ListingRow({ listing }: { listing: {
  id: string;
  title: string;
  hero_image_url?: string | null;
  asking_price?: number | null;
  revenue_annual?: number | null;
  cash_flow?: number | null;
  city?: string | null;
  province?: string | null;
  [key: string]: any;
} }) {
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

  // Use both snake_case and camelCase for image, fallback to placeholder
  const img = listing.hero_image_url || listing.heroImageUrl || "/images/placeholder.jpg";

  return (
    <div 
      className={cn(
        "flex items-center gap-6 px-4 py-4 border-b hover:bg-slate-50 transition-colors cursor-pointer group",
        isChecked && "bg-blue-50/50 border-blue-100"
      )}
      onClick={() => router.push(`/listing/${listing.id}`)}
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
            <Image 
              src={img}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        </div>

      {/* High-Density Metrics Block */}
      <div className="grid grid-cols-4 gap-4 min-w-[320px] text-right">
        <div>
          <p className="text-[10px] uppercase text-slate-400 font-semibold">Price</p>
          <p className="text-sm font-bold text-slate-900">{listing.asking_price !== undefined && listing.asking_price !== null ? new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(listing.asking_price) : '-'}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-slate-400 font-semibold">Revenue</p>
          <p className="text-sm font-medium text-slate-700">{listing.revenue_annual !== undefined && listing.revenue_annual !== null ? new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(listing.revenue_annual) : '-'}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-slate-400 font-semibold">Cash Flow</p>
          <p className="text-sm font-medium text-blue-600">{listing.cash_flow !== undefined && listing.cash_flow !== null ? new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(listing.cash_flow) : '-'}</p>
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