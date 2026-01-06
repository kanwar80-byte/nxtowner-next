import { Suspense } from "react";
import HomePageClient from "./home/HomePageClient";
import { getFeaturedListingsV17 } from "@/lib/v17/listings.repo";

const DEBUG_LISTINGS = process.env.NEXT_PUBLIC_DEBUG_LISTINGS === "1";

async function HomePageContent() {
  // Fetch featured listings for both tracks from public.listings (V17 canonical source)
  const [operationalListings, digitalListings] = await Promise.all([
    getFeaturedListingsV17({ asset_type: "operational", limit: 12 }),
    getFeaturedListingsV17({ asset_type: "digital", limit: 12 }),
  ]);

  if (DEBUG_LISTINGS) {
    console.log(`[page.tsx] Initial featured: operational=${operationalListings.length}, digital=${digitalListings.length}`);
  }

  return (
    <HomePageClient 
      initialOperationalListings={operationalListings}
      initialDigitalListings={digitalListings}
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
