/**
 * Normalizes category/subcategory IDs from various input types to string | null.
 * 
 * V17 RULE:
 * - listings.category_id / subcategory_id are ALWAYS string | null
 * - UI may hydrate category objects, but repos accept IDs only
 * - Never pass category objects into repo filters
 * 
 * @param v - Can be a string UUID, an object with { id: string }, or null/undefined
 * @returns The string ID if valid, otherwise null
 */
export function normalizeId(v: unknown): string | null {
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && "id" in v && typeof (v as any).id === "string") {
    return (v as any).id;
  }
  return null;
}


