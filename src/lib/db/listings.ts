// Listings DB adapter (read-only, V15/V16 switchable)
import { supabase } from './supabaseClient';
import { getBackendMode } from '../config/backend';

// V15 table: listings
// V16 table: listings_v16

export async function fetchListings() {
  const mode = getBackendMode();
  const table = mode === 'v16' ? 'listings_v16' : 'listings';
  return supabase.from(table).select('*');
}

export async function fetchListingById(id: string) {
  const mode = getBackendMode();
  const table = mode === 'v16' ? 'listings_v16' : 'listings';
  return supabase.from(table).select('*').eq('id', id).single();
}
