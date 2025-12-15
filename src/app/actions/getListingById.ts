"use server";

import { supabaseServer } from "@/lib/supabase/server";

export async function getListingById(id: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching listing:", error);
    return null;
  }

  return data;
}