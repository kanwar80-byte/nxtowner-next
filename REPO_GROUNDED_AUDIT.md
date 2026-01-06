# NXTOWNER — REPO-GROUNDED SECURITY + TECHNICAL AUDIT
**Date:** 2025-01-XX  
**Type:** Read-Only Audit (No Changes Applied)  
**Scope:** Session Management, Runtime Validation, Service Role Usage, RLS Bypass, Audit Trails, Search Performance

---

## A) SESSION REFRESH

### Finding A1: Proxy Uses `getUser()` Instead of Explicit `updateSession()`

**What:** The `proxy.ts` middleware relies on `getUser()` to refresh sessions, but this is implicit behavior. The standard pattern uses `updateSession()` explicitly.

**Evidence:**
- **File:** `src/proxy.ts:74-77`
```typescript
// This call effectively refreshes the session if needed
const {
  data: { user },
} = await supabase.auth.getUser();
```

**Impact:**
- `getUser()` may refresh tokens, but it's not guaranteed to update cookies in the response
- Cookie handling in `setAll` (lines 59-68) creates a new response, but session refresh may not be properly propagated
- Risk: Users may experience session expiration during long browsing sessions

**Fix Recommendation:**
- **File:** `src/proxy.ts`
- **Change:** Add explicit `updateSession()` call OR verify that `getUser()` pattern properly updates cookies
- **Lines to modify:** After line 72 (after creating supabase client), before line 74
- **Pattern:** Use the standard `@supabase/ssr` pattern with `updateSession(request, response)` if available, or ensure cookie refresh is explicit

---

## B) RUNTIME VALIDATION

### Finding B1: API Routes Parse JSON Without Zod Validation

**What:** Multiple API routes parse `request.json()` directly without runtime schema validation.

**Evidence:**

**B1.1: `/api/valuation` Route**
- **File:** `src/app/api/valuation/route.ts:30`
```typescript
const body: ValuationRequest = await request.json();

// Validate required fields
if (
  !body.asset_type ||
  !body.location ||
  body.annual_revenue === undefined ||
  // ... manual checks only
) {
```
- **Issue:** Manual validation only checks presence, not types or ranges
- **Risk:** Type coercion errors, invalid data reaching database, potential SQL injection if values are used in queries

**B1.2: `/api/v17/ai-search` Route**
- **File:** `src/app/api/v17/ai-search/route.ts:22-23`
```typescript
const body = await request.json();
query = body?.query || '';
```
- **Issue:** No validation of `body` structure
- **Risk:** Malformed requests could cause runtime errors

**B1.3: `/api/ai-search-listings` Route**
- **File:** `src/app/api/ai-search-listings/route.ts:26`
```typescript
const { query, mode, location: requestLocation } = await request.json();
```
- **Issue:** Destructuring without validation
- **Risk:** Undefined values, type mismatches

**B1.4: `/api/events` Route**
- **File:** `src/app/api/events/route.ts:24`
```typescript
const body = await request.json();
```
- **Issue:** No validation of event payload structure
- **Risk:** Invalid events stored in database, potential data corruption

**B1.5: `/api/nda/sign` Route**
- **File:** `src/app/api/nda/sign/route.ts:8`
```typescript
const { listingId } = await req.json();
```
- **Issue:** No validation that `listingId` is a valid UUID
- **Risk:** Invalid UUIDs could cause database errors or security issues

**Impact:**
- **SQL Injection Risk:** If unvalidated strings are used in queries
- **Type Errors:** Runtime crashes from unexpected data types
- **Data Corruption:** Invalid data stored in database
- **XSS Risk:** If user input is rendered without sanitization

**Fix Recommendation:**
- **Files to modify:**
  1. `src/app/api/valuation/route.ts` - Add Zod schema for `ValuationRequest`
  2. `src/app/api/v17/ai-search/route.ts` - Add Zod schema for `{ query: string }`
  3. `src/app/api/ai-search-listings/route.ts` - Add Zod schema for search request
  4. `src/app/api/events/route.ts` - Add Zod schema for event payload
  5. `src/app/api/nda/sign/route.ts` - Add Zod schema for `{ listingId: string }` (UUID validation)
