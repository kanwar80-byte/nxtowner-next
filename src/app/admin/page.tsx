"use client";

import { AuthGate } from "@/components/auth/AuthGate";

export default function AdminPage() {
  return (
    <AuthGate requireAdmin={true}>
      <div className="min-h-screen bg-brand-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8">
            <h1 className="text-3xl font-bold text-brand-text mb-4">
              Admin Overview
            </h1>
            <p className="text-brand-muted mb-8">
              Platform-wide statistics and quick access to admin tools.
            </p>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <p className="text-4xl font-bold text-brand-navy mb-2">XXX</p>
                <p className="text-sm text-brand-muted">Total Listings</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <p className="text-4xl font-bold text-brand-navy mb-2">XXX</p>
                <p className="text-sm text-brand-muted">Active Users</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <p className="text-4xl font-bold text-brand-orange mb-2">XXX</p>
                <p className="text-sm text-brand-muted">Pending Reviews</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <p className="text-4xl font-bold text-brand-green mb-2">XXX</p>
                <p className="text-sm text-brand-muted">Active Deals</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/admin/listings"
                className="block p-6 border border-brand-border rounded-xl hover:bg-gray-50 transition"
              >
                <h3 className="text-lg font-semibold text-brand-text mb-2">
                  Manage Listings
                </h3>
                <p className="text-sm text-brand-muted">
                  Review, approve, flag, or remove listings from the marketplace.
                </p>
              </a>
              <a
                href="/admin/users"
                className="block p-6 border border-brand-border rounded-xl hover:bg-gray-50 transition"
              >
                <h3 className="text-lg font-semibold text-brand-text mb-2">
                  Manage Users
                </h3>
                <p className="text-sm text-brand-muted">
                  View user accounts, manage permissions, and handle disputes.
                </p>
              </a>
              <a
                href="/admin/verifications"
                className="block p-6 border border-brand-border rounded-xl hover:bg-gray-50 transition"
              >
                <h3 className="text-lg font-semibold text-brand-text mb-2">
                  Verification Queue
                </h3>
                <p className="text-sm text-brand-muted">
                  Process pending business verifications and identity checks.
                </p>
              </a>
              <a
                href="/admin/partners"
                className="block p-6 border border-brand-border rounded-xl hover:bg-gray-50 transition"
              >
                <h3 className="text-lg font-semibold text-brand-text mb-2">
                  Partner Applications
                </h3>
                <p className="text-sm text-brand-muted">
                  Review and approve broker, CPA, and lawyer applications.
                </p>
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-border">
              <p className="text-xs text-brand-muted">
                <strong>TODO:</strong> Fetch platform-wide KPIs from Supabase analytics. 
                Calculate totals from listings, profiles, deal_rooms, and verification_requests tables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
