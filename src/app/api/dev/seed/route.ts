
import { TABLES } from '@/lib/spine/constants';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

const supabase = supabaseAdmin;


export async function GET(req: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 });
  }
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  // Dev seed bypass logic: only allow bypass if not production and secret matches
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") || req.headers.get("x-seed-secret");

  let owner_id: string | null = null;
  if (
    (process.env.NODE_ENV as string) !== 'production' &&
    process.env.DEV_SEED_SECRET &&
    secret === process.env.DEV_SEED_SECRET
  ) {
    // allow bypass in dev
    owner_id = 'dev-seed-owner';
  } else {
    // require auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    owner_id = user.id;
  }

  // Create 20 v16_listings (10 operational, 10 digital)
  const listings: string[] = [];
  for (let i = 0; i < 20; i++) {
    const asset_type = i < 10 ? 'operational' : 'digital';
    const title = asset_type === 'operational' ? `Operational Biz #${i+1}` : `Digital Asset #${i-9}`;
    const status = 'published';
    const created_at = new Date().toISOString();
    // Insert into v16_listings
    const { data: listing, error: listingError } = await supabase.from(TABLES.listings).insert({
      owner_id,
      asset_type,
      status,
      title,
      created_at,
    }).select('id').single();
    if (listing) {
      listings.push(listing.id);
      // Insert into v16_listing_details
      await supabase.from(TABLES.listing_details).insert({
        listing_id: listing.id,
        description: `Seeded description for ${title}`,
        details_json: { seeded: true, batch: 'v16', idx: i },
      });
      // Insert into v16_scores
      await supabase.from(TABLES.scores).insert({
        listing_id: listing.id,
        score: 55 + Math.floor(Math.random() * 30),
        updated_at: new Date().toISOString(),
      });
    }
  }
  return NextResponse.json({ listingIds: listings });
}

