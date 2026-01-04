// Taxonomy DB adapter (read-only, V15/V16 switchable)
import { createClient } from '@/utils/supabase/server';
import { getBackendMode } from '../config/backend';

export async function fetchCategories() {
  const supabase = await createClient();
  const sb: any = supabase;
  const mode = getBackendMode();
  const table = mode === 'v16' ? 'tax_categories' : 'categories';
  return sb.from(table).select('*');
}

export async function fetchSubcategories() {
  const supabase = await createClient();
  const sb: any = supabase;
  const mode = getBackendMode();
  const table = mode === 'v16' ? 'tax_subcategories' : 'subcategories';
  return sb.from(table).select('*');
}

export async function fetchRequirements() {
  const supabase = await createClient();
  const sb: any = supabase;
  const mode = getBackendMode();
  const table = mode === 'v16' ? 'tax_requirements' : 'tax_requirements';
  return sb.from(table).select('*');
}
