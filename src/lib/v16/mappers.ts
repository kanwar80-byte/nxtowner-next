import { AssetType, AssetTypeV16, ListingCard, ListingDetail, ListingDetailV16, ListingStatus, ListingTeaserV16 } from "./types";

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

/**
 * Normalizes asset_type to canonical lowercase format
 */
function normalizeAssetType(value: any): AssetTypeV16 {
  if (!value) return 'operational'; // Default fallback (NULL treated as operational)
  const normalized = String(value).toLowerCase();
  if (normalized === 'operational' || normalized === 'digital') {
    return normalized as AssetTypeV16;
  }
  // Handle capitalized variants
  if (normalized === 'operational' || value === 'Operational' || value === 'physical' || value === 'asset') {
    return 'operational';
  }
  if (normalized === 'digital') {
    return 'digital';
  }
  return 'operational'; // Safe default
}

/**
 * Resolves hero image URL with priority:
 * 1) row.hero_image_url (top-level)
 * 2) row.meta.hero_image_url
 * 3) row.images[0] (if array)
 * 4) row.meta.images[0] or row.meta.gallery[0]
 * 5) fallback or null
 */
function resolveHeroImage(row: any, meta: Record<string, unknown>): string | null {
  if (row?.hero_image_url && typeof row.hero_image_url === 'string') {
    return row.hero_image_url;
  }
  if (meta?.hero_image_url && typeof meta.hero_image_url === 'string') {
    return meta.hero_image_url as string;
  }
  if (Array.isArray(row?.images) && row.images[0] && typeof row.images[0] === 'string') {
    return row.images[0];
  }
  if (Array.isArray(meta?.images) && meta.images[0] && typeof meta.images[0] === 'string') {
    return meta.images[0] as string;
  }
  if (Array.isArray(meta?.gallery) && meta.gallery[0] && typeof meta.gallery[0] === 'string') {
    return meta.gallery[0] as string;
  }
  return null;
}

/**
 * Resolves gallery images array with priority:
 * 1) row.images (if array)
 * 2) row.meta.images
 * 3) row.meta.gallery
 * 4) empty array
 */
function resolveGallery(row: any, meta: Record<string, unknown>): string[] {
  if (Array.isArray(row?.images)) {
    return asStringArray(row.images);
  }
  if (Array.isArray(meta?.images)) {
    return asStringArray(meta.images);
  }
  if (Array.isArray(meta?.gallery)) {
    return asStringArray(meta.gallery);
  }
  return [];
}

/**
 * Resolves description with priority:
 * row.description || meta.description || meta.business_description || meta.summary || null
 */
function resolveDescription(row: any, meta: Record<string, unknown>): string | null {
  if (row?.description && typeof row.description === 'string') {
    return row.description;
  }
  if (meta?.description && typeof meta.description === 'string') {
    return meta.description as string;
  }
  if (meta?.business_description && typeof meta.business_description === 'string') {
    return meta.business_description as string;
  }
  if (meta?.summary && typeof meta.summary === 'string') {
    return meta.summary as string;
  }
  return null;
}

/**
 * Pure mapping function: Maps database row to ListingTeaserV16
 * Used by browse/search results
 */
export function mapListingTeaserV16(row: any): ListingTeaserV16 {
  const meta = asRecord(row?.meta);
  const heroImageUrl = resolveHeroImage(row, meta);
  
  return {
    id: String(row?.id ?? ""),
    title: String(row?.title ?? ""),
    asset_type: normalizeAssetType(row?.asset_type),
    category_id: row?.category_id ?? null, // Map DB field as-is (no aliasing)
    subcategory_id: row?.subcategory_id ?? null, // Map DB field as-is (no aliasing)
    city: row?.city ?? null,
    province: row?.province ?? null,
    country: row?.country ?? null,
    asking_price: row?.asking_price != null ? (isNaN(Number(row.asking_price)) ? null : Number(row.asking_price)) : null,
    revenue_annual: row?.revenue_annual != null ? (isNaN(Number(row.revenue_annual)) ? null : Number(row.revenue_annual)) : null,
    cash_flow: row?.cash_flow != null ? (isNaN(Number(row.cash_flow)) ? null : Number(row.cash_flow)) : null,
    hero_image_url: heroImageUrl,
    heroImageUrl: heroImageUrl, // camelCase alias
    image_url: heroImageUrl, // Legacy alias
    status: row?.status ?? null,
    created_at: row?.created_at ?? null,
  };
}

/**
 * Pure mapping function: Maps database row to ListingDetailV16
 * Used by listing detail pages
 */
