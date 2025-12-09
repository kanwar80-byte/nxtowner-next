/**
 * POST /api/checkout-session
 * Creates a Stripe checkout session for subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  stripe,
  getOrCreateStripeCustomer,
  PLAN_PRICE_IDS,
} from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Parse request body
    const { plan } = await req.json();

    if (!plan || !PLAN_PRICE_IDS[plan]) {
      return NextResponse.json(
        { error: 'Invalid plan specified' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      user.email || '',
      // @ts-expect-error - stripe_customer_id added in migration
      profile.stripe_customer_id || undefined
    );

    // Update profile with Stripe customer ID if new
    // @ts-expect-error - stripe_customer_id added in migration
    if (!profile.stripe_customer_id) {
      await supabase
        .from('profiles')
        // @ts-expect-error - stripe_customer_id type not in generated types
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PLAN_PRICE_IDS[plan],
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?cancelled=true`,
      metadata: {
        userId: user.id,
        plan,
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