- **Pattern:** Import `z` from `zod`, define schema, use `.parse()` or `.safeParse()`

---

### Finding B2: Server Actions Accept `any` Types

**What:** Server actions accept `formData: any` without runtime validation.

**Evidence:**

**B2.1: `createListing` Server Action**
- **File:** `src/app/actions/createListing.ts:7`
```typescript
export async function createListing(formData: any) {
```
- **Issue:** No type safety or runtime validation
- **Risk:** Invalid data can reach database, type errors at runtime

**B2.2: Multiple Actions Use `as any` Assertions**
- **File:** `src/lib/v16/listings.repo.ts:50, 61, 62, 84, 124, 135, 136`
```typescript
const assetType = normalizeAssetType(filters.assetType ?? (filters as any).type);
const categoryId = normalizeId((filters as any).categoryId ?? (filters as any).category);
for (const row of data as any[]) {
```
- **Issue:** Type assertions bypass TypeScript safety
- **Risk:** Runtime errors if data structure changes

**Impact:**
- Type safety is bypassed, leading to potential runtime errors
- No validation that form data matches expected schema
- Database operations may fail with cryptic errors

**Fix Recommendation:**
- **Files to modify:**
  1. `src/app/actions/createListing.ts` - Replace `formData: any` with Zod schema
  2. `src/lib/v16/listings.repo.ts` - Remove `as any` assertions, use proper types
- **Pattern:** Define Zod schemas for all server action inputs

---

## C) SERVICE ROLE & RLS BYPASS

### Finding C1: Service Role Used for Analytics Events (Bypasses RLS)

**What:** `analytics/server.ts` uses service role key to insert events, bypassing ALL RLS policies.

**Evidence:**
- **File:** `src/lib/analytics/server.ts:17-29`
```typescript
export function getServiceSupabaseClient() {
  // ...
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function recordEventServer(payload: EventPayload): Promise<void> {
  const supabase = getServiceSupabaseClient();
  // ...
  const { error } = await supabase.from("events").insert(insertPayload);
}
```

**Impact:**
- **CRITICAL:** Service role bypasses ALL RLS policies
- If `events` table has RLS enabled, this is intentional (analytics need to write)
- **Risk:** If service role key is leaked, attacker can write to ANY table
- **Risk:** No audit trail of who inserted events (service role has no user context)

**Fix Recommendation:**
- **File:** `src/lib/analytics/server.ts`
- **Verification needed:**
  1. Confirm `events` table RLS policies allow service role writes
  2. Document that service role usage is intentional for analytics
  3. Consider adding `actor_id` to events to track which user triggered the event
- **Lines to review:** 65-88 (verify RLS policies in database)

---

### Finding C2: Multiple Service Role Clients Exist

**What:** Service role is used in multiple places, increasing attack surface.

**Evidence:**

**C2.1: `supabaseAdmin.ts`**
- **File:** `src/lib/supabaseAdmin.ts:7-12`
```typescript
export const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;
```

**C2.2: `analytics/server.ts`**
- **File:** `src/lib/analytics/server.ts:24-29` (see C1)

**C2.3: `analytics/aggregates.ts`**
- **File:** `src/lib/analytics/aggregates.ts:21`
```typescript
return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
```

**C2.4: `dealRoom.ts`**
- **File:** `src/lib/dealRoom.ts:2, 48-49`
```typescript
import { supabaseAdmin } from "./supabaseAdmin";
// ...
if (!supabaseAdmin) {
  throw new Error("Supabase admin client is not configured...");
}
const { data: listing, error: listingErr } = await (supabaseAdmin as any)
```

**C2.5: `app/api/nda/sign/route.ts`**
- **File:** `src/app/api/nda/sign/route.ts:2, 5`
```typescript
import { createClient } from '@/lib/supabaseAdmin';
const supabase = createClient();
```

**Impact:**
- Multiple entry points using service role increase risk if key is compromised
- Need to verify each usage is necessary and properly secured
- Some usages may be legitimate (admin operations, analytics), but need documentation

