"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Deal } from "@/types/deal";
// Date formatting helper
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

interface DealHeaderProps {
  deal: Deal;
}

export default function DealHeader({ deal }: DealHeaderProps) {
  const statusLabels: Record<string, string> = {
    discovery: "Discovery",
    nda_signed: "NDA Signed",
    diligence: "Diligence",
    financing: "Financing",
    offer: "Offer",
    closing: "Closing",
    closed: "Closed",
    cancelled: "Cancelled",
  };

  const statusColors: Record<string, string> = {
    discovery: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    nda_signed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    diligence: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    financing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    offer: "bg-green-500/10 text-green-400 border-green-500/20",
    closing: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    closed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <Card className="border-slate-800 bg-[#0B1221]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Back link */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            {/* Title and listing link */}
            <div className="flex items-start gap-3 mb-4">
              <h1 className="text-2xl font-bold text-white">
                Deal Workspace
              </h1>
              {deal.listing && (
                <Link
                  href={`/browse?listing=${deal.listing_id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors mt-1"
                >
                  View Listing
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

            {/* Listing title */}
            {deal.listing?.title && (
              <p className="text-lg text-slate-300 mb-4">
                {deal.listing.title}
              </p>
            )}

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Status:</span>
                <Badge
                  variant="outline"
                  className={statusColors[deal.status] || statusColors.discovery}
                >
                  {statusLabels[deal.status] || deal.status}
                </Badge>
              </div>

              {deal.listing?.asking_price && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Asking Price:</span>
                  <span className="text-slate-200 font-semibold">
                    ${deal.listing.asking_price.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Created:</span>
                <span className="text-slate-200">
                  {formatDate(deal.created_at)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Deal ID:</span>
                <span className="text-slate-500 font-mono text-xs">
                  {deal.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>

          {/* Hero image thumbnail (if available) */}
          {deal.listing?.hero_image_url && (
            <div className="shrink-0">
              <img
                src={deal.listing.hero_image_url}
                alt={deal.listing.title || "Listing"}
                className="w-32 h-32 object-cover rounded-lg border border-slate-800"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
