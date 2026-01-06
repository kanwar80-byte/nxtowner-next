# NxtOwner System Baseline Report
**Date:** 2026-01-27  
**Audit Type:** Read-Only System Baseline  
**Scope:** Complete frontend and backend inventory

---

## A) Frontend Inventory (Routes & Pages)

### Root Routes (`src/app/`)
- **`/` (page.tsx)** - Homepage (client component, uses TrackProvider)
- **`/layout.tsx`** - Root layout with ConditionalLayout, PageViewTracker, NuqsAdapter

### Route Groups

#### 1. `(admin)` Group - `/admin/*`
**Layout:** `src/app/(admin)/admin/layout.tsx` (Server component, AdminShell, access check)
- `/admin/page.tsx` - Admin dashboard home
- `/admin/audit-log/page.tsx` - Audit log viewer
- `/admin/content/page.tsx` - Content management
- `/admin/deal-rooms/page.tsx` - Deal rooms management
- `/admin/leads/page.tsx` - Leads management
- `/admin/listings/page.tsx` - Listings management
- `/admin/monetization/page.tsx` - Monetization/pricing
- `/admin/ndas/page.tsx` - NDA management
- `/admin/partners/page.tsx` - Partner management
- `/admin/system/page.tsx` - System settings
- `/admin/users/page.tsx` - User management
- `/admin/users/[id]/page.tsx` - User detail view

#### 2. `(buyer)` Group - `/buyer/*`
**Layout:** `src/app/(buyer)/layout.tsx` (Simple Suspense wrapper)
- `/buyer/dashboard/page.tsx` - Buyer dashboard

#### 3. `(founder)` Group - `/founder/*`
**Layout:** `src/app/(founder)/founder/layout.tsx` (FounderShell, access check)
- `/founder/page.tsx` - Founder dashboard home
- `/founder/ai-report/page.tsx` - AI report view
- `/founder/deals/page.tsx` - Founder deals
- `/founder/engagement/page.tsx` - Engagement metrics
- `/founder/funnels/page.tsx` - Funnel analytics
- `/founder/marketplace/page.tsx` - Marketplace view
- `/founder/revenue/page.tsx` - Revenue analytics
- `/founder/risk/page.tsx` - Risk assessment
- `/founder/strategy/page.tsx` - Strategy tools

#### 4. `(partner)` Group - `/partner/*`
**Layout:** `src/app/(partner)/layout.tsx` (Simple Suspense wrapper)
- No routes directly under this group (uses `/partner/*` routes instead)

#### 5. `(platform)` Group - `/browse/*`, `/compare/*`, `/listing/*`
**Layout:** `src/app/(platform)/layout.tsx` (Simple Suspense wrapper)
- `/browse/page.tsx` - Main browse/search page (server component, uses V16 repo)
- `/browse/[track]/page.tsx` - Track-specific browse (operational/digital)
- `/browse/digital/page.tsx` - Digital assets browse
- `/browse/operational/page.tsx` - Operational assets browse
- `/compare/page.tsx` - Listing comparison page
- `/compare/CompareClient.tsx` - Compare client component
- `/listing/[id]/page.tsx` - Individual listing detail page

#### 6. `(seller)` Group - `/seller/*`
**Layout:** `src/app/(seller)/layout.tsx` (Simple Suspense wrapper)
- `/seller/dashboard/page.tsx` - Seller dashboard

### Standalone Routes

#### Authentication
- `/auth/callback/route.ts` - OAuth callback handler

#### Core Pages
- `/about/page.tsx` - About page (client component)
- `/buy/page.tsx` - Buy flow landing
- `/buyer/page.tsx` - Buyer landing
- `/buyer/saved/page.tsx` - Saved listings (with loading.tsx)
- `/contact/page.tsx` - Contact page (with actions.ts)
- `/dashboard/page.tsx` - Main dashboard router
- `/dashboard/admin/page.tsx` - Admin dashboard
- `/dashboard/buyer/page.tsx` - Buyer dashboard
- `/dashboard/partner/page.tsx` - Partner dashboard
- `/dashboard/seller/page.tsx` - Seller dashboard (with SubmitForReviewButton.tsx)

#### Deal Flow
- `/deal-room/[id]/page.tsx` - Deal room detail page
- `/deals/[id]/page.tsx` - Deal detail page