**Fix Recommendation:**
- **Audit all service role usages:**
  1. `src/lib/supabaseAdmin.ts` - Document why service role is needed
  2. `src/lib/analytics/server.ts` - Verify `events` table RLS allows service role
  3. `src/lib/analytics/aggregates.ts` - Verify read access is necessary
  4. `src/lib/dealRoom.ts` - Verify if service role is needed or can use user context
  5. `src/app/api/nda/sign/route.ts` - Verify if service role is needed for NDA signing
- **Action:** Create a centralized service role usage document listing all usages and justifications

---

### Finding C3: Analytics Tables RLS Status

**What:** Analytics tables have RLS enabled, but service role is used for writes.

**Evidence:**
- **File:** `supabase/sql/0003_analytics_tables.sql:76-79`
```sql
ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_funnel_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_feature_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_revenue_daily ENABLE ROW LEVEL SECURITY;
```

- **File:** `supabase/sql/0003_analytics_tables.sql:126-132`
```sql
CREATE POLICY "analytics_daily_insert_service_role"
  ON public.analytics_daily
  FOR INSERT
  USING (auth.role() = 'service_role');

CREATE POLICY "analytics_daily_update_service_role"
  ON public.analytics_daily
  FOR UPDATE
  USING (auth.role() = 'service_role');
```

**Impact:**
- ✅ **GOOD:** RLS policies explicitly allow service role for inserts/updates
- ✅ **GOOD:** Analytics tables are protected from unauthorized reads
- **Status:** This is correctly configured

**Fix Recommendation:**
- **No fix needed** - This is the correct pattern for analytics tables
- **Verification:** Confirm all analytics tables have similar policies

---

## D) AUDIT TRAIL (DB TRIGGERS)

### Finding D1: No Audit Triggers for Listings Table

**What:** No automatic audit triggers found for `listings` table INSERT/UPDATE/DELETE operations.

**Evidence:**
- **Search results:** No triggers matching `audit.*listing|listing.*audit|audit_listing`
- **Existing triggers:** Only `updated_at` triggers found:
  - `supabase/migrations/20241208_core_schema.sql:384` - `update_listings_updated_at`
  - `supabase/migrations/20251225_v16_core_spine.sql:146` - `set_listings_updated_at`
- **Audit table exists:** `supabase/sql/0002_audit_events.sql` defines `audit_events` table

**Impact:**
- **CRITICAL:** No automatic logging of:
  - Listing creation
  - Listing status changes (draft → published)
  - Price changes
  - Owner changes
  - Listing deletions
- **Compliance Risk:** Cannot audit who changed what and when
- **Security Risk:** Cannot detect unauthorized modifications

**Fix Recommendation:**
- **File to create:** `supabase/migrations/YYYYMMDD_add_listings_audit_trigger.sql`
- **Content:** PL/pgSQL function + trigger to log all INSERT/UPDATE/DELETE on `listings` table
- **Pattern:**
```sql
CREATE OR REPLACE FUNCTION audit_listing_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_events (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    summary,
    metadata
  ) VALUES (
    auth.uid(),
    CASE WHEN TG_OP = 'INSERT' THEN 'listing.created'
         WHEN TG_OP = 'UPDATE' THEN 'listing.updated'
         WHEN TG_OP = 'DELETE' THEN 'listing.deleted'
    END,
    'listing',
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'UPDATE' THEN 
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'old_price', OLD.asking_price,
        'new_price', NEW.asking_price
      )
    END,
    jsonb_build_object('operation', TG_OP)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_listings
  AFTER INSERT OR UPDATE OR DELETE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION audit_listing_changes();
```

---

### Finding D2: No Audit Triggers for NDAs or Deal Rooms

**What:** No audit triggers for sensitive operations (NDA signing, deal room creation).

**Evidence:**
- **Search results:** No triggers matching `audit.*nda|nda.*audit|audit.*deal`
- **Tables affected:** `ndas`, `deal_rooms`, `signed_ndas`

**Impact:**
- Cannot audit NDA signings (critical for legal compliance)
- Cannot audit deal room access (security risk)
- Cannot track when deals progress through stages

