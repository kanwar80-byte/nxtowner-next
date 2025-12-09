"use client";

import { useState } from "react";
import Link from "next/link";
import { createListing, submitListingForReview } from "@/app/actions/listings";

const categories = [
  "gas_station",
  "qsr",
  "retail",
  "manufacturing",
  "ecommerce",
  "saas",
  "services",
  "other",
];

const listingTypes: Array<{ value: "asset" | "digital"; label: string }> = [
  { value: "asset", label: "Asset (Physical)" },
  { value: "digital", label: "Digital" },
];

export function SellForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [type, setType] = useState<"asset" | "digital" | "">("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [revenue, setRevenue] = useState("");
  const [profit, setProfit] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !description.trim() || !askingPrice.trim() || !type || !category || !city.trim() || !region.trim() || !country.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    const priceNumber = Number(askingPrice);
    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      setError("Enter a valid asking price.");
      return;
    }

    const revenueNumber = revenue.trim() === "" ? null : Number(revenue);
    const profitNumber = profit.trim() === "" ? null : Number(profit);

    if (revenueNumber !== null && Number.isNaN(revenueNumber)) {
      setError("Revenue must be a number.");
      return;
    }

    if (profitNumber !== null && Number.isNaN(profitNumber)) {
      setError("Profit must be a number.");
      return;
    }

    setLoading(true);

    const formattedLocation = [city.trim(), region.trim(), country.trim()].filter(Boolean).join(", ");

    const result = await createListing({
      title: title.trim(),
      description: description.trim(),
      summary: description.trim(),
      asking_price: priceNumber,
      annual_revenue: revenueNumber,
      annual_cashflow: profitNumber,
      category: category.trim(),
      type: type as "asset" | "digital",
      location: formattedLocation,
      country: country.trim(),
      region: region.trim(),
      metrics: null,
      meta: null,
    });

    setLoading(false);

    if (!result.success || !result.id) {
      setError(result.error || "Failed to create listing.");
      return;
    }

    setCreatedId(result.id);
    setStatus("draft");
    setSuccess("Your listing is saved as draft. You can now submit it for review.");
  };

  const handleSubmitForReview = async () => {
    if (!createdId) return;
    setReviewLoading(true);
    const result = await submitListingForReview(createdId);
    setReviewLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to submit for review.");
      return;
    }

    setStatus("pending_review");
    setSuccess("Submitted for review. Our team will approve it shortly.");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-brand-border rounded-2xl shadow-sm p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-brand-text">Create your listing</h2>
        <p className="text-brand-muted text-sm mt-1">
          Draft your business listing. You can submit it for review after saving.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Established QSR franchise"
              className="w-full rounded-md border border-brand-border px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-brand-border px-3 py-2 text-sm"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "asset" | "digital" | "")}
              className="w-full rounded-md border border-brand-border px-3 py-2 text-sm"
              required
            >
              <option value="">Select type</option>
              {listingTypes.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">Asking price (CAD) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={askingPrice}
              onChange={(e) => setAskingPrice(e.target.value)}
              placeholder="450000"
              className="w-full rounded-md border border-brand-border px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-text">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe the business, strengths, operations, and reason for sale."
            className="w-full rounded-md border border-brand-border px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">City *</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Toronto"
              className="w-full rounded-md border border-brand-border px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">Province/State *</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Ontario"
              className="w-full rounded-md border border-brand-border px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">Country *</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Canada"
              className="w-full rounded-md border border-brand-border px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">Annual revenue (optional)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              placeholder="650000"
              className="w-full rounded-md border border-brand-border px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">Annual profit (optional)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
              placeholder="180000"
              className="w-full rounded-md border border-brand-border px-3 py-2 text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-brand-navy text-white text-sm font-semibold shadow-sm hover:bg-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Saving..." : "Save draft"}
          </button>

          {createdId && status === "draft" && (
            <button
              type="button"
              onClick={handleSubmitForReview}
              disabled={reviewLoading}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-brand-orange text-white text-sm font-semibold shadow-sm hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {reviewLoading ? "Submitting..." : "Submit for review"}
            </button>
          )}

          {status === "pending_review" && (
            <span className="text-sm font-semibold text-brand-navy">Submitted for review</span>
          )}

          <Link
            href="/dashboard/seller"
            className="text-sm font-semibold text-brand-navy underline underline-offset-4"
          >
            Go to seller dashboard
          </Link>
        </div>
      </form>
    </div>
  );
}
