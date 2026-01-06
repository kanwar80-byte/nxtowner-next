import { getOrCreateProfile, signNdaAndCreateDealRoom } from '@/lib/spine/server';
import { createClient } from '@/lib/supabaseAdmin';
import { NDASignRequestSchema } from '@/lib/validation/api.schemas';
import { NextResponse } from 'next/server';

const supabase = createClient();

export async function POST(req: Request) {
  const rawBody = await req.json();

  // Validate request body with Zod
  const validationResult = NDASignRequestSchema.safeParse(rawBody);
  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: validationResult.error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }

  const { listingId } = validationResult.data;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const profile = await getOrCreateProfile(user.id);
  const dealRoomId = await signNdaAndCreateDealRoom({ listingId, buyerId: profile.id });
  return NextResponse.json({ dealRoomId });
}
