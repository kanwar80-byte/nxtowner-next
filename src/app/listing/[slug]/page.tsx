import { Listing } from '@/lib/types/listing';
import { supabase } from '@/utils/supabase/client';

type Props = { params: { slug: string } };

export default async function ListingDetailPage({ params }: Props) {
  const { slug } = params;

  // Fetch listing by slug
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id,slug,title,asset_type,status,verification_level,is_verified,is_ai_verified')
    .eq('slug', slug)
    .single();

  if (listingError || !listing) {
    return <div>Listing not found.</div>;
  }

  // Fetch related financials by listing_id
  const { data: financials, error: finError } = await supabase
    .from('listing_financials')
    .select('id,listing_id,revenue,profit')
    .eq('listing_id', listing.id)
    .maybeSingle();

  return (
    <div>
      <h1>{listing.title}</h1>
      {getVerificationBadge(listing)}
      <div>Asset Type: {listing.asset_type || 'N/A'}</div>
      <div>Status: {listing.status}</div>
      <h2>Financials</h2>
      {financials ? (
        <ul>
          <li>Revenue: {financials.revenue ?? 'N/A'}</li>
          <li>Profit: {financials.profit ?? 'N/A'}</li>
        </ul>
      ) : (
        <div>No financials available.</div>
      )}
    </div>
  );
}

function getVerificationBadge(listing: Listing) {
  if (listing.verification_level !== null && listing.verification_level > 0) {
    return <span title="Verified">✔️</span>;
  }
  if (listing.is_verified) {
    return <span title="Legacy Verified">✔️</span>;
  }
  if (listing.is_ai_verified) {
    return <span title="AI Verified">🤖</span>;
  }
  return null;
}
