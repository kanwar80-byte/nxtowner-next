import { createClient } from "@/utils/supabase/server";

// UUID regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUUID(value: string | null | undefined): boolean {
  if (!value || typeof value !== "string") return false;
  return UUID_REGEX.test(value);
}

// Get category UUID by code
export async function getCategoryIdByCode(code: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tax_categories")
    .select("id")
    .eq("code", code)
    .maybeSingle();
  if (error || !data) return null;
  return data.id ?? null;
}

// Get category UUID by canonical name (e.g., "SaaS", "E-Commerce")
export async function getCategoryIdByName(name: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tax_categories")
    .select("id")
    .eq("name", name)
    .maybeSingle();
  if (error || !data) return null;
  return data.id ?? null;
}

// Get subcategory UUID by code
export async function getSubcategoryIdByCode(code: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tax_subcategories")
    .select("id")
    .eq("code", code)
    .maybeSingle();
  if (error || !data) return null;
  return data.id ?? null;
}

// Get category name by UUID id
export async function getCategoryNameById(categoryId: string): Promise<string | null> {
  if (!isUUID(categoryId)) return null; // Only resolve UUIDs
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tax_categories")
    .select("name")
    .eq("id", categoryId)
    .maybeSingle();
  if (error || !data) return null;
  return data.name ?? null;
}

// Get subcategory name by UUID id
export async function getSubcategoryNameById(subcategoryId: string): Promise<string | null> {
  if (!isUUID(subcategoryId)) return null; // Only resolve UUIDs
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tax_subcategories")
    .select("name")
    .eq("id", subcategoryId)
    .maybeSingle();
  if (error || !data) return null;
  return data.name ?? null;
}

// Helper to get taxonomy labels for a listing
export async function getTaxonomyLabels(
  categoryId?: string | null,
  subcategoryId?: string | null
): Promise<{ categoryName?: string; subcategoryName?: string }> {
  const [categoryNameRaw, subcategoryNameRaw] = await Promise.all([
    categoryId ? getCategoryNameById(categoryId) : Promise.resolve(null),
    subcategoryId ? getSubcategoryNameById(subcategoryId) : Promise.resolve(null),
  ]);
  const categoryName = categoryNameRaw === null ? undefined : categoryNameRaw;
  const subcategoryName = subcategoryNameRaw === null ? undefined : subcategoryNameRaw;
  return { categoryName, subcategoryName };
}
