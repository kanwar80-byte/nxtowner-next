// Taxonomy DB adapter (read-only, V15/V16 switchable)
import { supabase } from './supabaseClient';
import { getBackendMode } from '../config/backend';

export async function fetchCategories() {
  const mode = getBackendMode();
  const table = mode === 'v16' ? 'tax_categories' : 'categories';
  return supabase.from(table).select('*');
}

export async function fetchSubcategories() {
  const mode = getBackendMode();
  const table = mode === 'v16' ? 'tax_subcategories' : 'subcategories';
  return supabase.from(table).select('*');
}

export async function fetchRequirements() {
  const mode = getBackendMode();
  const table = mode === 'v16' ? 'tax_requirements' : 'requirements';
  return supabase.from(table).select('*');
}
