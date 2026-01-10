"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { SellerDashboardData } from "@/types/sellerDashboard";
import SellerKpis from "./SellerKpis";
import ListingHealthCard from "./ListingHealthCard";
import AiValuationBand from "./AiValuationBand";
import DataCompletenessChecklist from "./DataCompletenessChecklist";
import BuyerSignals from "./BuyerSignals";

interface SellerDashboardShellProps {
  dashboardData: SellerDashboardData;
}

export default function SellerDashboardShell({ dashboardData }: SellerDashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 pt-24">
      <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Seller Dashboard</h1>
          <p className="text-slate-400">
            Track your listings performance and optimize for better results
          </p>
        </div>

        {/* KPIs */}
        <SellerKpis kpis={dashboardData.kpis} />

        {/* Listings Grid */}
        {dashboardData.listings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {dashboardData.listings.map((listing) => (
              <div
                key={listing.id}
                className="space-y-6 p-6 bg-[#0B1221] border border-slate-800 rounded-xl"
              >
                {/* Listing Header */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">{listing.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    {listing.askingPrice && (
                      <span className="font-semibold text-slate-300">
                        ${listing.askingPrice.toLocaleString()}
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        listing.status === "published"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : listing.status === "draft"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : listing.status === "under_review"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      }`}
                    >
                      {listing.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Listing Health */}
                {listing.health && <ListingHealthCard health={listing.health} />}

                {/* AI Valuation Band */}
                {listing.valuationBand && (
                  <AiValuationBand valuationBand={listing.valuationBand} />
                )}

                {/* Data Completeness */}
                {listing.dataCompleteness && (
                  <DataCompletenessChecklist
                    dataCompleteness={listing.dataCompleteness}
                    listingId={listing.id}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 p-12 bg-[#0B1221] border border-slate-800 rounded-xl text-center">
            <p className="text-slate-400 mb-2">No listings yet</p>
            <p className="text-sm text-slate-500">
              Create your first listing to start tracking performance
            </p>
            <Link
              href="/sell"
              className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Listing
            </Link>
          </div>
        )}

        {/* Buyer Signals */}
        {dashboardData.buyerSignals.length > 0 && (
          <div className="mt-8">
            <BuyerSignals signals={dashboardData.buyerSignals} />
          </div>
        )}
      </div>
    </div>
  );
}
