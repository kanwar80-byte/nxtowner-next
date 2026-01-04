"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
// IMPORTANT: Import the card from the SAME folder (where we added the fix)
import { ListingCard } from "./ListingCard"; 
import { Loader2 } from "lucide-react";

interface ListingGridProps {
  type: "operational" | "digital";
}

export function ListingGrid({ type }: ListingGridProps) {
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

      if (error) {
        console.error(`Error fetching ${type} listings:`, error);
      } else {
        setListings(data || []);
      }
      setLoading(false);
    }

    fetchListings();
  }, [type]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-slate-500 animate-spin" />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
        <p className="text-slate-400">No {type} opportunities available right now.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {listings.map((listing) => (
        // V17 FIX: Pass the raw object. Let the Card handle the logic.
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