#### Information Pages
- `/faq/page.tsx` - FAQ page
- `/find-a-broker/page.tsx` - Broker finder
- `/guides/buyer-guide/page.tsx` - Buyer guide
- `/guides/seller-guide/page.tsx` - Seller guide
- `/how-it-works/page.tsx` - How it works
- `/legal/privacy/page.tsx` - Privacy policy
- `/legal/terms/page.tsx` - Terms of service
- `/login/page.tsx` - Login page
- `/onboarding/page.tsx` - User onboarding
- `/partner/page.tsx` - Partner landing
- `/partner/dashboard/page.tsx` - Partner dashboard
- `/partners/page.tsx` - Partners directory
- `/pricing/page.tsx` - Pricing page (client component, asset type toggle)
- `/resources/page.tsx` - Resources page
- `/seller/page.tsx` - Seller landing
- `/sell/page.tsx` - Sell flow landing
- `/sell/onboarding/page.tsx` - Seller onboarding
- `/sell/valuation/page.tsx` - Valuation wizard (with actions.ts, components/, config.ts, hooks/)
- `/signup/page.tsx` - Signup page
- `/tools/calculators/page.tsx` - Calculator tools
- `/tools/valuations/page.tsx` - Valuation tools
- `/trust/page.tsx` - Trust/safety page
- `/valuation/page.tsx` - Valuation landing
- `/valuation/asset/page.tsx` - Asset valuation
- `/valuation/digital/page.tsx` - Digital valuation

#### NDA Flow
- `/nda/[listingId]/page.tsx` - NDA signing page (with actions.ts)

#### Utility
- `/checkout/test-payment.disabled/page.tsx` - Disabled test payment page
- `/debug/page.tsx` - Debug page

### API Routes (`src/app/api/`)
- `/api/ai-search-listings/route.ts` - AI search parser endpoint
- `/api/checkout-session/route.ts` - Stripe checkout session (with createCheckoutSession.ts)
- `/api/cron/analytics-daily/route.ts` - Daily analytics cron job
- `/api/dev/seed/route.ts` - Dev seed endpoint
- `/api/events/route.ts` - Analytics events endpoint
- `/api/nda/sign/route.ts` - NDA signing endpoint
- `/api/seed/route.ts` - Seed data endpoint
- `/api/valuation/route.ts` - Valuation API endpoint
- `/api/webhook/stripe/route.ts` - Stripe webhook handler

---

## B) Homepage Baseline (Exact Section Map)

**File:** `src/app/page.tsx` (Client component wrapped in TrackProvider)

### Sections (in order):

1. **Navbar** (`src/components/layout/Navbar.tsx`)
   - Static navigation component
   - Hardcoded navigation links (public/user states)
   - No data fetching

2. **Hero Section** (`src/components/home/Hero.tsx`)
   - **Data Source:** Calls Supabase Edge Function `/functions/v1/ai-search-parser`
   - **Props:** None (uses TrackContext internally)
   - **Key Fields:** Search query, location, mode (operational/digital)
   - **Features:** AI-powered search, mode switching, search params routing

3. **Hero Capabilities** (`src/components/home/HeroCapabilities.tsx`)
   - **Data Source:** Hardcoded capability array
   - **Props:** None
   - **Key Fields:** Static display of 4 capabilities (Market Intelligence, Vetted Inventory, Direct Deal Flow, Secure Deal Rooms)

4. **Trust & Categories Filter** (`src/components/home/TrustAndCategories.tsx`)
   - **Data Source:** Hardcoded category arrays (OPERATIONAL_CATEGORIES, DIGITAL_CATEGORIES)
   - **Props:** `activeCategory`, `setActiveCategory` (state management)
   - **Key Fields:** Category filter pills (dynamic based on track mode)

5. **Smart Listing Grid** (`src/components/home/SmartListingGrid.tsx`)
   - **Data Source:** Supabase `listings` table (client-side query)
   - **Props:** `activeCategory` (string)
   - **Key Fields:** 
     - Queries: `listings` table with filters
     - Filters: `status='active'`, `deal_type=track`, category, location, price range
     - Fields: `id`, `title`, `category`, `deal_type`, `asking_price`, `cash_flow`, `mrr`, `location_city`, `image_url`, `hero_image_url`
   - **Features:** AI search integration, category filtering, limit 6 listings

6. **Category Grid** (`src/components/home/CategoryGrid.tsx`)
   - **Data Source:** Hardcoded category data (counts are static)
   - **Props:** None (uses TrackContext)
   - **Key Fields:** Static category counts and icons