**Fix Recommendation:**
- **Files to create:**
  1. `supabase/migrations/YYYYMMDD_add_ndas_audit_trigger.sql`
  2. `supabase/migrations/YYYYMMDD_add_deal_rooms_audit_trigger.sql`
- **Pattern:** Similar to D1, but for `ndas` and `deal_rooms` tables

---

## E) SEARCH PERFORMANCE/INDEXES

### Finding E1: Search Uses `ilike` with Leading Wildcards (No Index Possible)

**What:** Search queries use `ilike` with `%query%` pattern, preventing index usage.

**Evidence:**

**E1.1: `listings.repo.ts`**
- **File:** `src/lib/v16/listings.repo.ts:120`
```typescript
if (filters.query) {
  query = query.ilike("title", `%${filters.query}%`);
}
```

**E1.2: `listings.repo.ts` (Featured)**
- **File:** `src/lib/v16/listings.repo.ts:233`
```typescript
if (searchQuery) {
  query = query.ilike("title", `%${searchQuery}%`);
}
```

**E1.3: `listings.repo.server.ts`**
- **File:** `src/lib/v17/listings.repo.server.ts:167` (inferred from grep results)

**Impact:**
- **Performance:** Full table scan required for every search
- **Scalability:** Search performance degrades linearly with table size
- **User Experience:** Slow searches on large datasets

**Fix Recommendation:**
- **Files to modify:**
  1. `src/lib/v16/listings.repo.ts` - Replace `ilike` with full-text search
  2. `src/lib/v17/listings.repo.server.ts` - Replace `ilike` with full-text search
- **Database migration needed:**
  - **File:** `supabase/migrations/YYYYMMDD_add_fulltext_search.sql`
  - **Content:**
```sql
-- Enable pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index for trigram search
CREATE INDEX IF NOT EXISTS idx_listings_title_trgm 
  ON public.listings USING gin(title gin_trgm_ops);

-- Or use full-text search
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS title_tsvector tsvector;
CREATE INDEX IF NOT EXISTS idx_listings_title_fts 
  ON public.listings USING gin(title_tsvector);

-- Update trigger to maintain tsvector
CREATE OR REPLACE FUNCTION listings_title_tsvector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.title_tsvector := to_tsvector('english', COALESCE(NEW.title, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_title_tsvector_trigger
  BEFORE INSERT OR UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION listings_title_tsvector_update();
```
- **Code change:** Replace `ilike` with `textSearch()` or `or()` with trigram matching

---

### Finding E2: Missing Indexes on Frequently Filtered Columns

**What:** Columns used in WHERE and ORDER BY clauses may not have indexes.

**Evidence:**

**E2.1: Category/Subcategory Filtering**
- **File:** `src/lib/v16/listings.repo.ts:139-140`
```typescript
if (categoryId) query = query.eq("category_id", categoryId);
if (subcategoryId) query = query.eq("subcategory_id", subcategoryId);
```
- **Database:** No indexes found for `category_id` or `subcategory_id` in search results

**E2.2: Price Sorting**
- **File:** `src/lib/v16/listings.repo.ts:145-147`
```typescript
if (filters.sort === "price_asc") query = query.order("asking_price", { ascending: true });
else if (filters.sort === "price_desc") query = query.order("asking_price", { ascending: false });
```
- **Database:** Index on `asking_price` may be missing

**E2.3: Location Filtering**
- **File:** `src/lib/v16/listings.repo.ts` (city, province used in queries)
- **Database:** No indexes found for `city` or `province`

**Impact:**
- Slow filtering by category/subcategory
- Slow price-based sorting
- Slow location-based filtering

**Fix Recommendation:**
- **File to create:** `supabase/migrations/YYYYMMDD_add_listings_search_indexes.sql`
- **Content:**
```sql
-- Category/Subcategory indexes
CREATE INDEX IF NOT EXISTS idx_listings_category_id ON public.listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_subcategory_id ON public.listings(subcategory_id);

-- Price index (for sorting)
CREATE INDEX IF NOT EXISTS idx_listings_asking_price ON public.listings(asking_price);

-- Location indexes
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_province ON public.listings(province);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_listings_asset_type_status 
  ON public.listings(asset_type, status) 
  WHERE status IN ('published', 'teaser');
```

