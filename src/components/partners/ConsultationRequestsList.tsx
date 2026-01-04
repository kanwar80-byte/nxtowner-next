"use client";

import { useState } from "react";
import { updateConsultationRequestStatus } from "@/app/actions/partners";
import type { ConsultationRequest } from "@/types/database";
import type React from "react";

// Helper to safely render unknown values as ReactNode
const renderNode = (v: unknown): React.ReactNode => {
  if (v == null) return null;
  if (typeof v === "string" || typeof v === "number") return v;
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (v instanceof Date) return v.toISOString();
  return String(v);
};

interface ConsultationRequestsListProps {
  requests: (ConsultationRequest & {
    listings: { title: string; asking_price: number | null } | null;
  })[];
}

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
} as const;

type Status = keyof typeof STATUS_COLORS;

export function ConsultationRequestsList({
  requests,
}: ConsultationRequestsListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusUpdate = async (
    requestId: string,
    newStatus: ConsultationRequest["status"]
  ) => {
    setUpdatingId(requestId);
    try {
      await updateConsultationRequestStatus(requestId, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📬</div>
        <p className="text-brand-muted">No consultation requests yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="border border-brand-border rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-brand-text">
                {renderNode(request.requester_name)}
              </h3>
              <p className="text-sm text-brand-muted">
                {renderNode(request.requester_email)}
                {request.requester_phone != null && ` • ${renderNode(request.requester_phone)}`}
              </p>
              <p className="text-xs text-brand-muted mt-1">
                {new Date(request.created_at || Date.now()).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                (() => {
                  const status = (request.status ?? "pending") as Status;
                  return status in STATUS_COLORS ? STATUS_COLORS[status] : STATUS_COLORS.pending;
                })()
              }`}
            >
              {request.status || 'pending'}
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-brand-text whitespace-pre-wrap">
              {renderNode(request.message)}
            </p>
          </div>

          {request.listings && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-brand-text uppercase tracking-wide mb-1">
                Related to listing:
              </p>
              <p className="text-sm text-brand-muted">
                {request.listings.title}
                {request.listings.asking_price &&
                  ` - $${request.listings.asking_price.toLocaleString()}`}
              </p>
            </div>
          )}

          {request.status === "pending" && (
            <div className="flex gap-3">
              <button
                onClick={() => handleStatusUpdate(request.id, "contacted")}
                disabled={updatingId === request.id}
                className="px-4 py-2 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition disabled:opacity-50 text-sm"
              >
                {updatingId === request.id
                  ? "Updating..."
                  : "Mark as Contacted"}
              </button>
              <button
                onClick={() => handleStatusUpdate(request.id, "cancelled")}
                disabled={updatingId === request.id}
                className="px-4 py-2 border border-brand-border text-brand-text font-semibold rounded-md hover:bg-gray-50 transition disabled:opacity-50 text-sm"
              >
                Cancel
              </button>
            </div>
          )}

          {request.status === "contacted" && (
            <div className="flex gap-3">
              <button
                onClick={() => handleStatusUpdate(request.id, "completed")}
                disabled={updatingId === request.id}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 text-sm"
              >
                {updatingId === request.id
                  ? "Updating..."
                  : "Mark as Completed"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
