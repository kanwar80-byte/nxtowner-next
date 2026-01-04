import { getFeaturedListingsV16 } from "@/lib/v16/listings.repo";
import CuratedListingsClient from "./CuratedListingsClient";

export default async function CuratedListings() {
  // Fetch real featured listings from V16 database
  const listings = await getFeaturedListingsV16();
  
  // Pass all listings to client component for track-aware filtering
  return <CuratedListingsClient listings={listings} />;
}
