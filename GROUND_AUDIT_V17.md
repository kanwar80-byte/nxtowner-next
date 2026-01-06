# NxtOwner V17 Ground Audit Report
**Date:** 2025-01-XX  
**Focus:** Database Schema, Search Logic, RLS Security, Performance  
**Scope:** Supabase Integration & Data Wiring

---

## 1. DATABASE SCHEMA & TYPE SAFETY

### 1.1 Listings Table Structure Analysis

#### ✅ **CORE SCHEMA (V16 Core Spine)**
```sql
CREATE TABLE listings (
  id uuid PRIMARY KEY,
  owner_id uuid REFERENCES profiles(id),
  asset_type asset_type NOT NULL,  -- ENUM: 'operational' | 'digital'
  status listing_status DEFAULT 'draft',
  title text NOT NULL,
  asking_price numeric,
  currency text DEFAULT 'CAD',
  postal_code text,
  city text,                        -- ✅ Operational location
  province text,                     -- ✅ Operational location
  country text DEFAULT 'CA',
  category text,
  subcategory text,
  revenue_annual numeric,           -- ✅ Shared metric
  cashflow_annual numeric,          -- ✅ Operational metric
  ebitda_annual numeric,            -- ✅ Operational metric
  verification jsonb DEFAULT '{}',
  meta jsonb DEFAULT '{}',
  created_at timestamptz,
  updated_at timestamptz
);
```

#### ⚠️ **SCHEMA GAPS IDENTIFIED**

**1. Digital Metrics Stored in Separate Tables:**
- `digital_data` table: `mrr`, `churn_rate`, `tech_stack`, `monthly_visitors`, `domain_authority`
- `digital_metrics` table: `mrr`, `churn_rate_percent`, `ltv`, `cac`, `arr`, `tech_stack[]`
- **Problem:** Digital-specific metrics are NOT in the main `listings` table
- **Impact:** Queries must JOIN `digital_data` or `digital_metrics` to get MRR/churn for digital listings
- **Risk:** Inconsistent data if both tables exist, unclear which is canonical

**2. Operational Metrics in Main Table:**
- ✅ `cashflow_annual` - Operational metric
- ✅ `ebitda_annual` - Operational metric
- ✅ `city`, `province` - Operational location
- **Status:** Correctly stored in main `listings` table

**3. Missing Columns for Digital:**
- ❌ No `mrr` column in `listings` table (must JOIN `digital_data`)
- ❌ No `churn_rate` column in `listings` table
- ❌ No `tech_stack` column in `listings` table
- ❌ No `location_city` vs `city` distinction (both operational and digital use `city`)

**Recommendation:**
```sql
-- Option 1: Add nullable columns to listings (simpler queries)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS mrr numeric;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS churn_rate numeric;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS tech_stack text[];

-- Option 2: Keep separate tables but ensure single source of truth
-- Document which table is canonical (digital_data vs digital_metrics)
```

### 1.2 TypeScript Type Safety

#### ❌ **CRITICAL: Type Mismatch in SmartListingGrid**

**Problem:**
```typescript
// src/components/home/SmartListingGrid.tsx:13
import type { ListingTeaserV17 } from '@/lib/v17/types';

// But the component uses manual interface:
interface Listing {
  id: string;
  title: string;
  category: string;  // ❌ Should be category_id (UUID) or category name
  type: AssetType;
  price: string;     // ❌ Should be asking_price: number | null
  metricLabel: string;
  metricValue: string;
  // ...
}
```

**Issues:**
1. **Manual Type Definition:** `SmartListingGrid` defines its own `Listing` interface instead of using `ListingTeaserV17` from `@/lib/v17/types`
2. **Type Assertions:** Line 195: `mapV17ToGridListings(adaptedItems as any)` - Using `as any` bypasses type safety
3. **Runtime Errors Risk:** If `ListingTeaserV17` structure changes, `SmartListingGrid` won't catch it at compile time

**Database Types:**
- ✅ `src/types/database.types.ts` exists (3,187 lines) - Generated from Supabase CLI
- ✅ Used in client creation: `createClient<Database>()`
- ❌ **NOT used in SmartListingGrid** - Component uses manual types

**Fix Required:**
```typescript
// Replace manual interface with Database types
import type { Database } from '@/types/database.types';
type ListingRow = Database['public']['Tables']['listings']['Row'];

// Or use ListingTeaserV17 consistently
import type { ListingTeaserV17 } from '@/types/v17/search';
```

---

## 2. SUPER SEARCH LOGIC & INTENT

### 2.1 Search Flow Analysis

#### **Current Implementation:**