7. **Process Roadmap** (`src/components/home/ProcessRoadmap.tsx`)
   - **Data Source:** Hardcoded step definitions
   - **Props:** None (uses TrackContext)
   - **Key Fields:** 4-step process visualization (hardcoded)

8. **Seller CTA** (`src/components/home/SellerCTA.tsx`)
   - **Data Source:** Hardcoded content (valuation mockup)
   - **Props:** None (uses TrackContext)
   - **Key Fields:** Static CTA with mock valuation display

9. **Market Insights** (`src/components/home/MarketInsights.tsx`)
   - **Data Source:** Hardcoded insight articles
   - **Props:** None (uses TrackContext)
   - **Key Fields:** Static article list (operational vs digital variants)

### Commented Out (Legacy)
- `<CuratedOpportunities />` - Replaced by SmartListingGrid

---

## C) UI Component Map (Core Shared Components)

### Layout Components (`src/components/layout/`)

#### 1. **ConditionalLayout** (`ConditionalLayout.tsx`)
- **Path:** `src/components/layout/ConditionalLayout.tsx`
- **Type:** Client component
- **Data Dependencies:** Uses `usePathname()` to detect admin/founder routes
- **Purpose:** Conditionally renders Navbar/Footer (hides on admin/founder routes)

#### 2. **Navbar** (`Navbar.tsx`)
- **Path:** `src/components/layout/Navbar.tsx`
- **Type:** Client component
- **Data Dependencies:** 
  - Hardcoded navigation links (NAV_LINKS_PUBLIC, NAV_LINKS_USER)
  - Mock auth state (isLoggedIn - needs real integration)
- **Purpose:** Main navigation bar with dropdowns, mobile menu

#### 3. **Footer** (`Footer.tsx`)
- **Path:** `src/components/layout/Footer.tsx`
- **Type:** Client component
- **Data Dependencies:** Hardcoded footer links (FOOTER_LINKS)
- **Purpose:** Site footer with accordion mobile menu

#### 4. **MainNav** (`MainNav.tsx`)
- **Path:** `src/components/layout/MainNav.tsx`
- **Status:** Present but not used in main layout (may be legacy)

### Context Providers

#### **TrackContext** (`src/contexts/TrackContext.tsx`)
- **Purpose:** Global state for asset type (operational vs digital)
- **Used By:** Homepage components, Hero, filtering components

---

## D) Server Actions & Data Access

### Action Files (`src/app/actions/`)

#### **admin.ts**
- **Tables/RPCs:** Admin operations (specific tables not visible in audit)
- **Return Types:** Admin data structures
- **Status:** Active

#### **aiProcessListing.ts**
- **Tables:** `listings_v16` (UPDATE operations)
- **Fields:** `is_ai_verified`, `normalized_sde`, `ai_summary_highlights`, `ai_valuation_low`, `ai_valuation_high`
- **Return Type:** `boolean`
- **Status:** Active (mock AI processing)

#### **analytics.ts**
- **Tables/RPCs:** Analytics events
- **Status:** Active

#### **confidence.ts**
- **Tables/RPCs:** Confidence scoring (likely uses scores table)
- **Status:** Active

#### **createListing.ts**
- **Tables:** 
  - `categories` (SELECT for lookup)
  - `subcategories` (SELECT for lookup)
  - `listings_v16` (INSERT)
- **Key Fields:** Maps form data to listings_v16 schema, stores extra fields in `meta_data` JSONB
- **Return Type:** Creates listing and revalidates paths
- **Status:** Active (V16 table)

#### **dashboards.ts**
- **Tables:** Multiple tables (listings_v16 fallback)
- **Status:** Active

#### **deal-actions.ts**
- **Tables/RPCs:** Deal room operations
- **Return Types:** Deal state structures
- **Status:** Active

#### **dealroom.ts**
- **Tables:** `deal_rooms`, `deal_room_members`, `messages`, `offers` (with fallback logic)
- **RPCs:** Uses TABLES constants from spine
- **Status:** Active (legacy table fallback pattern)

#### **getAdminDashboardData.ts**
- **Tables:** Admin metrics tables
- **Return Types:** `AdminDashboardData` type
- **Status:** Active

#### **getAdminKPIs.ts**
- **Tables:** Admin KPI queries
- **Status:** Active

#### **getAdminListings.ts**
- **Tables:** `listings_v16` (direct query, bypasses repo)
- **Fields:** `id`, `title`, `asking_price`, `is_featured`, `featured_until`, `is_ai_verified`, `ai_verified_at`, `status`, `created_at`
- **Return Type:** `any[]`
- **Status:** Active (admin bypass of public filters)

