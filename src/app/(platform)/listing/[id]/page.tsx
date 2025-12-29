
import { getListingByIdV16 } from "@/lib/v16/listings.repo";
import { notFound } from "next/navigation";

// import HeroGallery from "@/components/listings/v16/HeroGallery";



type PageProps = {
  params: Promise<{ id: string }>;
};



export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  if (!id) notFound();

  const listing = await getListingByIdV16(id);
  if (!listing) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div style={{ background: '#fee', color: '#900', padding: '1rem', borderRadius: 8, margin: '2rem auto', maxWidth: 400 }}>
          <div><strong>Debug: Listing not found (dev mode)</strong></div>
          <div><strong>id:</strong> {id}</div>
        </div>
      );
    } else {
      notFound();
    }
  }

  // Helper for fallback display
  const show = (val: any) => val ? val : "—";
  const price = listing.asking_price ? `$${listing.asking_price.toLocaleString()}` : "—";
  const location = [listing.city, listing.province, listing.country].filter(Boolean).join(", ") || "—";
  const category = show(listing.category);
  const subcategory = show(listing.subcategory);
  const dealStructure = show(listing.deal_structure);
  const businessStatus = show(listing.business_status);
  const currency = listing.currency ? listing.currency : "";

  // --- Hero & Gallery resolution logic (server-side, no hooks) ---
  let gallery: string[] =
    Array.isArray(listing.images) && listing.images.length
      ? listing.images
      : Array.isArray(listing.meta?.images) && listing.meta.images.length
      ? listing.meta.images
      : Array.isArray(listing.meta?.gallery) && listing.meta.gallery.length
      ? listing.meta.gallery
      : [];

  gallery = gallery
    .map((url) => (typeof url === "string" ? url.trim() : ""))
    .filter((url) => !!url)
    .filter((url, idx, arr) => arr.indexOf(url) === idx)
    .slice(0, 6);

  const heroUrl =
    listing.hero_image_url?.trim() ||
    listing.meta?.hero_image_url?.trim() ||
    gallery[0] ||
    null;

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      <div className="text-slate-500 mb-4">
        {listing.asset_type} | {listing.status}
      </div>

      {/* Hero Image + Gallery */}
      <div>Image Gallery Placeholder</div>

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
        <strong>Description:</strong>
        <div className="mt-1">{listing.description || "No description provided."}</div>
      </div>
    </div>
  );
}

// No React hooks or "use client" in this file. All client logic is in the imported HeroGallery component.
