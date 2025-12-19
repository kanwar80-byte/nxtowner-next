"use client";

import { MapPin, Search, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type AssetType = "all" | "operational" | "digital";

const HERO_COPY: Record<
  AssetType,
  { title: string; subtitle: string; placeholder: string }
> = {
  all: {
    title: "The Operating System for Business Acquisitions.",
    subtitle:
      "Canada’s premier marketplace. Buy and sell verified assets with bank-grade data and AI valuations.",
    placeholder: "Search 'SaaS', 'Gas Station', 'Logistics'...",
  },
  operational: {
    title: "Institutional-Grade Operational Businesses.",
    subtitle:
      "Acquire verified brick-and-mortar businesses with real cash flow, audited fundamentals, and asset-backed value.",
    placeholder: "Search gas stations, car washes, QSRs, logistics...",
  },
  digital: {
    title: "Scalable Digital Businesses, Professionally Vetted.",
    subtitle:
      "Buy and sell SaaS, e-commerce, and online businesses with AI-normalized financials and verified performance data.",
    placeholder: "Search SaaS, e-commerce, agencies, content sites...",
  },
};

const TABS: { key: AssetType; label: string }[] = [
  { key: "all", label: "All Assets" },
  { key: "operational", label: "Operational" },
  { key: "digital", label: "Digital" },
];

export default function Hero() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialType = (searchParams.get("type") as AssetType) || "all";
  const normalizedType: AssetType =
    initialType === "operational" || initialType === "digital"
      ? initialType
      : "all";

  const [activeType, setActiveType] = useState<AssetType>(normalizedType);
  const [query, setQuery] = useState<string>(searchParams.get("q") || "");

  const copy = useMemo(() => HERO_COPY[activeType], [activeType]);

  function goBrowse(type: AssetType, q: string) {
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    if (q.trim()) params.set("q", q.trim());
    router.push(`/browse?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-10 md:pt-14">
        <div className="grid gap-8 md:grid-cols-12 md:items-center">
          {/* LEFT */}
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700">
              <ShieldCheck className="h-4 w-4" />
              Verified listings • AI valuations • Deal-ready workflows
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              {copy.title}
            </h1>

            <p className="mt-3 text-base text-slate-600 md:text-lg">
              {copy.subtitle}
            </p>

            {/* TABS */}
            <div className="mt-6 flex flex-wrap gap-2">
              {TABS.map((tab) => {
                const active = tab.key === activeType;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveType(tab.key)}
                    className={[
                      "rounded-full px-4 py-2 text-sm font-medium transition",
                      active
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* SEARCH */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  goBrowse(activeType, query);
                }}
                className="flex flex-col gap-2 md:flex-row md:items-center"
              >
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3">
                  <Search className="h-5 w-5 text-slate-500" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={copy.placeholder}
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Search
                </button>
              </form>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  AI-ready comps
                </span>
                <span className="inline-flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Deal scoring
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Canada-wide
                </span>
                <Link
                  href="/sell"
                  className="ml-auto font-medium text-slate-900 hover:text-slate-700"
                >
                  List an asset →
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">
                What you get on NxtOwner
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-slate-900" />
                  Verified data + document-ready listings
                </li>
                <li className="flex gap-2">
                  <Sparkles className="mt-0.5 h-5 w-5 text-slate-900" />
                  AI valuation ranges + key drivers
                </li>
                <li className="flex gap-2">
                  <TrendingUp className="mt-0.5 h-5 w-5 text-slate-900" />
                  Compare deals and shortlist faster
                </li>
              </ul>

              <div className="mt-6 flex gap-3">
                <Link
                  href="/browse"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Browse listings
                </Link>
                <Link
                  href="/valuation"
                  className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Get valuation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
