/**
 * Stripe client configuration and helper functions
 */

import Stripe from 'stripe';

// Initialize Stripe with secret key (optional during build, required at runtime)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe: Stripe | null = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
      typescript: true,
    })
  : null;

/**
 * Plan type to Stripe price ID mapping
 * These must be configured in the Stripe Dashboard and referenced via env vars
 */
export const PLAN_PRICE_IDS: Record<string, string> = {
  pro_buyer: process.env.STRIPE_PRICE_PRO_BUYER || '',
  verified_seller: process.env.STRIPE_PRICE_VERIFIED_SELLER || '',
  partner_pro: process.env.STRIPE_PRICE_PARTNER_PRO || '',
};

// Validate that all required price IDs are set
Object.entries(PLAN_PRICE_IDS).forEach(([plan, priceId]) => {
  if (!priceId) {
    if (process.env.NODE_ENV === "production") {
      console.warn(`Warning: STRIPE_PRICE_${plan.toUpperCase()} is not configured`);
    }
  }
});

/**
 * Plan display names for UI
 */
export const PLAN_NAMES: Record<string, string> = {
  free: 'Free',
  pro_buyer: 'Pro Buyer',
  verified_seller: 'Verified Seller',
  partner_pro: 'Partner Pro',
};

/**
 * Plan descriptions for UI
 */
export const PLAN_DESCRIPTIONS: Record<string, string> = {
  free: 'Get started with basic features',
  pro_buyer: 'Advanced search, saved listings, and priority support',
  verified_seller: 'Verified badge, enhanced analytics, and dedicated support',
  partner_pro: 'Premium listing placement, client management, and priority support',
};

/**
 * Plan pricing (monthly in cents)
 */
export const PLAN_PRICING: Record<string, number> = {
  free: 0,
  pro_buyer: 4900, // $49/month
  verified_seller: 9900, // $99/month
  partner_pro: 14900, // $149/month
};

/**
 * Plan features for pricing page
 */
export const PLAN_FEATURES: Record<string, string[]> = {
  free: [
    'Browse all listings',
    'Basic search filters',
    'Watchlist (up to 10 items)',
    'Community access',
  ],
  pro_buyer: [
    'Everything in Free',
    'Advanced search with AI',
    'Saved searches (unlimited)',
    'Watchlist (unlimited)',
    'Price alerts',
    'Priority support',
    'Deal room access',
  ],
  verified_seller: [
    'Everything in Free',
    'Verified badge on profile',
    'Detailed analytics dashboard',
    'Featured listing placement',
    'Multi-listing management',
    'Buyer insights',
    'Priority support',
    'Custom branding',
  ],
  partner_pro: [
    'Everything in Free',
    'Premium listing placement',
    'Client management dashboard',
    'Consultation booking system',
    'Featured partner directory placement',
    'Analytics and reporting',
    'Dedicated account manager',
    'Custom integrations',
  ],
};

/**
 * Get plan by price ID
 */
export function getPlanByPriceId(priceId: string): string | null {
  for (const [plan, id] of Object.entries(PLAN_PRICE_IDS)) {
    if (id === priceId) {
      return plan;
    }
  }
  return null;
}

/**
 * Create or get Stripe customer for user
 */
export async function getOrCreateStripeCustomer(
  email: string,
  customerId?: string
): Promise<string> {
  if (customerId) {
    return customerId;
  }

  if (!stripe) {
    throw new Error('Stripe client not initialized');
  }

  const customer = await stripe.customers.create({
    email,
    metadata: {
      created_at: new Date().toISOString(),
    },
  });

  return customer.id;
}

/**
 * Validate Stripe webhook signature
 */
export function validateWebhookSignature(
  body: string | Buffer,
  signature: string,
  secret: string
): boolean {
  try {
    if (!stripe) {
      return false;
    }
    stripe.webhooks.constructEvent(body, signature, secret);
    return true;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

/**
 * Extract event from webhook body and signature
 */
export function constructWebhookEvent(
  body: string | Buffer,
  signature: string,
  secret: string
) {
  if (!stripe) {
    throw new Error('Stripe client not initialized');
  }
  return stripe.webhooks.constructEvent(body, signature, secret);
}
