import { Suspense } from "react";
import HomePageClient from "./home/HomePageClient";
import { getFeaturedListingsV17, searchListingsV17 } from "@/lib/v17/listings.repo";

const DEBUG_LISTINGS = process.env.NEXT_PUBLIC_DEBUG_LISTINGS === "1";

async function HomePageContent() {
  // Fetch featured listings for both tracks from public.listings (V17 canonical source)
  // Also fetch "New This Week" listings for both operational and digital
  const [operationalListings, digitalListings, newOperationalResult, newDigitalResult] = await Promise.all([
    getFeaturedListingsV17({ asset_type: "operational", limit: 12 }),
    getFeaturedListingsV17({ asset_type: "digital", limit: 12 }),
    searchListingsV17({ 
      asset_type: "operational", // Mapped from "real_world" to "operational" for AssetTypeV17
      sort: "newest", 
      limit: 8 
    }),
    searchListingsV17({ 
      asset_type: "digital", 
      sort: "newest", 
      limit: 8 
    }),
  ]);

  // Combine new listings from both asset types into unified array
  const newListings = [
    ...(newOperationalResult.items || []),
    ...(newDigitalResult.items || [])
  ];

  if (DEBUG_LISTINGS) {
    console.log(`[page.tsx] Initial featured: operational=${operationalListings.length}, digital=${digitalListings.length}, new=${newListings.length}`);
  }

  return (
    <HomePageClient 
      initialOperationalListings={operationalListings}
      initialDigitalListings={digitalListings}
      initialNewListings={newListings}
    />
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div />}>
      <HomePageContent />
    </Suspense>
  );
}
