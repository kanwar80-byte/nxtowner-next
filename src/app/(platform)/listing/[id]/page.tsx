import { getListingByIdV16 } from "@/lib/v16/listings.repo";
import { notFound } from "next/navigation";


type PageProps = {
  params: { id: string };
};

export default async function ListingPage({ params }: PageProps) {
  const { id } = params;
  console.log("[LISTING PAGE] params.id =", id);

  if (!id) notFound();

  const listing = await getListingByIdV16(id);
  console.log("[LISTING PAGE] getListingByIdV16 result:", { hasData: !!listing, listingId: listing?.id });

  if (!listing) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div style={{ background: '#fee', color: '#900', padding: '1rem', borderRadius: 8, margin: '2rem auto', maxWidth: 400 }}>
          <div><strong>Debug: Listing not found (dev mode)</strong></div>
          <div><strong>id:</strong> {id}</div>
        </div>
      );
    } else {
      notFound();
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      <div className="text-slate-500 mb-4">
        {listing.asset_type} | {listing.status}
      </div>

      <div className="mb-6">
        <strong>Description:</strong>
        <div className="mt-1">{listing.description || "No details available."}</div>
      </div>

      <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto">
        {JSON.stringify(listing.details_json ?? {}, null, 2)}
      </pre>
    </div>
  );
}
