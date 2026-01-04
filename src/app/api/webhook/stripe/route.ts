/**
 * POST /api/webhook/stripe
 * Handles Stripe webhook events for subscription updates
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  constructWebhookEvent,
  getPlanByPriceId,
} from '@/lib/stripe';
import { supabase } from '@/utils/supabase/client';

type StripeSubscription = {
  id: string;
  metadata?: { userId?: string };
  current_period_end: number;
  items?: { data?: Array<{ price?: { id: string } }> };
};

type StripeInvoice = {
  id: string;
  metadata?: { userId?: string };
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

if (!webhookSecret) {
  console.warn('Warning: STRIPE_WEBHOOK_SECRET is not configured');
}

export async function POST(req: NextRequest) {
  const sb: any = supabase;
  // Get the raw body as string
  const body = await req.text();

  // Get Stripe signature from headers
  const signature = req.headers.get('stripe-signature') || '';

  try {
    // Verify and construct event
    const event = constructWebhookEvent(body, signature, webhookSecret);

    // Handle different event types
    switch (event.type) {
      // Handle successful subscription creation
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as StripeSubscription;

        // Get user ID from metadata
        const userId = subscription.metadata?.userId;
        if (!userId) {
          console.warn('No userId in subscription metadata');
          break;
        }

        // Extract plan from line items
        let plan = 'free';
        if (subscription.items?.data?.[0]?.price?.id) {
          const planFromPrice = getPlanByPriceId(
            subscription.items.data[0].price.id
          );
          if (planFromPrice) {
            plan = planFromPrice;
          }
        }

        // Calculate renewal date (current_period_end is a Unix timestamp)
        const renewDate = new Date(subscription.current_period_end * 1000);

        // Update user profile
        await sb
          .from('profiles')
          // @ts-ignore - stripe_subscription_id added in migration
          .update({
            stripe_subscription_id: subscription.id,
            plan,
            plan_renews_at: renewDate.toISOString(),
          })
          .eq('id', userId);

        console.log(
          `Updated user ${userId} to plan ${plan} with subscription ${subscription.id}`
        );
        break;
      }

      // Handle subscription cancellation
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as StripeSubscription;

        const userId = subscription.metadata?.userId;
        if (!userId) {
          console.warn('No userId in subscription metadata');
          break;
        }

        // Reset to free plan
        await sb
          .from('profiles')
          .update({
            plan: 'free',
            stripe_subscription_id: null,
            plan_renews_at: null,
          })
          .eq('id', userId);

        console.log(`Cancelled subscription for user ${userId}`);
        break;
      }

      // Handle payment failures (can trigger dunning emails)
      case 'invoice.payment_failed': {
        const invoice = event.data.object as StripeInvoice;
        console.warn(`Payment failed for invoice ${invoice.id}`);
        // Could send email notification or log for manual review
        break;
      }

      // Log other events for monitoring
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Always respond with 200 to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);

    // Return 400 for signature verification failures
    if (error instanceof Error && error.message.includes('Webhook')) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Return 500 for other errors
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
