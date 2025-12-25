import { TABLES } from "@/lib/spine/constants";
import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function ListingDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await supabaseServer();
  const { data: listing } = await supabase
    .from(TABLES.listings)
    .select("id,created_at,title,asset_type,status")
    .eq("id", params.id)
    .single();

  if (!listing) return notFound();

  const { data: details } = await supabase
    .from(TABLES.listing_details)
    .select("description,details_json")
    .eq("listing_id", params.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      <div className="text-slate-500 mb-4">{listing.asset_type} | {listing.status}</div>
      <div className="mb-6">
        <strong>Description:</strong>
        <div className="mt-1">{details?.description || "No details available."}</div>
      </div>
      <pre className="bg-slate-100 p-4 rounded text-xs overflow-x-auto">
        {JSON.stringify(details?.details_json, null, 2)}
      </pre>
    </div>
  );
}