---

### Finding E3: No Full-Text Search Implementation

**What:** Search uses simple string matching, not Postgres full-text search capabilities.

**Evidence:**
- **Search results:** No matches for `to_tsvector`, `tsquery`, `pg_trgm`, `textSearch`
- **Current implementation:** Only `ilike` with wildcards

**Impact:**
- No relevance ranking (results not sorted by match quality)
- No stemming (searches for "run" won't match "running")
- No multi-column search (only searches `title`, not description, category, etc.)

**Fix Recommendation:**
- **See E1** for full-text search implementation
- **Additional:** Consider searching across multiple columns:
  - `title`
  - `description` (if in listings table)
  - `category` name (via JOIN)
  - `subcategory` name (via JOIN)

---

## MINIMAL FIX PLAN

### Priority 1: Critical Security (Fix Immediately)

1. **Session Refresh Verification**
   - **File:** `src/proxy.ts`
   - **Action:** Verify `getUser()` pattern properly refreshes cookies, or add explicit `updateSession()` call
   - **Lines:** 74-77

2. **Add Zod Validation to API Routes**
   - **Files:**
     - `src/app/api/valuation/route.ts` (line 30)
     - `src/app/api/v17/ai-search/route.ts` (line 22)
     - `src/app/api/ai-search-listings/route.ts` (line 26)
     - `src/app/api/events/route.ts` (line 24)
     - `src/app/api/nda/sign/route.ts` (line 8)
   - **Action:** Add Zod schemas and `.parse()` calls

3. **Add Zod Validation to Server Actions**
   - **File:** `src/app/actions/createListing.ts` (line 7)
   - **Action:** Replace `formData: any` with Zod schema

4. **Create Audit Triggers**
   - **Files to create:**
     - `supabase/migrations/YYYYMMDD_add_listings_audit_trigger.sql`
     - `supabase/migrations/YYYYMMDD_add_ndas_audit_trigger.sql`
     - `supabase/migrations/YYYYMMDD_add_deal_rooms_audit_trigger.sql`
   - **Action:** Create PL/pgSQL functions and triggers

### Priority 2: High Impact (Fix Soon)

5. **Remove `as any` Assertions**
   - **File:** `src/lib/v16/listings.repo.ts` (lines 50, 61, 62, 84, 124, 135, 136)
   - **Action:** Use proper types or Zod validation

6. **Add Missing Indexes**
   - **File to create:** `supabase/migrations/YYYYMMDD_add_listings_search_indexes.sql`
   - **Action:** Add indexes on `category_id`, `subcategory_id`, `asking_price`, `city`, `province`

7. **Implement Full-Text Search**
   - **File to create:** `supabase/migrations/YYYYMMDD_add_fulltext_search.sql`
   - **Files to modify:**
     - `src/lib/v16/listings.repo.ts` (line 120)
     - `src/lib/v17/listings.repo.server.ts` (line 167)
   - **Action:** Replace `ilike` with `pg_trgm` or `tsvector` full-text search

### Priority 3: Documentation & Verification

8. **Document Service Role Usage**
   - **Action:** Create `docs/SERVICE_ROLE_USAGE.md` listing all service role usages and justifications
   - **Files to audit:**
     - `src/lib/supabaseAdmin.ts`
     - `src/lib/analytics/server.ts`
     - `src/lib/analytics/aggregates.ts`
     - `src/lib/dealRoom.ts`
     - `src/app/api/nda/sign/route.ts`

9. **Verify Analytics Table RLS**
   - **Action:** Confirm all analytics tables have proper RLS policies allowing service role writes
   - **Status:** Appears correct based on `0003_analytics_tables.sql`, but verify in production

---

## SUMMARY STATISTICS

- **Critical Issues:** 4 (Session refresh, No Zod validation in 5+ API routes, No audit triggers, Service role usage needs documentation)
- **High Priority:** 3 (Type safety gaps, Missing indexes, No full-text search)
- **Files Requiring Changes:** 12
- **New Migration Files Needed:** 5

---

**Audit Complete — No Changes Applied**  
**Next Step:** Review findings and apply fixes in priority order


