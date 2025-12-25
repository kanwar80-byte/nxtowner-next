import { getOrCreateProfile, signNdaAndCreateDealRoom } from '@/lib/spine/server';
import { createClient } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

const supabase = createClient();

export async function POST(req: Request) {
  const { listingId } = await req.json();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const profile = await getOrCreateProfile(user.id);
  const dealRoomId = await signNdaAndCreateDealRoom({ listingId, buyerId: profile.id });
  return NextResponse.json({ dealRoomId });
}