**1. Hero.tsx → AI Search:**
```typescript
// src/components/home/Hero.tsx:52
const response = await fetch('/api/ai-search-listings', {
  method: "POST",
  body: JSON.stringify({
    query: searchQuery,
    mode: mode,  // 'operational' | 'digital'
    location: locationQuery || null,
  }),
});
```

**2. AI Search Endpoint:**
- ✅ Uses Gemini AI (`/api/ai-search-listings`) for intent parsing
- ✅ Extracts filters from natural language query
- ✅ Returns structured filters + raw query

**3. SmartListingGrid → Manual Search:**
```typescript
// src/components/home/SmartListingGrid.tsx:151
const res = await fetch(`/api/search-listings?${sp.toString()}`, {
  cache: "no-store",
});
```

**4. Search Listings API:**
- Calls `searchListingsV16()` from `src/lib/v16/listings.repo.ts`
- Uses `listings_public_teaser` view

### 2.2 Filtering Logic Verification

#### ⚠️ **CRITICAL: Asset Type Filtering Not Strictly Enforced**

**In `src/lib/v16/listings.repo.ts`:**
```typescript
// Line 124-131
const assetType = normalizeAssetType(filters.assetType ?? (filters as any).type);

if (assetType === "operational") {
  query = query.or("asset_type.eq.operational,asset_type.is.null");  // ⚠️ Includes NULL
} else if (assetType === "digital") {
  query = query.eq("asset_type", "digital");  // ✅ Strict
}
```

**Problems:**
1. **Operational Filter Includes NULL:** When filtering for "operational", the query includes rows where `asset_type IS NULL`
   - **Risk:** Digital listings with NULL `asset_type` could leak into operational view
   - **Fix:** Remove `asset_type.is.null` from operational filter, or ensure all listings have `asset_type` set

2. **No Default Filter in SmartListingGrid:**
   - `SmartListingGrid` reads `effectiveAssetType` from URL or context
   - If `assetType` is missing, it falls back to `track` context
   - **Risk:** If context is wrong, wrong listings could be shown

3. **Search Query Doesn't Enforce Type:**
   - In `Hero.tsx`, the search query is sent to `/api/ai-search-listings`
   - The AI endpoint may not strictly enforce `mode` parameter
   - **Risk:** AI could return filters that don't match the selected mode

**Verification Needed:**
```typescript
// In SmartListingGrid, ensure assetType is ALWAYS set:
const effectiveAssetType = (urlAssetType || track || 'operational') as "operational" | "digital";

// In searchListingsV16, remove NULL from operational filter:
if (assetType === "operational") {
  query = query.eq("asset_type", "operational");  // Remove .or("asset_type.is.null")
}
```

### 2.3 Search Implementation Type

#### ✅ **AI-Intent Parsing (Gemini)**
- Hero search uses `/api/ai-search-listings` → Gemini AI
- Extracts structured filters from natural language
- **Status:** Advanced AI search implemented

#### ⚠️ **Postgres Full-Text Search**
- **Current:** Uses `ilike` with wildcards: `query.ilike("title", `%${filters.query}%`)`
- **Problem:** Leading wildcard prevents index usage, requires full table scan
- **Missing:** No `pg_trgm` or `tsvector` full-text search
- **Impact:** Slow searches on large datasets

**Recommendation:**
```sql
-- Enable pg_trgm for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_listings_title_trgm ON listings USING gin(title gin_trgm_ops);

-- Or use full-text search
ALTER TABLE listings ADD COLUMN title_tsvector tsvector;
CREATE INDEX idx_listings_title_fts ON listings USING gin(title_tsvector);
```

---

## 3. SECURITY & RLS (ROW LEVEL SECURITY)

### 3.1 RLS Policies Audit

#### ✅ **RLS ENABLED**
```sql
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
```

#### ✅ **POLICIES EXIST**

**1. Public Read (Published Listings):**
```sql
CREATE POLICY "Anyone can read active listings"
  ON public.listings FOR SELECT
  USING (status = 'active');
```
- ✅ Allows anonymous users to read published listings
- ⚠️ **Note:** Uses `status = 'active'` but V17 uses `status IN ('published', 'teaser')`
- **Risk:** If status values don't match, listings may not be visible

**2. Owner Access:**
```sql
CREATE POLICY "Owners can read their own listings"
  ON public.listings FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can create listings"
  ON public.listings FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own listings"
  ON public.listings FOR UPDATE
  USING (auth.uid() = owner_id);
```
- ✅ Correctly uses `auth.uid()` for owner checks
- ✅ Has `WITH CHECK` clause for INSERT

**3. Admin Access:**
```sql
CREATE POLICY "Admins can read all listings"
  ON public.listings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```
- ✅ Subquery checks admin role
- ⚠️ **Performance:** Subquery runs on every policy check (may be slow with many policies)

