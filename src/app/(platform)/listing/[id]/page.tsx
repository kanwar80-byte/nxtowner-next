import { fetchListingById } from "@/lib/db/listings";
import { notFound } from "next/navigation";

  const { data: listing, error } = await fetchListingById(params.id);
  if (!listing || error) return notFound();

  // NOTE: Details fetching is omitted; add to adapter if needed for V16
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      <div className="text-slate-500 mb-4">{listing.asset_type} | {listing.status}</div>
      <div className="mb-6">
        <strong>Description:</strong>
        <div className="mt-1">{listing.description || "No details available."}</div>
      </div>
      <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto">
        {JSON.stringify(listing.details_json, null, 2)}
      </pre>
    </div>
  );
}
