"use client";

import ListingCard from "@/components/platform/ListingCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Listing {
  id: string;
  title: string;
  hero_image_url?: string | null;
  asset_type: "Operational" | "Digital";
  city?: string | null;
  province?: string | null;
  asking_price: number;
}

interface ListingGridProps {
  listings: Listing[];
}

export default function ListingGrid({ listings }: ListingGridProps) {
  const router = useRouter();

  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
        <div className="text-lg text-muted-foreground">No listings match your search</div>
        <Button variant="outline" onClick={() => router.push("/browse")}>Reset Filters</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map(listing => (
        <ListingCard key={listing.id} {...listing} />
      ))}
    </div>
  );
}
