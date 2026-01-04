/**
 * Environment variable utilities for V17-safe configuration.
 * 
 * IMPORTANT: These functions return boolean flags only (not actual secret values)
 * to prevent accidental exposure in client-side code or logs.
 */

// ✅ Client-safe: must be static property access for Next to inline values
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const NODE_ENV = process.env.NODE_ENV;

// Server-only env vars (static access)
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_PRICE_PRO_BUYER = process.env.STRIPE_PRICE_PRO_BUYER;
const STRIPE_PRICE_VERIFIED_SELLER = process.env.STRIPE_PRICE_VERIFIED_SELLER;
const STRIPE_PRICE_PARTNER_PRO = process.env.STRIPE_PRICE_PARTNER_PRO;

/**
 * Returns public environment variable flags (safe for client-side use).
 * Only returns boolean presence flags, never actual secret values.
 */
export function getPublicEnvFlags() {
  return {
    nodeEnv: NODE_ENV,
    siteUrlPresent: !!NEXT_PUBLIC_SITE_URL,
    supabaseUrlPresent: !!NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKeyPresent: !!NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

/**
 * Returns server-only environment variable flags.
 * Only returns boolean presence flags, never actual secret values.
 * This function should only be called from server-side code.
 */
export function getServerEnvFlags() {
  return {
    nodeEnv: NODE_ENV,
    serviceRoleKeyPresent: !!SUPABASE_SERVICE_ROLE_KEY,
    stripeWebhookSecretPresent: !!STRIPE_WEBHOOK_SECRET,
    stripePriceProBuyerPresent: !!STRIPE_PRICE_PRO_BUYER,
    stripePriceVerifiedSellerPresent: !!STRIPE_PRICE_VERIFIED_SELLER,
    stripePricePartnerProPresent: !!STRIPE_PRICE_PARTNER_PRO,
  };
}

