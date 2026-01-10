"use client";

import Link from "next/link";
import { Briefcase, ExternalLink, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Platform Nav Component
 * 
 * Contextual navigation component for deal-related, seller, and trust navigation links.
 * 
 * Usage:
 *   <Nav dealId={dealId} isSeller={true} /> // When viewing a deal as a seller
 *   <Nav dealId={dealId} /> // When viewing a deal
 *   <Nav isSeller={true} /> // For seller navigation only
 *   <Nav showTrust={true} /> // Show trust link
 *   <Nav /> // No navigation shown
 */
interface NavProps {
  /**
   * Deal ID to link to deal workspace
   * If not provided, deal workspace link is not rendered
   */
  dealId?: string;
  /**
   * Optional listing ID for related context
   */
  listingId?: string;
  /**
   * Whether user is a seller (shows seller dashboard link)
   */
  isSeller?: boolean;
  /**
   * Whether to show trust & verification link (useful for seller context)
   */
  showTrust?: boolean;
}

export default function Nav({ dealId, listingId, isSeller = false, showTrust = false }: NavProps) {
  // Only render if we have contextual data, seller context, or trust context
  if (!dealId && !listingId && !isSeller && !showTrust) {
    return null;
  }

  return (
    <nav className="flex items-center gap-3 text-sm">
      {isSeller && (
        <Link href="/seller/dashboard">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Seller Dashboard
            <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
          </Button>
        </Link>
      )}
      {(isSeller || showTrust) && (
        <Link href="/trust/verification">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            Trust
            <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
          </Button>
        </Link>
      )}
      {dealId && (
        <Link href={`/deal/${dealId}`}>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Deal Workspace
            <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
          </Button>
        </Link>
      )}
    </nav>
  );
}
