
import { getListingByIdV16 } from "@/lib/v16/listings.repo";
import { getCategoryNameById, getSubcategoryNameById } from "@/lib/v16/taxonomy.repo";
import { notFound } from "next/navigation";
import HeroGallery from "@/components/listings/v16/HeroGallery";
import ListingActionsBar from "@/components/listings/ListingActionsBar";
import ListingViewTracker from "@/components/analytics/ListingViewTracker";
import Link from "next/link";



type PageProps = {
  params: Promise<{ id: string }>;
};



export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  if (!id) notFound();

  // Validate ID format - listings_v16 uses UUIDs
  // Handle gracefully if old numeric IDs are passed (should not happen, but be defensive)
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!isValidUUID && process.env.NODE_ENV === "development") {
    console.warn(`[ListingPage] Invalid UUID format: ${id}. listings_v16 requires UUID format.`);
  }

  const listing = await getListingByIdV16(id);
  if (!listing) {
    notFound();
  }

  // Resolve human-readable category/subcategory names
  const [categoryName, subcategoryName] = await Promise.all([
    listing.category ? getCategoryNameById(listing.category) : Promise.resolve(null),
    listing.subcategory ? getSubcategoryNameById(listing.subcategory) : Promise.resolve(null),
  ]);

  // Helper for fallback display
  const show = (val: any) => val ? val : "—";
  const price = listing.asking_price ? `$${listing.asking_price.toLocaleString()}` : "—";
  
  // Location display: handle digital/remote listings
  let location = "—";
  if (listing.asset_type === "digital") {
    const locationParts = [listing.city, listing.province, listing.country].filter(Boolean);
    location = locationParts.length > 0 
      ? locationParts.join(", ") 
      : "Remote / Global";
  } else {
    location = [listing.city, listing.province, listing.country].filter(Boolean).join(", ") || "—";
  }
  
  // Use human-readable names if available, otherwise fallback to raw values
  const category = categoryName || show(listing.category);
  const subcategory = subcategoryName || show(listing.subcategory);
  const dealStructure = show(listing.deal_structure);
  const businessStatus = show(listing.business_status);
  const currency = listing.currency ? listing.currency : "";
  
  // Description: already resolved by mapper (uses resolveDescription which checks meta.description, etc.)
  const description = listing.description || "No description provided.";

  // --- Hero & Gallery resolution logic (server-side, no hooks) ---
  // Build galleryUrls from best available sources in priority order:
  // 1) listing.images (if present)
  // 2) listing.meta?.images / listing.meta?.gallery (if present)
  // 3) fallback: [listing.hero_image_url or listing.heroImageUrl]
  let galleryUrls: string[] = [];
  
  if (Array.isArray(listing.images) && listing.images.length > 0) {
    galleryUrls = listing.images;
  } else if (Array.isArray(listing.meta?.images) && listing.meta.images.length > 0) {
    galleryUrls = listing.meta.images;
  } else if (Array.isArray(listing.meta?.gallery) && listing.meta.gallery.length > 0) {
    galleryUrls = listing.meta.gallery;
  }

  // Clean and deduplicate gallery URLs
  galleryUrls = galleryUrls
    .map((url) => (typeof url === "string" ? url.trim() : ""))
    .filter((url) => !!url)
    .filter((url, idx, arr) => arr.indexOf(url) === idx);

  // Determine hero image URL (for fallback if no gallery)
  // Safe type narrowing for listing.meta (defensive: meta may be null/undefined/non-object)
  const meta = listing.meta && typeof listing.meta === "object" ? (listing.meta as any) : null;
  const metaHero = meta?.hero_image_url;
  const heroImageUrl =
    listing.hero_image_url?.trim() ||
    (typeof metaHero === "string" ? metaHero.trim() : "") ||
    listing.heroImageUrl?.trim() ||
    null;

  return (
    <div className="max-w-2xl mx-auto py-12">
      <ListingViewTracker listingId={listing.id} listingData={listing} />
      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      <div className="text-slate-500 mb-4">
        {listing.asset_type} | {listing.status}
      </div>

      {/* Actions Bar */}
      <ListingActionsBar listingId={listing.id} listingData={listing} />

      {/* Hero Image + Gallery */}
      <HeroGallery
        heroImageUrl={heroImageUrl}
        galleryUrls={galleryUrls}
        title={listing.title}
      />

      {/* Key Details Panel */}
      <div className="mb-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h2 className="font-semibold text-lg mb-3 text-slate-800">Key Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div><span className="font-medium text-slate-600">Asking Price:</span> {listing.asking_price ? `$${listing.asking_price.toLocaleString()}${currency ? ` ${currency}` : ""}` : "—"}</div>
          <div><span className="font-medium text-slate-600">Location:</span> {location}</div>
          <div><span className="font-medium text-slate-600">Category:</span> {category}</div>
          <div><span className="font-medium text-slate-600">Subcategory:</span> {subcategory}</div>
          <div><span className="font-medium text-slate-600">Deal Structure:</span> {dealStructure}</div>
          <div><span className="font-medium text-slate-600">Business Status:</span> {businessStatus}</div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-3 text-slate-800">Description</h2>
        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">{description}</div>
      </div>

      {/* Next Steps Panel */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="font-semibold text-lg mb-3 text-slate-800">Next Steps</h2>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Save to Watchlist to track this opportunity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Sign NDA to unlock Deal Room and access detailed financials</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Request financials & diligence package (contact seller after NDA)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// No React hooks or "use client" in this file. All client logic is in the imported HeroGallery component.