export function mapListingDetailV16(row: any): ListingDetailV16 {
  const teaser = mapListingTeaserV16(row);
  const meta = asRecord(row?.meta);
  
  const description = resolveDescription(row, meta);
  const images = resolveGallery(row, meta);
  
  // Greedy deal_structure extraction
  const deal_structure = 
    row?.deal_structure ||
    meta?.deal_structure ||
    meta?.deal_type ||
    row?.deal_type ||
    null;
  
  // Greedy business_status extraction
  const business_status = 
    row?.business_status ||
    meta?.business_status ||
    row?.status || // status might be used as business_status
    meta?.status ||
    null;
  
  return {
    ...teaser,
    description,
    deal_structure: deal_structure ? String(deal_structure) : null,
    business_status: business_status ? String(business_status) : null,
    images,
    meta: meta || null,
    currency: row?.currency ?? null,
    listing_tier: row?.listing_tier ?? null,
    deal_stage: row?.deal_stage ?? null,
  };
}

// Legacy mappers (kept for backward compatibility)
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

/**
 * Maps a database row to a ListingCard.
 * 
 * Image field standardization:
 * - heroImageUrl (camelCase) is the canonical field - use this for new code
 * - hero_image_url (snake_case) is provided as a deprecated alias for backward compatibility
 * - Migration path: Update components to use heroImageUrl, then remove hero_image_url alias
 */
export function mapListingRowToCard(
  row: any,
  taxonomyLabels?: { categoryName?: string; subcategoryName?: string }
): ListingCard {
  const meta = asRecord(row?.meta);
  // Canonical image URL (camelCase)
  const heroImageUrl = selectHeroImage(meta, row?.hero_image_url);
  
  return {
    id: String(row?.id ?? ""),
    title: String(row?.title ?? ""),
    assetType: (row?.asset_type as AssetType) ?? "Operational",
    categoryId: String(row?.category_id ?? ""),
    subcategoryId: String(row?.subcategory_id ?? ""),
    categoryLabel: taxonomyLabels?.categoryName ?? "",
    subcategoryLabel: taxonomyLabels?.subcategoryName ?? "",
    city: row?.city ?? meta.city,
    province: row?.province ?? meta.province,
    country: row?.country ?? meta.country,
    askingPrice: safeNumber(row?.asking_price, 0),
    revenueAnnual: safeNumber(row?.revenue_annual, undefined),
    cashFlowAnnual: safeNumber(meta.cash_flow_annual, undefined),
    ebitdaAnnual: safeNumber(meta.ebitda_annual, undefined),
    // Canonical field (camelCase)
    heroImageUrl,
    // Deprecated alias for backward compatibility (will be removed in future version)
    hero_image_url: heroImageUrl,
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
    dealStructure: meta.deal_structure as string | undefined,
    businessStatus: meta.business_status as string | undefined,
    description: meta.description as string | undefined,
  };
}

/**
 * Maps ListingTeaserV16 to SmartListingGrid Listing format
 * Used for homepage featured listings
 */
export function mapV16ToGridListings(v16Listings: ListingTeaserV16[]): Array<{
  id: string;
  title: string;
  category: string;
  type: 'operational' | 'digital';
  price: string;
  metricLabel: string;
  metricValue: string;
  locationOrModel: string;
  imageUrl: string;
  badges: string[];
}> {
  const formatMoney = (amount: number | null | undefined) => {
    if (!amount || amount === 0) return "Contact for Price";
    return new Intl.NumberFormat('en-CA', { 
      style: 'currency', 
      currency: 'CAD', 
      maximumFractionDigits: 0,
      notation: "compact" 
    }).format(amount);
  };

  return v16Listings.map((item) => {
    const isOps = item.asset_type === 'operational';
    const ebitda = item.cash_flow ?? 0;
    const mrr = 0; // V16 teaser doesn't have MRR
    const arr = mrr * 12;

    // Determine metric label and value
    let metricLabel = 'Revenue';
    let metricValue = item.revenue_annual ? formatMoney(item.revenue_annual) : 'N/A';
    
    if (isOps) {
      metricLabel = 'EBITDA';
      metricValue = ebitda > 0 ? formatMoney(ebitda) : 'N/A';
    } else {
      if (mrr > 0) {
        metricLabel = 'ARR';
        metricValue = formatMoney(arr);
      } else {
        metricLabel = 'Revenue';
        metricValue = item.revenue_annual ? formatMoney(item.revenue_annual) : 'N/A';
      }
    }

    // Generate badges
    const badges: string[] = [];
    if (item.status === 'published') {
      badges.push('Published');
    }
    if (isOps && item.city) {
      badges.push('Prime Location');
    }
    if (badges.length === 0) {
      badges.push('Active Listing');
    }

    return {
      id: item.id,
      title: item.title || '',
      category: item.category_id || item.subcategory_id || 'General', // Use ID temporarily; UI should lookup names
      type: isOps ? 'operational' as const : 'digital' as const,
      price: item.asking_price ? formatMoney(item.asking_price) : 'Contact for Price',
      metricLabel,
      metricValue,
      locationOrModel: isOps 
        ? (item.city || 'Location TBD')
        : 'Remote / Digital',
      imageUrl: item.hero_image_url || item.heroImageUrl || item.image_url || '/images/placeholder.jpg',
      badges: badges.slice(0, 2),
    };
  });
}
