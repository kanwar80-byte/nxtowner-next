"use client";

import { AuthGate } from "@/components/auth/AuthGate";
import { useState } from "react";

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AuthGate requireAdmin={true}>
      <div className="min-h-screen bg-brand-bg py-12">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8">
            <h1 className="text-3xl font-bold text-brand-text mb-2">
              Manage Users
            </h1>
            <p className="text-brand-muted mb-6">
              View user accounts, manage roles and permissions, handle disputes.
            </p>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by email or name..."
                className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-brand-navy">XXX</p>
                <p className="text-xs text-brand-muted mt-1">Total Users</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-brand-green">XXX</p>
                <p className="text-xs text-brand-muted mt-1">Verified Buyers</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-brand-orange">XXX</p>
                <p className="text-xs text-brand-muted mt-1">Active Sellers</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-brand-text">XXX</p>
                <p className="text-xs text-brand-muted mt-1">Admins</p>
              </div>
            </div>

            {/* User Table */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 border border-brand-border rounded-lg flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-brand-text">user{i}@example.com</h3>
                    <p className="text-sm text-brand-muted">
                      Role: {i === 1 ? "Admin" : i % 2 === 0 ? "Seller" : "Buyer"} • 
                      Joined: Dec {i}, 2025 • 
                      Status: Active
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border border-brand-border text-brand-text rounded-md hover:bg-gray-50 transition">
                      Edit Role
                    </button>
                    <button className="px-3 py-1 text-sm bg-brand-navy text-white rounded-md hover:bg-slate-900 transition">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-brand-border">
              <p className="text-xs text-brand-muted">
                <strong>TODO:</strong> Fetch users from Supabase profiles table with search/filter. 
                Implement role updates, account suspension, and detailed profile views.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