#### **getBuyerDashboardData.ts**
- **Tables:** Buyer dashboard queries
- **Return Types:** `BuyerDashboardData` type
- **Status:** Active

#### **getFilteredListings.ts**
- **Tables:** Listings queries (V15/V16)
- **Status:** May be legacy (see WIRING_SYNC_AUDIT.md)

#### **getListingById.ts**
- **Tables:** Uses V16 repo (`getListingByIdV16`)
- **Status:** Active (canonical)

#### **getListings.ts**
- **Tables:** Uses V16 repo (`searchListingsV16`)
- **Filters:** Maps V15 format to V16 format
- **Return Type:** Filtered listings array
- **Status:** Active (wrapper around V16 repo)

#### **getListingsByIds.ts**
- **Tables:** Batch listing fetch
- **Status:** Active

#### **getMatchedDeals.ts**
- **Tables:** Deal matching queries
- **Return Types:** `MatchedDeal[]`
- **Status:** Active

#### **getPartnerDashboardData.ts**
- **Tables:** Partner metrics
- **Return Types:** `PartnerDashboardData` type
- **Status:** Active

#### **getSellerDashboardData.ts**
- **Tables:** Seller dashboard queries
- **Return Types:** `SellerDashboardData` type
- **Status:** Active

#### **getValuationAnalytics.ts**
- **Tables:** Valuation analytics
- **Status:** Active

#### **leads.ts**
- **Tables:** `listings_v16`, `deal_rooms` (with joins)
- **Status:** Active

#### **listings.ts**
- **Tables:** Uses V16 repo for reads, direct queries for writes
- **Functions:** `createListing`, `updateListing`, `submitListingForReview`, `approveListingAdmin`, etc.
- **Status:** Active (hybrid: canonical reads, direct writes)

#### **nda.ts**
- **Tables:** NDA-related tables
- **RPCs:** May use `create_deal_room_with_nda`
- **Status:** Active

#### **onboarding.ts**
- **Tables:** Profile/user onboarding
- **Status:** Active

#### **partners.ts**
- **Tables:** Partner profiles, referrals
- **Functions:** `getApprovedPartners`, `getPartnerProfileByUserId`
- **Status:** Active

#### **saveBuyerPreferences.ts**
- **Tables:** Buyer preference storage
- **Status:** Active

#### **strategy.ts**
- **Tables:** Strategy-related queries
- **Status:** Active

#### **stripe.ts**
- **Tables:** Subscription/billing tables
- **Status:** Active

#### **userAccess.ts**
- **Tables:** User subscription/access tier queries
- **Return Types:** `UserAccessTier` ('FREE' | 'PRO' | 'ELITE' | 'NO_AUTH')
- **Status:** Active (mock function per comments)

#### **watchlist.ts**
- **Tables:** `watchlist` table
- **Functions:** `toggleWatchlist`, `isListingWatchlisted`, `getWatchlistForUser`
- **Status:** Active

### Key Data Access Patterns

1. **V16 Canonical Repo** (`src/lib/v16/listings.repo.ts`)
   - Used by: `/browse`, `/listing/[id]`, `getListings.ts`, `getListingById.ts`
   - Functions: `searchListingsV16()`, `getListingByIdV16()`, `getFeaturedListingsV16()`, `getBrowseFacetsV16()`
   - Table: `listings_v16`

2. **Direct Table Queries**
   - Many admin/backend actions query `listings_v16` directly
   - Write operations bypass repo (by design)

3. **Legacy Table References**
   - Some code references `listings_v15_legacy` (in types, migrations)
   - Active table: `listings_v16`

---

## E) Supabase Baseline (Schema + RLS + RPC)

### Client Setup Files

#### Browser Client
- **File:** `src/utils/supabase/client.ts`
- **Function:** `createClient()` / `createSupabaseBrowserClient()`
- **Env Vars:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Type:** `SupabaseClient<Database>`

#### Server Client
- **File:** `src/utils/supabase/server.ts`
- **Function:** `createClient()` (async)
- **Env Vars:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Type:** `SupabaseClient<Database>`

#### Admin Client
- **File:** `src/utils/supabase/admin.ts`
- **Purpose:** Service role client for admin operations
- **Env Vars:** `SUPABASE_SERVICE_ROLE_KEY`

### Key Tables (from migrations and codebase)

#### Core Tables (V16/V17)

