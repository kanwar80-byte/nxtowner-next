import { AssetType, ListingCard, ListingDetail, ListingStatus } from "./types";

const PLACEHOLDER_IMAGE = "/images/placeholder.jpg";

export function safeNumber(v: any, fallback: number = 0): number {
  const n = Number(v);
  return isNaN(n) ? fallback : n;
}

export function asRecord(v: any): Record<string, unknown> {
  return typeof v === "object" && v !== null ? v : {};
}

export function asStringArray(v: any): string[] {
  if (Array.isArray(v)) return v.filter(x => typeof x === "string");
  return [];
}

function selectHeroImage(meta: any, fallback?: string): string {
  if (!meta) return fallback || PLACEHOLDER_IMAGE;
  if (typeof meta.hero_image_url === "string" && meta.hero_image_url) return meta.hero_image_url;
  if (Array.isArray(meta.images) && meta.images[0]) return meta.images[0];
  if (Array.isArray(meta.gallery) && meta.gallery[0]) return meta.gallery[0];
  return fallback || PLACEHOLDER_IMAGE;
}

function selectGallery(meta: any): string[] {
  if (!meta) return [];
  if (Array.isArray(meta.images)) return asStringArray(meta.images);
  if (Array.isArray(meta.gallery)) return asStringArray(meta.gallery);
  return [];
}

export function mapListingRowToCard(
  row: any,
  taxonomyLabels?: { categoryName?: string; subcategoryName?: string }
): ListingCard {
  const meta = asRecord(row?.meta);
  return {
    id: String(row?.id ?? ""),
    title: String(row?.title ?? ""),
    assetType: (row?.asset_type as AssetType) ?? "Operational",
    categoryId: String(row?.category_id ?? ""),
    subcategoryId: String(row?.subcategory_id ?? ""),
    categoryLabel: taxonomyLabels?.categoryName ?? String(row?.category ?? ""),
    subcategoryLabel: taxonomyLabels?.subcategoryName ?? String(row?.subcategory ?? ""),
    city: row?.city ?? meta.city,
    province: row?.province ?? meta.province,
    country: row?.country ?? meta.country,
    askingPrice: safeNumber(row?.asking_price, 0),
    revenueAnnual: safeNumber(row?.revenue_annual, undefined),
    cashFlowAnnual: safeNumber(meta.cash_flow_annual, undefined),
    ebitdaAnnual: safeNumber(meta.ebitda_annual, undefined),
    heroImageUrl: selectHeroImage(meta, row?.hero_image_url),
    galleryUrls: selectGallery(meta),
    verificationLevel: row?.verification_level ?? meta.verification_level,
    listingTier: row?.listing_tier ?? meta.listing_tier,
    status: row?.status as ListingStatus,
    tags: asStringArray(meta.tags),
    specs: asRecord(meta.specs),
  };
}

export function mapListingRowToDetail(
  row: any,
  taxonomyLabels?: { categoryName?: string; subcategoryName?: string }
): ListingDetail {
  const card = mapListingRowToCard(row, taxonomyLabels);
  const meta = asRecord(row?.meta);
  return {
    ...card,
    postalCode: row?.postal_code ?? meta.postal_code,
    dealStructure: meta.deal_structure,
    businessStatus: meta.business_status,
    description: meta.description,
  };
}
