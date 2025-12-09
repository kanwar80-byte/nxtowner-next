"use client";

import { AuthGate } from "@/components/auth/AuthGate";
import { useState } from "react";

interface DealRoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DealRoomPage({ params }: DealRoomPageProps) {
  const [dealId, setDealId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "messages">("overview");

  // Unwrap params
  useState(() => {
    params.then(p => setDealId(p.id));
  });

  return (
    <AuthGate>
      <div className="min-h-screen bg-brand-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-6">
            <h1 className="text-3xl font-bold text-brand-text mb-2">
              Deal Room
            </h1>
            <p className="text-brand-muted">
              Deal ID: <span className="font-mono text-brand-text">{dealId || "Loading..."}</span>
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-brand-border">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === "overview"
                  ? "border-brand-navy text-brand-navy"
                  : "border-transparent text-brand-muted hover:text-brand-text"
              }`}
            >
              Overview & KPIs
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === "documents"
                  ? "border-brand-navy text-brand-navy"
                  : "border-transparent text-brand-muted hover:text-brand-text"
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === "messages"
                  ? "border-brand-navy text-brand-navy"
                  : "border-transparent text-brand-muted hover:text-brand-text"
              }`}
            >
              Secure Messages
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-brand-text mb-4">
                  Key KPIs & Timeline (Asset/Digital Aware)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-brand-muted uppercase mb-1">Asking Price</p>
                    <p className="text-2xl font-bold text-brand-text">$XXX,XXX</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-brand-muted uppercase mb-1">Annual Revenue</p>
                    <p className="text-2xl font-bold text-brand-text">$XXX,XXX</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-brand-muted uppercase mb-1">Net Profit Margin</p>
                    <p className="text-2xl font-bold text-brand-text">XX%</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-border">
                  <p className="text-xs text-brand-muted">
                    <strong>TODO:</strong> Backend integration pending — DO NOT MODIFY EXISTING UI STRUCTURE.
                  </p>
                </div>
              </div>

              <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-brand-text mb-4">
                  Deal Timeline
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-brand-green rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-brand-text">NDA Signed</p>
                      <p className="text-xs text-brand-muted">December 8, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-brand-muted">Due Diligence</p>
                      <p className="text-xs text-brand-muted">Pending</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-brand-muted">Offer Submitted</p>
                      <p className="text-xs text-brand-muted">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-brand-text mb-4">
                Documents & Secure File Sharing
              </h2>
              <div className="space-y-3">
                <div className="p-4 border border-brand-border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-brand-text">Financial_Statements_2024.pdf</p>
                    <p className="text-xs text-brand-muted">Uploaded by seller • 2.4 MB</p>
                  </div>
                  <button className="px-3 py-1 text-sm bg-brand-navy text-white rounded-md hover:bg-slate-900 transition">
                    Download
                  </button>
                </div>
                <div className="p-4 border border-brand-border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-brand-text">Business_Plan_Executive_Summary.pdf</p>
                    <p className="text-xs text-brand-muted">Uploaded by seller • 1.1 MB</p>
                  </div>
                  <button className="px-3 py-1 text-sm bg-brand-navy text-white rounded-md hover:bg-slate-900 transition">
                    Download
                  </button>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-border">
                  <p className="text-xs text-brand-muted">
                    <strong>TODO:</strong> Backend integration pending — DO NOT MODIFY EXISTING UI STRUCTURE.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-brand-text mb-4">
                Secure Messaging
              </h2>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-brand-text text-sm">Seller</p>
                    <p className="text-xs text-brand-muted">2 hours ago</p>
                  </div>
                  <p className="text-sm text-brand-text">
                    Thank you for signing the NDA. I&apos;ve uploaded the latest financial statements. Let me know if you have any questions.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-brand-text text-sm">You</p>
                    <p className="text-xs text-brand-muted">1 hour ago</p>
                  </div>
                  <p className="text-sm text-brand-text">
                    Thanks! I&apos;ll review the documents and get back to you with questions by end of week.
                  </p>
                </div>
              </div>
              <div className="border-t border-brand-border pt-4">
                <textarea
                  rows={3}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy resize-none"
                ></textarea>
                <button className="mt-2 px-4 py-2 bg-brand-navy text-white rounded-md font-medium hover:bg-slate-900 transition">
                  Send Message
                </button>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-border">
                <p className="text-xs text-brand-muted">
                  <strong>TODO:</strong> Backend integration pending — DO NOT MODIFY EXISTING UI STRUCTURE.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGate>
  );
}