1. **profiles**
   - **Columns:** `id` (uuid, PK, FK to auth.users), `full_name`, `role` (text, CHECK: 'user'|'buyer'|'seller'|'partner'|'admin'), `email`, `plan`, `avatar_url`, `verification_status`, `created_at`, `updated_at`, `meta` (jsonb)
   - **RLS:** Enabled
   - **Policies:** Users can read/update own profile; admins can read all
   - **Triggers:** `set_updated_at()` on UPDATE
   - **Auto-creation:** Trigger `on_auth_user_created` creates profile on signup

2. **listings_v16**
   - **Columns:** `id` (uuid, PK, default gen_random_uuid()), `owner_id` (uuid, FK to profiles), `asset_type` (enum: 'operational'|'digital'), `status` (enum: 'draft'|'published'|'paused'|'archived'), `title`, `asking_price`, `currency`, `city`, `province`, `country`, `category`, `subcategory`, `revenue_annual`, `cashflow_annual`, `ebitda_annual`, `verification` (jsonb), `meta` (jsonb), `created_at`, `updated_at`
   - **Additional fields (from code):** `category_id`, `subcategory_id`, `hero_image_url`, `image_url`, `is_ai_verified`, `ai_verified_at`, `normalized_sde`, `ai_summary_highlights`, `ai_valuation_low`, `ai_valuation_high`, `deal_type`, `mrr`, `location_city`, `cash_flow`, `gross_revenue_annual`, `is_featured`, `featured_until`, `source_type`, `tech_stack` (array)
   - **RLS:** Enabled
   - **Policies:** Public can read published/teaser; owners can read/update own; admins can read all
   - **Status:** **ACTIVE PRIMARY TABLE** for listings

3. **listings_v15_legacy**
   - **Status:** Referenced in types but not actively used
   - **Purpose:** Legacy migration reference

4. **categories**
   - **Usage:** Lookup table for category IDs
   - **Referenced in:** `createListing.ts`

5. **subcategories**
   - **Usage:** Lookup table for subcategory IDs
   - **Referenced in:** `createListing.ts`

6. **deal_rooms**
   - **Columns:** `id` (uuid, PK), `listing_id` (uuid, FK to listings_v16), `buyer_id` (uuid, FK to profiles), `created_by` (uuid, FK to auth.users), `status`, `created_at`, `updated_at`
   - **Additional fields:** `stage` (enum: 'discover'|'interest'|'nda'|'deal_room'|'due_diligence'|'negotiation'|'closing'|'post_close'), `is_active`, `opened_at`, `closed_at`
   - **RLS:** Enabled
   - **Policies:** Buyers/sellers can read their deal rooms

7. **deal_room_members**
   - **Columns:** `deal_room_id` (uuid, FK), `user_id` (uuid, FK), `role`, `created_at`
   - **RLS:** Enabled
   - **Policies:** Members can read their own memberships

8. **signed_ndas**
   - **Columns:** `id` (uuid, PK), `listing_id` (uuid, FK to listings_v16), `user_id` (uuid, FK), `signed_at`, `created_at`
   - **RLS:** Enabled
   - **Policies:** Users can read/insert own NDAs

9. **ndas** (V16 schema)
   - **Columns:** `id`, `listing_id`, `buyer_id`, `status` (enum: 'requested'|'signed'|'revoked'), `signed_at`, `created_at`, `updated_at`
   - **RLS:** Enabled

10. **watchlist**
    - **Columns:** `id` (uuid, PK), `user_id` (uuid, FK), `listing_id` (uuid, FK), `created_at`
    - **RLS:** Enabled
    - **Policies:** Users can read/manage own watchlist

11. **events**
    - **Columns:** `id`, `deal_room_id`, `listing_id`, `actor_id`, `type` (enum), `payload` (jsonb), `created_at`
    - **RLS:** Enabled
    - **Types:** 'listing_created', 'listing_published', 'nda_requested', 'nda_signed', 'deal_room_created', 'doc_uploaded', 'note_added', 'message_sent', 'stage_changed', 'score_updated', 'deal_closed', 'deal_paused'

12. **scores**
    - **Columns:** `id`, `entity_type`, `entity_id`, `scope`, `score_key`, `score_value`, `breakdown` (jsonb), `updated_at`
    - **RLS:** Enabled

13. **user_roles**
    - **Columns:** `id`, `user_id` (FK to profiles), `role`, `created_at`
    - **Purpose:** Multi-role support (future-proof)
    - **RLS:** Enabled

