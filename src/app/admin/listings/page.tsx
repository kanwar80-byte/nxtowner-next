"use client";

import { AuthGate } from "@/components/auth/AuthGate";
import { useState } from "react";

export default function AdminListingsPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "flagged">("all");

  return (
    <AuthGate requireAdmin={true}>
      <div className="min-h-screen bg-brand-bg py-12">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8">
            <h1 className="text-3xl font-bold text-brand-text mb-2">
              Manage Listings
            </h1>
            <p className="text-brand-muted mb-6">
              Review, approve, or flag business listings across the platform.
            </p>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 border-b border-brand-border">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                  filter === "all"
                    ? "border-brand-navy text-brand-navy"
                    : "border-transparent text-brand-muted hover:text-brand-text"
                }`}
              >
                All Listings
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                  filter === "pending"
                    ? "border-brand-orange text-brand-orange"
                    : "border-transparent text-brand-muted hover:text-brand-text"
                }`}
              >
                Pending Review
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                  filter === "approved"
                    ? "border-brand-green text-brand-green"
                    : "border-transparent text-brand-muted hover:text-brand-text"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter("flagged")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                  filter === "flagged"
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-brand-muted hover:text-brand-text"
                }`}
              >
                Flagged
              </button>
            </div>

            {/* Placeholder Listing Cards */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border border-brand-border rounded-lg flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-brand-text">Example Business #{i}</h3>
                    <p className="text-sm text-brand-muted">
                      Type: Asset-based • Location: Toronto, ON • Price: $XXX,XXX
                    </p>
                    <p className="text-xs text-brand-muted mt-1">
                      Submitted: Dec {i}, 2025 • Status: Pending Review
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm bg-brand-green text-white rounded-md hover:bg-green-700 transition">
                      Approve
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                      Flag
                    </button>
                    <button className="px-3 py-1 text-sm border border-brand-border text-brand-text rounded-md hover:bg-gray-50 transition">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-brand-border">
              <p className="text-xs text-brand-muted">
                <strong>TODO:</strong> Fetch listings from Supabase with admin_status filter. 
                Implement approve/flag/delete actions updating listings table.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
