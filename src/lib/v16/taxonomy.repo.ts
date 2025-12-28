import { createClient } from "@/utils/supabase/server";

export async function getCategoryNameById(categoryId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tax_categories")
    .select("name")
    .eq("id", categoryId)
    .maybeSingle();
  if (error || !data) return null;
  return data.name ?? null;
}

export async function getSubcategoryNameById(subcategoryId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tax_subcategories")
    .select("name")
    .eq("id", subcategoryId)
    .maybeSingle();
  if (error || !data) return null;
  return data.name ?? null;
}

export async function getTaxonomyLabels(
  categoryId?: string | null,
  subcategoryId?: string | null
): Promise<{ categoryName?: string; subcategoryName?: string }> {
  const [categoryNameRaw, subcategoryNameRaw] = await Promise.all([
    categoryId ? getCategoryNameById(categoryId) : undefined,
    subcategoryId ? getSubcategoryNameById(subcategoryId) : undefined,
  ]);
  const categoryName = categoryNameRaw === null ? undefined : categoryNameRaw;
  const subcategoryName = subcategoryNameRaw === null ? undefined : subcategoryNameRaw;
  return { categoryName, subcategoryName };
}
