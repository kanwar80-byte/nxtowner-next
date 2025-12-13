"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFilteredListings, type BrowseFilters } from "@/app/actions/listings";
import type { PublicListing } from "@/types/listing";

export default function BrowseClient() {
  const [filters] = useState<BrowseFilters>({});
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFilteredListings(filters);
        if (!alive) return;
        setListings((data ?? []) as PublicListing[]);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setError("Could not load listings. Please try again.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [filters]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Browse Listings</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `${listings.length} listing${listings.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl border bg-muted/30" />
            ))
          : listings.map((l) => (
              <Link
                key={l.id}
                href={`/listing/${l.id}`}
                className="group rounded-2xl border bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="text-base font-semibold group-hover:underline">
                  {l.title ?? "Untitled Listing"}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
  {((l as any).location ?? (l as any).city ?? (l as any).province ?? "Canada") as string}
</div>
                {l.summary ? (
                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{l.summary}</p>
                ) : null}
              </Link>
            ))}
      </div>
    </main>
  );
}