14. **valuations**
    - **Referenced in:** Migration `20250101_create_valuations_table.sql`
    - **Status:** Present in migrations

15. **analytics_events**
    - **Referenced in:** Migration `20250102_create_analytics_events.sql`
    - **Status:** Present in migrations

16. **contact_messages**
    - **Referenced in:** Migration `20241208_contact_messages.sql`
    - **Status:** Present in migrations

17. **partner_profiles**
    - **Referenced in:** Migration `20241208_partner_profiles.sql`
    - **Status:** Present in migrations

18. **listing_upgrades**
    - **Referenced in:** Migration `20241208_listing_upgrades.sql`
    - **Status:** Present in migrations

19. **leads**
    - **Referenced in:** Migration `20241208_leads.sql`
    - **Status:** Present in migrations

### Enums

1. **asset_type:** 'operational' | 'digital'
2. **listing_status:** 'draft' | 'published' | 'paused' | 'archived'
3. **nda_status:** 'requested' | 'signed' | 'revoked'
4. **deal_stage:** 'discover' | 'interest' | 'nda' | 'deal_room' | 'due_diligence' | 'negotiation' | 'closing' | 'post_close'
5. **event_type:** (see events table above)

### RPC Functions

1. **create_deal_room_with_nda**
   - **File:** `supabase/migrations/20251230_000001_create_deal_room_with_nda.sql`
   - **Signatures:** Two overloaded versions:
     - `(_buyer_id uuid, _initial_message text, _listing_id uuid)`
     - `(_listing_id uuid, _buyer_id uuid, _signed_pdf_url text, _initial_message text)`
   - **Purpose:** Creates deal room, NDA record, and members in one transaction
   - **Security:** SECURITY DEFINER, requires `_buyer_id = auth.uid()`
   - **Permissions:** EXECUTE granted to authenticated users

2. **handle_new_user()** (Trigger function)
   - **Purpose:** Auto-creates profile on user signup
   - **Trigger:** `on_auth_user_created` on `auth.users` INSERT

3. **set_updated_at()** (Trigger function)
   - **Purpose:** Updates `updated_at` timestamp
   - **Triggers:** Applied to profiles, listings, ndas, deal_rooms

### Views

1. **v_user_capabilities**
   - **Purpose:** Aggregates user roles from profiles and user_roles tables
   - **Columns:** `user_id`, `primary_role`, `roles` (array), `is_admin` (boolean)

### RLS Policies (Summary)

- **profiles:** Users can read/update own; admins can read all
- **listings_v16:** Public can read published/teaser; owners can read/update own; admins can read all
- **deal_rooms:** Members (buyer/seller) can read their deal rooms
- **deal_room_members:** Users can read own memberships
- **signed_ndas:** Users can read/insert own NDAs
- **watchlist:** Users can manage own watchlist
- **events:** Users can read events for their deal rooms
- **scores:** Users can read scores for their entities
- **user_roles:** Users can read/manage own non-admin roles; admins can manage all

### Migration History

- `20241208_core_schema.sql` - Initial core schema (profiles, listings, watchlist, ndas, deal_rooms)
- `20241208_contact_messages.sql` - Contact messages table
- `20241208_leads.sql` - Leads table
- `20241208_listing_upgrades.sql` - Listing upgrades
- `20241208_partner_profiles.sql` - Partner profiles
- `20241208_subscriptions_profiles.sql` - Subscriptions
- `20241215_add_ai_fields_to_listings.sql` - AI fields added
- `20250101_create_valuations_table.sql` - Valuations table
- `20250102_create_analytics_events.sql` - Analytics events
- `20250127_add_profiles_role_column.sql` - Role column added
- `20250127_promote_first_admin.sql` - Admin promotion
- `20250127_roles_refinement.sql` - Roles refinement (multi-role support, triggers)
- `20251225_v16_core_spine.sql` - **V16 core schema** (profiles, listings, ndas, deal_rooms, events, scores)
- `20251230_000001_create_deal_room_with_nda.sql` - Deal room RPC function
- `20260101_set_listings_v16_id_default.sql` - Set listings_v16.id default

---

## F) Runtime / Build Health

### Lint Status

**Command:** `pnpm lint`

**Result:** ❌ **FAILED** (Permission error)
- **Error:** `EPERM: operation not permitted, open '/Users/vishalkanwar/Projects/nxtowner-next/node_modules/.pnpm/path-key@3.1.1/node_modules/path-key/index.js'`
- **Cause:** Sandbox permissions (expected in audit environment)
- **Note:** Lint script exists and is configured (eslint)

