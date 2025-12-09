"use client";

import { AuthGate } from "@/components/auth/AuthGate";
import { useState } from "react";

export default function AdminVerificationsPage() {
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");

  return (
    <AuthGate requireAdmin={true}>
      <div className="min-h-screen bg-brand-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8">
            <h1 className="text-3xl font-bold text-brand-text mb-2">
              Verification Queue
            </h1>
            <p className="text-brand-muted mb-6">
              Review and process pending business verifications and identity checks.
            </p>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 border-b border-brand-border">
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                  filter === "pending"
                    ? "border-brand-orange text-brand-orange"
                    : "border-transparent text-brand-muted hover:text-brand-text"
                }`}
              >
                Pending
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
                onClick={() => setFilter("rejected")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                  filter === "rejected"
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-brand-muted hover:text-brand-text"
                }`}
              >
                Rejected
              </button>
            </div>

            {/* Verification Requests */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 border border-brand-border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-brand-text mb-1">
                        Verification Request #{i}000{i}
                      </h3>
                      <p className="text-sm text-brand-muted">
                        Type: {i % 2 === 0 ? "Business Identity" : "Financial Documents"}
                      </p>
                      <p className="text-xs text-brand-muted mt-1">
                        Submitted by: seller{i}@example.com • Dec {i}, 2025
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-brand-orange rounded-full">
                      Pending Review
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="text-sm font-semibold text-brand-text mb-2">
                      Submitted Documents:
                    </h4>
                    <ul className="text-sm text-brand-muted space-y-1">
                      <li>• Business_Registration_Certificate.pdf</li>
                      <li>• Tax_Return_2024.pdf</li>
                      <li>• Bank_Statements_Q4.pdf</li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm bg-brand-green text-white rounded-md hover:bg-green-700 transition">
                      Approve
                    </button>
                    <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                      Reject
                    </button>
                    <button className="px-4 py-2 text-sm border border-brand-border text-brand-text rounded-md hover:bg-gray-50 transition">
                      Request More Info
                    </button>
                    <button className="px-4 py-2 text-sm border border-brand-border text-brand-text rounded-md hover:bg-gray-50 transition">
                      View Documents
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-brand-border">
              <p className="text-xs text-brand-muted">
                <strong>TODO:</strong> Fetch verification requests from Supabase verification_requests table. 
                Implement approve/reject actions, document preview, and status updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
