'use server'

import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createCheckoutSession(priceId: string, listingId?: number) {
  const headersList = await headers();
  const origin = headersList.get('origin') || 'http://localhost:3000';

  // 1. Create the session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId, // The ID from your Stripe Dashboard (e.g., price_123...)
        quantity: 1,
      },
    ],
    mode: 'payment', // or 'subscription'
    success_url: `${origin}/dashboard/seller?success=true&listing_id=${listingId}`,
    cancel_url: `${origin}/pricing?canceled=true`,
    metadata: {
      listingId: listingId ? listingId.toString() : '',
      userId: 'user_123_placeholder', // Later: getUser() from Supabase Auth
    },
  });

  // 2. Redirect user to Stripe
  if (session.url) {
    redirect(session.url);
  }
}