#### ❌ **MISSING POLICIES**

**1. No DELETE Policy:**
- No policy for DELETE operations
- **Risk:** If DELETE is allowed, users could delete listings they shouldn't
- **Fix:** Add explicit DELETE policy or verify DELETE is disabled

**2. Status Mismatch:**
- Policy checks `status = 'active'` but code uses `status IN ('published', 'teaser')`
- **Risk:** Published listings may not be visible to anonymous users
- **Fix:** Update policy to match V17 status values

**3. Anon INSERT/UPDATE:**
- ✅ Correctly restricted (no anon INSERT/UPDATE policies)
- **Status:** Secure

### 3.2 Middleware Session Management

#### ❌ **CRITICAL: Missing Session Refresh**

**Current Implementation (`src/proxy.ts`):**
```typescript
export async function proxy(request: NextRequest) {
  // ... creates supabase client
  
  const { data: { user } } = await supabase.auth.getUser();
  
  // ❌ NO updateSession() call
  // ... rest of logic
}
```

**Problem:**
- Proxy (middleware) does NOT call `updateSession()` to refresh auth tokens
- **Impact:**
  - Users logged out unexpectedly during long sessions
  - Expired tokens not refreshed
  - Session cookies not updated

**Fix Required:**
```typescript
import { updateSession } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(/* ... */);
  
  // ✅ CRITICAL: Refresh session before checking auth
  await updateSession(request, response);
  
  const { data: { user } } = await supabase.auth.getUser();
  // ... rest of logic
}
```

---

## 4. PERFORMANCE & INDEXING

### 4.1 Index Analysis

#### ✅ **EXISTING INDEXES**
```sql
-- Core indexes
CREATE INDEX idx_listings_owner ON listings(owner_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_type ON listings(type);  -- or asset_type
CREATE INDEX idx_listings_asset_type ON listings(asset_type);

-- Feature indexes
CREATE INDEX idx_listings_is_featured ON listings(is_featured);
CREATE INDEX idx_listings_is_ai_verified ON listings(is_ai_verified);
```

#### ❌ **MISSING INDEXES (Performance Risk)**

**1. Category/Subcategory Filtering:**
```typescript
// Used in queries but no index:
query.eq("category_id", categoryId);
query.eq("subcategory_id", subcategoryId);
```
- **Missing:** `idx_listings_category_id`, `idx_listings_subcategory_id`
- **Impact:** Slow category filtering

**2. Price Sorting:**
```typescript
// Used in ORDER BY but index may be missing:
query.order("asking_price", { ascending: true });
```
- **Missing:** `idx_listings_asking_price` (for sorting)
- **Impact:** Slow price-based sorting

**3. Location Filtering:**
```typescript
// Used in queries but no index:
query.eq("city", city);
query.eq("province", province);
```
- **Missing:** `idx_listings_city`, `idx_listings_province`
- **Impact:** Slow location filtering

**4. Full-Text Search:**
```typescript
// Uses ilike with wildcards (no index possible):
query.ilike("title", `%${query}%`);
```
- **Missing:** GIN index for full-text search
- **Impact:** Very slow searches on large datasets

**Recommendation:**
```sql
-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_listings_category_id ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_subcategory_id ON listings(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_listings_asking_price ON listings(asking_price);
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_province ON listings(province);

-- Full-text search index
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_listings_title_trgm ON listings USING gin(title gin_trgm_ops);
```

### 4.2 Server-Side Rendering vs Client-Side

#### ❌ **CRITICAL: SmartListingGrid Uses Client-Side Fetching**

**Current Implementation:**
```typescript
// src/components/home/SmartListingGrid.tsx:1
'use client';

// Line 210: useEffect for client-side fetching
useEffect(() => {
  async function fetchListings() {
    const v17Listings = await fetchV17Listings({ /* ... */ });
    // ...
  }
  fetchListings();
}, [/* deps */]);
```

**Problems:**
1. **No SSR:** Data fetched client-side after page load
2. **SEO Impact:** Search engines may not see listing data
3. **Performance:** Extra round-trip, slower initial render
4. **Loading State:** Users see loading spinner instead of content

**Current SSR Implementation:**
```typescript
// src/app/page.tsx:9
const [operationalListings, digitalListings] = await Promise.all([
  getFeaturedListingsV17({ asset_type: "operational", limit: 12 }),
  getFeaturedListingsV17({ asset_type: "digital", limit: 12 }),
]);
```
- ✅ Homepage uses SSR for initial data
- ❌ But `SmartListingGrid` re-fetches client-side even with `initialListings` prop

