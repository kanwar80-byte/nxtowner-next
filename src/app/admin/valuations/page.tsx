"use client";
import { useEffect, useState } from "react";
import type { Valuation } from "@/types/valuation";

export default function AdminValuationsPage() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchValuations() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/valuations");
        if (!res.ok) throw new Error("Failed to fetch valuations");
        const data = await res.json();
        setValuations(data.valuations || []);
      } catch (err) {
        setError(typeof err === "object" && err !== null && "message" in err ? String((err as { message?: string }).message) : String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchValuations();
  }, []);

  // Admin actions
  async function handleDelete(id: string) {
    setActionLoading(id + "-delete");
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/valuations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete valuation. Please try again.");
      setValuations((vals) => vals.filter((v) => v.id !== id));
    } catch {
      setActionError("Could not delete valuation. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }
  async function handleRerun(id: string) {
    setActionLoading(id + "-rerun");
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/valuations/${id}/rerun`, { method: "POST" });
      if (!res.ok) throw new Error("Could not rerun AI valuation. Please try again.");
      // Optionally, refetch or update the row in-place
      const updated = await res.json();
      setValuations((vals) => vals.map((v) => v.id === id ? { ...v, status: "completed" } : v));
    } catch {
      setActionError("Could not rerun AI valuation. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }
  return (
    <main className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin: All Valuations</h1>
      {loading && (
        <div className="flex items-center justify-center py-8">
          <span className="animate-spin h-6 w-6 mr-2 border-4 border-orange-300 border-t-transparent rounded-full"></span>
          <span className="text-orange-600">Loading valuations…</span>
        </div>
      )}
      {error && (
        <div className="text-red-600 flex flex-col items-center py-4">
          <span>{error}</span>
          <button
            className="mt-2 px-4 py-2 bg-orange-500 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      {actionError && <div className="text-red-600 mb-2">{actionError}</div>}
      <div className="overflow-x-auto rounded-lg border mt-4 bg-white shadow-sm">
        <table className="min-w-full text-sm align-middle">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-left font-semibold text-gray-700 whitespace-nowrap">Valuation ID</th>
              <th className="p-3 text-left font-semibold text-gray-700 whitespace-nowrap">Title</th>
              <th className="p-3 text-left font-semibold text-gray-700 whitespace-nowrap">Type</th>
              <th className="p-3 text-left font-semibold text-gray-700 whitespace-nowrap">Status</th>
              <th className="p-3 text-left font-semibold text-gray-700 whitespace-nowrap">Value Range</th>
              <th className="p-3 text-left font-semibold text-gray-700 whitespace-nowrap">Currency</th>
              <th className="p-3 text-left font-semibold text-gray-700 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {valuations.map((v) => {
              const min = v.ai_output_range_min != null ? Number(v.ai_output_range_min).toLocaleString() : "—";
              const max = v.ai_output_range_max != null ? Number(v.ai_output_range_max).toLocaleString() : "—";
              const range = min !== "—" && max !== "—" ? `${min} – ${max}` : "—";
              return (
                <tr key={v.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-xs text-gray-500 max-w-[120px] truncate" title={v.id}>{v.id}</td>
                  <td className="p-3 font-medium text-gray-900 max-w-[180px] truncate" title={v.title}>{v.title}</td>
                  <td className="p-3 text-gray-700 capitalize">{v.asset_type}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      v.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : v.status === "queued" || v.status === "running"
                        ? "bg-yellow-100 text-yellow-700"
                        : v.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-blue-900">{range}</td>
                  <td className="p-3">{v.ai_output_currency ?? "CAD"}</td>
                  <td className="p-3">
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded text-xs mr-2 hover:bg-red-700 transition"
                      disabled={actionLoading === v.id + "-delete"}
                      onClick={() => handleDelete(v.id)}
                    >
                      {actionLoading === v.id + "-delete" ? "Deleting..." : "Delete"}
                    </button>
                    <button
                      className="px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 transition"
                      disabled={actionLoading === v.id + "-rerun"}
                      onClick={() => handleRerun(v.id)}
                    >
                      {actionLoading === v.id + "-rerun" ? "Rerunning..." : "Rerun AI"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