### Build Status

**Command:** Not executed (would require network access for dependencies)

**Expected Build Command:** `pnpm build`

### Known Issues (from codebase audit)

1. **V15/V16 Table Inconsistency**
   - Some files query `listings` table directly (bypassing V16 repo)
   - **Files:** See `WIRING_SYNC_AUDIT.md` for complete list
   - **Status:** ~60% migration complete per audit docs

2. **Mixed Field Naming**
   - Some components use `hero_image_url` vs `heroImageUrl`
   - **Status:** Documented in `WIRING_SYNC_AUDIT.md`

3. **Direct Table Queries**
   - 13+ files still query `listings` table directly (should use V16 repo)
   - **Priority:** HIGH per audit docs

---

## G) Environment Variables Baseline

### Required Environment Variables

#### Public (Client-Side Safe)
1. **NEXT_PUBLIC_SUPABASE_URL**
   - **Usage:** Supabase client initialization (browser & server)
   - **Files:** `src/utils/supabase/client.ts`, `src/utils/supabase/server.ts`, `src/components/home/Hero.tsx`
   - **Status:** ✅ **CRITICAL** - Required for all Supabase operations
   - **Validation:** Validated in client/server setup functions

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - **Usage:** Supabase client initialization (browser & server)
   - **Files:** `src/utils/supabase/client.ts`, `src/utils/supabase/server.ts`
   - **Status:** ✅ **CRITICAL** - Required for all Supabase operations
   - **Validation:** Validated in client/server setup functions

3. **NEXT_PUBLIC_SITE_URL**
   - **Usage:** Site URL configuration
   - **Files:** `src/utils/env.ts`
   - **Status:** ⚠️ Optional (has presence flag)

4. **NODE_ENV**
   - **Usage:** Environment detection
   - **Files:** `src/utils/env.ts`
   - **Status:** ✅ Standard Next.js variable

5. **NEXT_PUBLIC_DEBUG_LISTINGS**
   - **Usage:** Debug flag for listings (value: "1")
   - **Files:** `src/lib/v16/listings.repo.ts`
   - **Status:** Optional debug flag

#### Server-Only (Secret)
1. **SUPABASE_SERVICE_ROLE_KEY**
   - **Usage:** Admin Supabase client for service role operations
   - **Files:** `src/utils/supabase/admin.ts`, `src/lib/supabaseAdmin.ts`
   - **Status:** ✅ **CRITICAL** - Required for admin operations, RPC calls
   - **Validation:** Has presence flag in `getServerEnvFlags()`

2. **STRIPE_WEBHOOK_SECRET**
   - **Usage:** Stripe webhook signature verification
   - **Files:** `src/app/api/webhook/stripe/route.ts`
   - **Status:** ✅ **CRITICAL** - Required for Stripe webhooks
   - **Validation:** Has presence flag in `getServerEnvFlags()`

3. **STRIPE_PRICE_PRO_BUYER**
   - **Usage:** Stripe price ID for Buyer Pro plan
   - **Files:** `src/utils/env.ts`
   - **Status:** ⚠️ Optional (has presence flag)

4. **STRIPE_PRICE_VERIFIED_SELLER**
   - **Usage:** Stripe price ID for Verified Seller plan
   - **Files:** `src/utils/env.ts`
   - **Status:** ⚠️ Optional (has presence flag)

5. **STRIPE_PRICE_PARTNER_PRO**
   - **Usage:** Stripe price ID for Partner Pro plan
   - **Files:** `src/utils/env.ts`
   - **Status:** ⚠️ Optional (has presence flag)

### Environment Variable Utilities

**File:** `src/utils/env.ts`

**Functions:**
- `getPublicEnvFlags()` - Returns boolean presence flags (client-safe)
- `getServerEnvFlags()` - Returns boolean presence flags (server-only)

**Note:** Functions return flags only (not actual values) for security.

### Missing Variables (from code patterns)

Based on code usage, all critical variables are documented above. Optional variables may be missing but won't break core functionality.

---

## H) Naming & Versioning Baseline

### Table Versioning

#### Active Tables
- **`listings_v16`** - ✅ **PRIMARY ACTIVE TABLE** for listings
  - Used by: V16 canonical repo (`src/lib/v16/listings.repo.ts`)
  - Used by: Admin queries, write operations
  - Schema: V16 core spine migration (`20251225_v16_core_spine.sql`)

