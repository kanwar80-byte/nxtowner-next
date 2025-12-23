"use client";


import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Listing } from "@/types/listing";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';


const FALLBACK_IMAGE =
  "https://nxtowner-public.s3.amazonaws.com/placeholders/listing-placeholder.webp";

export default function ListingCard(listing: Listing) {
  const {
    id,
    title,
    hero_image_url,
    asset_type,
    category,
    city,
    province,
    asking_price,
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

  return (
    <Link href={`/deals/${id}`} className="block group">
      <Card
        className={`overflow-hidden flex flex-col h-full transition-shadow hover:shadow-lg relative ${checked ? "ring-2 ring-blue-500" : ""}`}
      >
        <div className="relative aspect-video bg-muted flex items-center justify-center">
          <img
            src={hero_image_url || FALLBACK_IMAGE}
            alt={title}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
            loading="lazy"
          />
          {/* Checkbox overlay in top-left */}
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={checked}
              onClick={handleCheckbox}
              onChange={handleCheckbox}
              aria-label="Select for comparison"
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge
              variant="outline"
              className={
                asset_type === "Operational"
                  ? "bg-blue-100 text-blue-800 border-blue-200"
                  : "bg-purple-100 text-purple-800 border-purple-200"
              }
            >
              {asset_type}
            </Badge>
            <Badge variant="secondary" className="bg-muted/80 text-xs px-2 py-0.5">
              {category}
            </Badge>
          </div>
        </div>
        <div className="flex-1 flex flex-col px-4 py-3 gap-1">
          <div className="font-semibold text-base line-clamp-2 mb-1">{title}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4 mr-1 opacity-70" />
            {city || "-"}, {province || "-"}
          </div>
        </div>
        <div className="px-4 pb-3 pt-1 mt-auto">
          <div className="font-bold text-lg text-primary">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(asking_price)}
          </div>
        </div>
      </Card>
    </Link>
  );
}
