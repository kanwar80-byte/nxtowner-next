"use client";
import { useEffect, useState } from "react";
import type { Valuation } from "@/types/valuation";

export default function AdminValuationsPage() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchValuations() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/valuations");
        if (!res.ok) throw new Error("Failed to fetch valuations");
        const data = await res.json();
        setValuations(data.valuations || []);
      } catch (err: unknown) {
        setError(typeof err === "object" && err !== null && "message" in err ? String((err as any).message) : String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchValuations();
  }, []);

  return (
    <main className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin: All Valuations</h1>
      {loading && <div className="animate-pulse text-orange-600">Loading valuations…</div>}
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Min</th>
            <th className="p-2 text-left">Max</th>
            <th className="p-2 text-left">Currency</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {valuations.map((v) => (
            <tr key={v.id} className="border-b">
              <td className="p-2 text-xs">{v.id}</td>
              <td className="p-2">{v.title}</td>
              <td className="p-2">{v.asset_type}</td>
              <td className="p-2">{v.status}</td>
              <td className="p-2">{v.ai_output_range_min ?? "—"}</td>
              <td className="p-2">{v.ai_output_range_max ?? "—"}</td>
              <td className="p-2">{v.ai_output_currency ?? "CAD"}</td>
              <td className="p-2">
                {/* TODO: Add edit, delete, rerun controls */}
                <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs mr-2">Edit</button>
                <button className="px-2 py-1 bg-red-600 text-white rounded text-xs mr-2">Delete</button>
                <button className="px-2 py-1 bg-orange-500 text-white rounded text-xs">Rerun AI</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
