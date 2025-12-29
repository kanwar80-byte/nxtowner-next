"use client";


import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';


const FALLBACK_IMAGE =
  "https://nxtowner-public.s3.amazonaws.com/placeholders/listing-placeholder.webp";

export default function ListingCard(listing: any) {
  // V16 field mapping
  const {
    id,
    title,
    heroImageUrl,
    assetType,
    categoryLabel,
    city,
    province,
    country,
    askingPrice,
    revenueAnnual,
    cashFlowAnnual,
  } = listing;
  // Use nuqs to sync selectedIds in the URL
  const [selectedIds, setSelectedIds] = useQueryState(
    'selectedIds',
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const checked = selectedIds.includes(id);
  const handleCheckbox = (e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    setSelectedIds(
      checked ? selectedIds.filter((x: string) => x !== id) : [...selectedIds, id]
    );
  };

  // Compose location string
  const location = [city, province, country].filter(Boolean).join(", ") || "-";
  // Image fix: support both camelCase and snake_case
  const imageUrl = heroImageUrl || listing.hero_image_url || FALLBACK_IMAGE;
  return (
    <Link href={`/listing/${id}`} className="block group">
      <Card
        className={`overflow-hidden flex flex-col h-full transition-shadow hover:shadow-lg relative ${checked ? "ring-2 ring-blue-500" : ""}`}
      >
        <div className="relative aspect-video bg-muted flex items-center justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
            loading="lazy"
          />
          {/* Checkbox overlay in top-left */}
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={checked}
              onClick={handleCheckbox}
              onChange={handleCheckbox as any}
              aria-label="Select for comparison"
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge
              variant="outline"
              className={
                assetType === "Operational"
                  ? "bg-blue-100 text-blue-800 border-blue-200"
                  : "bg-purple-100 text-purple-800 border-purple-200"
              }
            >
              {assetType}
            </Badge>
            <Badge variant="secondary" className="bg-muted/80 text-xs px-2 py-0.5">
              {categoryLabel}
            </Badge>
          </div>
        </div>
        <div className="flex-1 flex flex-col px-4 py-3 gap-1">
          <div className="font-semibold text-base line-clamp-2 mb-1">{title}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4 mr-1 opacity-70" />
            {location}
          </div>
          {/* Revenue and Cash Flow badges */}
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Revenue: {revenueAnnual !== undefined ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(revenueAnnual) : '-'}
            </Badge>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Cash Flow: {cashFlowAnnual !== undefined ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cashFlowAnnual) : '-'}
            </Badge>
          </div>
        </div>
        <div className="px-4 pb-3 pt-1 mt-auto">
          <div className="font-bold text-lg text-primary">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(askingPrice)}
          </div>
        </div>
      </Card>
    </Link>
  );
}
