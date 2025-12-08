"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreateListingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // 👈 capture form before any await

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(form);
    const title = String(formData.get("title") || "").trim();
    const assetType = String(formData.get("assetType") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const askingPriceRaw = String(formData.get("askingPrice") || "").trim();
    const summary = String(formData.get("summary") || "").trim();

    if (!title || !assetType || !location) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const askingPrice =
      askingPriceRaw === "" || Number.isNaN(Number(askingPriceRaw))
        ? null
        : Number(askingPriceRaw);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      setError(userError.message);
      setLoading(false);
      return;
    }

    if (!user) {
      setError("You must be signed in to create a listing.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("listings").insert({
      owner_id: user.id,
      title,
      asset_type: assetType,
      location,
      asking_price: askingPrice,
      summary,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSuccess("Listing created. You'll see it in your dashboard soon.");
    form.reset(); // ✅ safe now, form is not null
    setLoading(false);
  }

  return (
    <main className="bg-brand-bg min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-brand-text mb-2">
          Create a Listing
        </h1>
        <p className="text-brand-muted mb-8">
          Submit your business for sale on NxtOwner. Provide key details and our
          team will review it shortly.
        </p>

        <div className="max-w-3xl mx-auto bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-brand-muted mb-1"
              >
                Business Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Example: Petro-Canada Gas Station with C-Store"
                className="w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-brand-navy"
              />
            </div>

            <div>
              <label
                htmlFor="assetType"
                className="block text-sm font-medium text-brand-muted mb-1"
              >
                Asset Type *
              </label>
              <select
                id="assetType"
                name="assetType"
                required
                className="w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-brand-navy"
              >
                <option value="Gas Station">Gas Station</option>
                <option value="Car Wash">Car Wash</option>
                <option value="QSR / Restaurant">QSR / Restaurant</option>
                <option value="C-Store">C-Store</option>
                <option value="SaaS">SaaS</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-brand-muted mb-1"
              >
                Location *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                placeholder="City, Province (e.g., London, ON)"
                className="w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-brand-navy"
              />
            </div>

            <div>
              <label
                htmlFor="askingPrice"
                className="block text-sm font-medium text-brand-muted mb-1"
              >
                Asking Price (Optional)
              </label>
              <input
                id="askingPrice"
                name="askingPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="450000"
                className="w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-brand-navy"
              />
            </div>

            <div>
              <label
                htmlFor="summary"
                className="block text-sm font-medium text-brand-muted mb-1"
              >
                Business Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={4}
                placeholder="Short overview of the business, key strengths, and reason for sale."
                className="w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-brand-navy"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-brand-green bg-green-50 border border-green-100 rounded-md px-3 py-2">
                {success}
              </p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-md bg-brand-navy text-white text-sm font-semibold shadow-sm hover:bg-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? "Saving..." : "Submit Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
