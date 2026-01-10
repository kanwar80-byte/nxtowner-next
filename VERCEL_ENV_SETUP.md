# Vercel Environment Variables Setup

## Required Environment Variables

To prevent warnings in Vercel, add these placeholder environment variables in:
**Vercel Dashboard → Project → Settings → Environment Variables**

### Stripe Placeholders (Before Stripe Integration)

Add these as placeholders (replace with real values when Stripe is connected):

```env
STRIPE_PRICE_PRO_BUYER=placeholder
STRIPE_PRICE_VERIFIED_SELLER=placeholder
STRIPE_PRICE_PARTNER_PRO=placeholder
STRIPE_WEBHOOK_SECRET=placeholder
```

### Instructions

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable above
4. Set environment: **Production**, **Preview**, and **Development** (or select as needed)
5. Save

### Notes

- These are placeholders to prevent build warnings
- Replace with actual Stripe values once Stripe integration is complete
- The application will handle placeholder values gracefully until real Stripe integration is implemented

### When Stripe is Ready

Replace placeholders with actual values:
- `STRIPE_PRICE_PRO_BUYER` → Stripe Price ID for Pro Buyer plan
- `STRIPE_PRICE_VERIFIED_SELLER` → Stripe Price ID for Verified Seller plan
- `STRIPE_PRICE_PARTNER_PRO` → Stripe Price ID for Partner Pro plan
- `STRIPE_WEBHOOK_SECRET` → Stripe Webhook secret from your Stripe dashboard