**Recommendation:**
```typescript
// Option 1: Use initialListings prop (already passed but ignored)
if (initialListings && initialListings.length > 0) {
  setListings(initialListings);
  return; // Don't fetch client-side if we have server data
}

// Option 2: Convert SmartListingGrid to Server Component
// Fetch data in parent Server Component, pass as props
```

---

## 5. HIGH RISK VULNERABILITIES & GAPS

### 🔴 **CRITICAL (Fix Immediately)**

1. **Missing Session Refresh in Proxy**
   - **File:** `src/proxy.ts`
   - **Risk:** Users logged out unexpectedly, expired tokens
   - **Fix:** Add `await updateSession(request, response)` before auth checks

2. **Asset Type Filter Includes NULL**
   - **File:** `src/lib/v16/listings.repo.ts:128`
   - **Risk:** Digital listings with NULL `asset_type` leak into operational view
   - **Fix:** Remove `asset_type.is.null` from operational filter

3. **Type Safety Gaps in SmartListingGrid**
   - **File:** `src/components/home/SmartListingGrid.tsx`
   - **Risk:** Runtime errors if `ListingTeaserV17` structure changes
   - **Fix:** Use `ListingTeaserV17` type instead of manual interface, remove `as any`

4. **RLS Policy Status Mismatch**
   - **Policy:** `status = 'active'` but code uses `status IN ('published', 'teaser')`
   - **Risk:** Published listings may not be visible to anonymous users
   - **Fix:** Update RLS policy to match V17 status values

### 🟡 **HIGH (Fix Soon)**

5. **Missing Indexes**
   - **Columns:** `category_id`, `subcategory_id`, `asking_price`, `city`, `province`
   - **Impact:** Slow filtering and sorting
   - **Fix:** Add indexes on frequently filtered/sorted columns

6. **No Full-Text Search Index**
   - **Current:** `ilike` with wildcards (no index possible)
   - **Impact:** Very slow searches on large datasets
   - **Fix:** Implement `pg_trgm` or `tsvector` full-text search

7. **Client-Side Data Fetching**
   - **Component:** `SmartListingGrid` uses `useEffect` instead of SSR
   - **Impact:** Poor SEO, slower initial render
   - **Fix:** Use `initialListings` prop or convert to Server Component

8. **Digital Metrics in Separate Tables**
   - **Tables:** `digital_data` vs `digital_metrics` (unclear which is canonical)
   - **Risk:** Inconsistent data, complex queries
   - **Fix:** Document canonical source or consolidate into `listings` table

### 🟢 **MEDIUM (Technical Debt)**

9. **Admin Policy Performance**
   - Subquery on every policy check
   - **Impact:** Performance degradation with many policies
   - **Fix:** Consider function or materialized view for admin checks

10. **No DELETE Policy**
    - Missing DELETE policy on `listings` table
    - **Risk:** If DELETE is allowed, users could delete listings
    - **Fix:** Add explicit DELETE policy or verify DELETE is disabled

---

## 6. VERIFICATION CHECKLIST

- [ ] Test session refresh: Log in, wait 1 hour, verify session still valid
- [ ] Test asset type filtering: Switch operational/digital, verify no cross-contamination
- [ ] Test RLS: Try to access other users' listings, verify denied
- [ ] Test status values: Verify published listings are visible to anonymous users
- [ ] Check query performance: Run `EXPLAIN ANALYZE` on search queries
- [ ] Verify indexes: Check `pg_indexes` for missing indexes
- [ ] Test type safety: Change `ListingTeaserV17` structure, verify TypeScript errors
- [ ] Test SSR: Disable JavaScript, verify listings still visible

---

## 7. PRIORITY ACTION ITEMS

### Immediate (This Week)
1. ✅ Add `updateSession()` to `src/proxy.ts`
2. ✅ Remove `asset_type.is.null` from operational filter
3. ✅ Fix type safety in `SmartListingGrid.tsx` (use `ListingTeaserV17`)
4. ✅ Update RLS policy: `status IN ('published', 'teaser')` instead of `status = 'active'`

### Short Term (This Month)
5. ✅ Add missing indexes (category_id, subcategory_id, asking_price, city, province)
6. ✅ Implement full-text search (`pg_trgm` or `tsvector`)
7. ✅ Use `initialListings` prop in `SmartListingGrid` (avoid client-side refetch)
8. ✅ Document canonical source for digital metrics (`digital_data` vs `digital_metrics`)

### Medium Term (Next Quarter)
9. ✅ Optimize admin policy checks (function/materialized view)
10. ✅ Add DELETE policy or verify DELETE is disabled
11. ✅ Consider consolidating digital metrics into `listings` table

---

**Report Generated By:** AI Ground Auditor  
**Next Review:** After implementing Priority Action Items


