import "server-only";

import {
  getCategoryIdByCode as getCategoryIdByCodeV16,
  getSubcategoryIdByCode as getSubcategoryIdByCodeV16,
} from "@/lib/v16/taxonomy.repo";

/**
 * V17 Category Resolver
 * Server-safe helper functions to resolve category/subcategory codes to UUIDs
 */

/**
 * Get category UUID by code
 * @param categoryCode - Category code (e.g., "fuel_auto", "saas_software")
 * @returns Category UUID or null if not found
 */
export async function getCategoryIdByCode(
  categoryCode: string
): Promise<string | null> {
  if (!categoryCode || typeof categoryCode !== "string") {
    return null;
  }
  const normalized = normalizeCategoryCode(categoryCode);
  if (!normalized) return null;
  return getCategoryIdByCodeV16(normalized);
}

/**
 * Get subcategory UUID by code
 * @param subcategoryCode - Subcategory code (e.g., "gas_stations", "b2b_saas")
 * @returns Subcategory UUID or null if not found
 */
export async function getSubcategoryIdByCode(
  subcategoryCode: string
): Promise<string | null> {
  if (!subcategoryCode || typeof subcategoryCode !== "string") {
    return null;
  }
  const normalized = normalizeSubcategoryCode(subcategoryCode);
  if (!normalized) return null;
  return getSubcategoryIdByCodeV16(normalized);
}

/**
 * Normalize category code
 * - Trims whitespace
 * - Converts to lowercase
 * - Converts spaces to underscores (if needed)
 * - Returns null if empty after normalization
 */
export function normalizeCategoryCode(
  input?: string | null
): string | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed.length) return null;
  // Convert to lowercase and replace spaces with underscores
  return trimmed.toLowerCase().replace(/\s+/g, "_");
}

/**
 * Normalize subcategory code
 * - Trims whitespace
 * - Converts to lowercase
 * - Converts spaces to underscores (if needed)
 * - Returns null if empty after normalization
 */
export function normalizeSubcategoryCode(
  input?: string | null
): string | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed.length) return null;
  // Convert to lowercase and replace spaces with underscores
  return trimmed.toLowerCase().replace(/\s+/g, "_");
}


