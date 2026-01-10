"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Monitor, Bookmark, BookmarkCheck, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { toggleSaved, isSaved as checkIsSaved } from "@/lib/buyer/savedListings";
import type { ListingTeaserV17 } from "@/lib/v17/types";

interface ListingCardProps {
  listing: ListingTeaserV17 & {
    summary?: string | null;
    short_description?: string | null;
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  // Check saved status on mount
  useEffect(() => {
    setIsSaved(checkIsSaved(listing.id));
  }, [listing.id]);

  // Determine asset type and theme
  const assetType = listing.asset_type;
  const isRealWorld = assetType === "operational"; // AssetTypeV17 uses "operational", not "real_world"
  const isDigital = assetType === "digital";

  // Theme colors
  const themeColor = isRealWorld ? "amber" : isDigital ? "teal" : "slate";
  const themeClasses = {
    amber: {
      accent: "text-amber-500",
      accentBg: "bg-amber-500",
      accentHover: "hover:bg-amber-600",
      accentBgLight: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    teal: {
      accent: "text-teal-400",
      accentBg: "bg-teal-400",
      accentHover: "hover:bg-teal-500",
      accentBgLight: "bg-teal-400/10",
      border: "border-teal-400/20",
    },
    slate: {
      accent: "text-slate-400",
      accentBg: "bg-slate-500",
      accentHover: "hover:bg-slate-600",
      accentBgLight: "bg-slate-500/10",
      border: "border-slate-500/20",
    },
  };
  const theme = themeClasses[themeColor];

  // Asset type icon
  const AssetIcon = isRealWorld ? Briefcase : isDigital ? Monitor : Briefcase;

  // Status badge logic
  const getStatusBadge = () => {
    const status = listing.status?.toLowerCase();
    const createdDate = new Date(listing.created_at);
    const now = new Date();
    const daysSinceCreation = Math.floor(
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceCreation <= 7 && status === "teaser") {
      return { label: "New", color: "bg-orange-600" };
    }
    if (status === "published") {
      return { label: "Verified", color: "bg-green-600" };
    }
    if (status === "under_offer" || status === "under_nda") {
      return { label: "Under Offer", color: "bg-blue-600" };
    }
    return null;
  };

  const statusBadge = getStatusBadge();

  // Format currency
  const formatCurrency = (value: number | null | undefined): string => {
    if (!value && value !== 0) return "-";
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  // Calculate multiple
  const calculateMultiple = (): string => {
    if (
      !listing.asking_price ||
      !listing.revenue_annual ||
      listing.revenue_annual === 0
    ) {
      return "-";
    }
    return (listing.asking_price / listing.revenue_annual).toFixed(1) + "x";
  };

  // Location/Type string
  const getLocationType = (): string => {
    if (isRealWorld) {
      const parts: string[] = [];
      if (listing.city) parts.push(listing.city);
      if (listing.province) parts.push(listing.province);
      return parts.length > 0 ? parts.join(", ") : "Location TBD";
    }
    if (isDigital) {
      return "Digital Asset";
    }
    return "Asset";
  };

  // Description/Teaser
  const description =
    listing.short_description || listing.summary || "No description available.";

  // Handle save toggle
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggleSaved(listing.id);
    setIsSaved(nowSaved);
  };

  // Image URL with fallback
  const imageUrl = listing.hero_image_url || "/images/placeholder.jpg";

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group block transition-all hover:scale-[1.01]"
    >
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#050505] transition-all hover:border-slate-600 hover:shadow-2xl">
        {/* HORIZONTAL LAYOUT */}
        <div className="flex flex-row">
          {/* IMAGE SECTION (30% width) */}
          <div className="relative w-[30%] min-w-[200px] aspect-[4/3] overflow-hidden bg-slate-900">
            <Image
              src={imageUrl}
              alt={listing.title || "Listing"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 30vw"
              priority={false}
            />

            {/* Status Badge Overlay (Top-Left) */}
            {statusBadge && (
              <div className="absolute top-3 left-3 z-10">
                <Badge
                  className={`${statusBadge.color} text-white hover:${statusBadge.color} border-none px-2.5 py-1 uppercase tracking-wider text-[10px] font-bold shadow-lg`}
                >
                  {statusBadge.label}
                </Badge>
              </div>
            )}

            {/* Asset Type Icon Overlay (Top-Right) */}
            <div
              className={`absolute top-3 right-3 z-10 p-2 rounded-lg ${theme.accentBgLight} ${theme.border} border backdrop-blur-sm`}
            >
              <AssetIcon className={`w-4 h-4 ${theme.accent}`} />
            </div>
          </div>

          {/* CONTENT SECTION (70% width) */}
          <div className="flex-1 flex flex-col p-6">
            {/* Header */}
            <div className="mb-3">
              <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:underline transition-all">
                {listing.title || "Untitled Listing"}
              </h3>
              <p className="text-sm text-slate-400 flex items-center gap-1">
                <span>{getLocationType()}</span>
                {listing.province && (
                  <>
                    <span>•</span>
                    <span>{listing.province}</span>
                  </>
                )}
              </p>
            </div>

            {/* The Hook (Teaser) */}
            <p className="text-sm text-slate-300 mb-4 line-clamp-2 flex-1">
              {description}
            </p>

            {/* The Money Row (Key Metrics) */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Revenue */}
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                <p className="text-[10px] uppercase text-slate-500 font-semibold mb-1 tracking-wider">
                  TTM Revenue
                </p>
                <p
                  className={`text-lg font-bold ${theme.accent} font-mono tabular-nums`}
                >
                  {formatCurrency(listing.revenue_annual)}
                </p>
              </div>

              {/* Cash Flow / EBITDA */}
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                <p className="text-[10px] uppercase text-slate-500 font-semibold mb-1 tracking-wider">
                  {isRealWorld ? "SDE/EBITDA" : "Cash Flow"}
                </p>
                <p
                  className={`text-lg font-bold ${theme.accent} font-mono tabular-nums`}
                >
                  {formatCurrency(listing.cash_flow)}
                </p>
              </div>

              {/* Multiple */}
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                <p className="text-[10px] uppercase text-slate-500 font-semibold mb-1 tracking-wider">
                  Asking Multiple
                </p>
                <p
                  className={`text-lg font-bold ${theme.accent} font-mono tabular-nums`}
                >
                  {calculateMultiple()}
                </p>
              </div>
            </div>

            {/* Footer / CTA */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <Button
                className={`${theme.accentBg} text-white ${theme.accentHover} shadow-lg font-semibold flex items-center gap-2`}
                size="sm"
              >
                <Eye className="w-4 h-4" />
                View Deal
              </Button>

              {/* Save/Watch Button */}
              <button
                onClick={handleSave}
                className={`p-2 rounded-lg border transition-all ${
                  isSaved
                    ? `${theme.accentBg} ${theme.border} text-white`
                    : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                }`}
                aria-label={isSaved ? "Remove from saved" : "Save listing"}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Default export for backward compatibility
export default ListingCard;