#### Legacy/Archived Tables
- **`listings_v15_legacy`** - ❌ **LEGACY** (referenced in types, not actively queried)
  - Status: Present in `database.types.ts` but not used in active code
  - Purpose: Migration reference only

- **`listings`** (non-versioned) - ⚠️ **MIXED USAGE**
  - Some code still queries this table directly
  - **Status:** Should migrate to `listings_v16` per audit docs
  - **Files with direct queries:** See `WIRING_SYNC_AUDIT.md`

### Version References in Code

#### V15 (Legacy)
- Referenced in: `WIRING_SYNC_AUDIT.md`, `UPGRADE_STATUS_AUDIT.md`
- Status: Being phased out
- Tables: `listings_v15_legacy` (archived), `listings` (legacy, being migrated)

#### V16 (Current)
- **Canonical Repo:** `src/lib/v16/listings.repo.ts`
- **Tables:** `listings_v16`
- **Migration:** `20251225_v16_core_spine.sql`
- **Status:** ✅ **ACTIVE PRIMARY VERSION**
- **Used By:** Browse pages, listing detail pages, canonical read operations

#### V17 (Future/Partial)
- Referenced in: Documentation files, migration comments
- Status: Planning/partial implementation
- Tables: Same as V16 (no separate V17 table yet)
- Features: V17 Valuation Engine (mentioned in SellerCTA component)

### Naming Conventions

#### File Structure
- **Route Groups:** `(admin)`, `(buyer)`, `(founder)`, `(partner)`, `(platform)`, `(seller)`
- **Server Actions:** `src/app/actions/*.ts` (kebab-case file names)
- **Components:** `src/components/*/*.tsx` (PascalCase component names, kebab-case directories)
- **Lib Functions:** `src/lib/*/*.ts` (camelCase function names)

#### Database Naming
- **Tables:** `snake_case` (e.g., `listings_v16`, `deal_rooms`, `signed_ndas`)
- **Columns:** `snake_case` (e.g., `owner_id`, `created_at`, `hero_image_url`)
- **Enums:** `snake_case` values (e.g., 'operational', 'digital', 'published')
- **RPC Functions:** `snake_case` (e.g., `create_deal_room_with_nda`)

#### Code Naming
- **TypeScript Types:** `PascalCase` (e.g., `ListingTeaserV16`, `BrowseFiltersV16`)
- **Functions:** `camelCase` (e.g., `searchListingsV16`, `getListingByIdV16`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `PUBLIC_VISIBLE_STATUSES`, `NAV_LINKS_PUBLIC`)

### Current Truth Summary

#### Data Layer
- **Primary Listings Table:** `listings_v16` ✅
- **Canonical Read API:** `src/lib/v16/listings.repo.ts` ✅
- **Write Operations:** Direct table queries (by design) ✅
- **Legacy Tables:** `listings_v15_legacy` (archived), `listings` (being migrated) ⚠️

#### Schema Version
- **Current:** V16 (core spine migration applied)
- **Future:** V17 (referenced in docs, no separate schema yet)
- **Legacy:** V15 (being phased out)

#### Migration Status
- **V16 Migration:** ✅ Core schema applied
- **Code Migration:** ~60% complete (per `WIRING_SYNC_AUDIT.md`)
- **Remaining Work:** Migrate 13+ files from direct `listings` queries to V16 repo

---

## Summary Statistics

### Frontend
- **Total Routes:** ~60+ pages
- **Route Groups:** 5 groups + standalone routes
- **Homepage Sections:** 9 active sections
- **Layout Components:** 4 (ConditionalLayout, Navbar, Footer, MainNav)
- **Server Actions:** 30 action files

### Backend
- **Primary Tables:** ~19 tables (core + feature tables)
- **Active Listings Table:** `listings_v16`
- **RPC Functions:** 1 documented (`create_deal_room_with_nda`)
- **Triggers:** 3 (auto-profile creation, updated_at on 4 tables)
- **RLS Policies:** Enabled on all public tables
- **Enums:** 5 (asset_type, listing_status, nda_status, deal_stage, event_type)

### Environment
- **Critical Env Vars:** 4 (2 public, 2 server-only)
- **Optional Env Vars:** 5 (Stripe pricing, debug flags)
- **Validation:** Present in `src/utils/env.ts`

### Version Status
- **Primary Version:** V16 ✅
- **Legacy Version:** V15 (being phased out) ⚠️
- **Future Version:** V17 (referenced, not implemented) 🔮
- **Migration Completion:** ~60% (per audit docs)

---

**End of System Baseline Report**



