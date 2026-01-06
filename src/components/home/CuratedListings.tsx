import { getFeaturedListingsV16 } from "@/lib/v16/listings.repo";
import CuratedListingsClient from "./CuratedListingsClient";

export default async function CuratedListings() {
  const [operational, digital] = await Promise.all([
    getFeaturedListingsV16({ assetMode: "operational", limit: 12 }),
    getFeaturedListingsV16({ assetMode: "digital", limit: 12 }),
  ]);

  const listings = [...operational, ...digital];

  return <CuratedListingsClient listings={listings} />;
}
