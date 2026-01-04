"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ListingCard } from "./ListingCard"; 
import { Loader2 } from "lucide-react";

export function ListingGrid({ type }: { type: "operational" | "digital" }) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("deal_type", type)
        .eq("status", "active")
        .limit(3);
      
      if (!error) setListings(data || []);
      setLoading(false);
    }
    fetchListings();
  }, [type]);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 text-slate-500 animate-spin"/></div>;
  if (listings.length === 0) return <div className="py-20 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">No deals found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
