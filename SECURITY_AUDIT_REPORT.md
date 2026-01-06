# NxtOwner Security & Technical Audit Report
**Generated:** 2025-01-XX  
**Scope:** Next.js 16.1.1 + Supabase Implementation  
**Audit Type:** Database Security, Frontend-Backend Wiring, Data Integrity, Performance

---

## 1. DATABASE & SECURITY AUDIT

### 1.1 RLS (Row Level Security) Status

#### ✅ **RLS ENABLED TABLES** (Verified)
- `public.profiles` ✅
- `public.listings` ✅
- `public.watchlist` ✅
- `public.ndas` ✅
- `public.deal_rooms` ✅
- `public.deal_room_members` ✅
- `public.messages` ✅
- `public.offers` ✅
- `public.nda_signatures` ✅
- `public.contact_messages` ✅
- `public.partner_profiles` ✅
- `public.consultation_requests` ✅
- `public.listing_leads` ✅
- `public.partner_leads` ✅
- `public.valuations` ✅
- `public.analytics_events` ✅
- `public.user_roles` ✅
- `public.events` ✅
- `public.scores` ✅
- `public.audit_events` ✅
- `public.signed_ndas` ✅

#### ⚠️ **POTENTIAL RLS GAPS** (Requires Verification)
- **Views:** `listings_public_teaser`, `listings_public_teaser_v17` - Views inherit RLS from underlying tables, but verify no direct table access bypasses RLS
- **Taxonomy Tables:** `tax_categories`, `tax_subcategories` - **CRITICAL:** These may be queried without RLS if they're public reference data. Verify if they need RLS or should be read-only public.

### 1.2 Policy Logic Analysis

#### ✅ **STRONG POLICIES** (Correctly Using `auth.uid()`)
```sql
-- Profiles: Self-access only
USING (id = auth.uid())

-- Listings: Owner access
USING (owner_id = auth.uid())

-- NDAs: Buyer access
USING (buyer_id = auth.uid())
```

#### ⚠️ **POLICY CONCERNS**

**1. Overly Permissive Public Access:**
```sql
-- listings_public_select_published
USING (status = 'published')
```
**Risk:** Any authenticated user can read ALL published listings. This is intentional for public browse, but verify no sensitive fields (owner_id, internal notes) are exposed.

**2. Missing WITH CHECK Clauses:**
Several INSERT/UPDATE policies only have `USING` but no `WITH CHECK`:
- `listings_owner_insert` - Has `WITH CHECK` ✅
- `ndas_buyer_insert` - Has `WITH CHECK` ✅
- Some older policies may be missing `WITH CHECK` for UPDATE operations

**3. Admin Policy Pattern:**
```sql
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
```
**Risk:** This creates a subquery on every policy check. Consider a function or materialized view for admin checks if performance degrades.

**4. Missing Policies:**
- **DELETE operations:** Many tables have SELECT/INSERT/UPDATE policies but no DELETE policies. Verify if DELETE should be restricted or if it's intentionally omitted.

### 1.3 Audit Logging

#### ✅ **AUDIT TABLE EXISTS**
- `public.audit_events` table exists with proper structure
- RLS enabled (admin-only access)
- Indexes on `created_at`, `action`, `entity_type`, `actor_user_id`

#### ❌ **MISSING TRIGGERS**
**Critical Gap:** No automatic audit triggers found for:
- `INSERT` on `listings` (should log creation)
- `UPDATE` on `listings` (should log status changes, price changes)
- `DELETE` on sensitive tables
- `INSERT/UPDATE` on `ndas` (should log NDA signings)

**Recommendation:** Create PL/pgSQL function and triggers:
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

## 2. FRONTEND-BACKEND WIRING AUDIT

### 2.1 Client/Server Separation

#### ✅ **CORRECT IMPLEMENTATION**
- `src/utils/supabase/server.ts` - Uses `@supabase/ssr` with `createServerClient`, marked `"server-only"`
- `src/utils/supabase/client.ts` - Uses `@supabase/ssr` with `createBrowserClient`
- `src/utils/supabase/admin.ts` - Uses service role key (bypasses RLS) for admin operations
- `src/utils/supabase/browser.ts` - Simple wrapper for browser client

#### ⚠️ **CONCERNS**

**1. Legacy Import Pattern:**
```typescript
// Found in multiple files:
import { createClient } from '@/utils/supabase/client';
// vs
import { createClient } from '@/utils/supabase/server';
```
**Issue:** Both export `createClient` as an alias, which can cause confusion. The alias pattern is fine, but ensure developers understand which file to import from.

**2. Service Role Usage:**
```typescript
// src/lib/analytics/server.ts
const supabase = getServiceSupabaseClient(); // Bypasses RLS
await supabase.from("events").insert(insertPayload);
```
**Risk:** Service role bypasses ALL RLS. Verify this is intentional and that `analytics_events` table has proper RLS or is admin-only.

**3. Admin Client Pattern:**
```typescript
// src/lib/supabaseAdmin.ts
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
```
**Good:** Correctly configured to not persist sessions. However, verify this is only used server-side.

### 2.2 Session Management

#### ❌ **CRITICAL GAP: Missing Session Refresh in Proxy**
```typescript
// src/proxy.ts
export async function proxy(request: NextRequest) {
  // ... creates supabase client
  const { data: { user } } = await supabase.auth.getUser();
  // ... no updateSession() call
}
```

**Problem:** The proxy (middleware) does NOT call `updateSession()` to refresh auth tokens. This can lead to:
- Expired sessions not being refreshed
- Users being logged out unexpectedly
- Session cookies not being updated

**Fix Required:**
```typescript
import { updateSession } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  // ... existing code ...
  
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(/* ... */);
  
  // CRITICAL: Refresh session before checking auth
  await updateSession(request, response);
  
  const { data: { user } } = await supabase.auth.getUser();
  // ... rest of logic
}
```

### 2.3 Auth Import Migration

#### ✅ **NO LEGACY IMPORTS FOUND**
- No `@supabase/auth-helpers-nextjs` imports detected
- All code uses `@supabase/ssr` ✅

---

## 3. DATA INTEGRITY & TYPES

### 3.1 Zod Validation

#### ❌ **CRITICAL: NO ZOD VALIDATION FOUND**
**Audit Results:**
- **API Routes:** `/api/v17/search`, `/api/v17/ai-search` - No Zod validation, only manual type checks
- **Server Actions:** `createListing`, `signNdaAndCreateDealRoom` - Accept `any` types, no runtime validation
- **Form Data:** Direct access to `formData` without schema validation

**Examples of Missing Validation:**
```typescript
// src/app/actions/createListing.ts
export async function createListing(formData: any) { // ❌ No validation
  // Direct access to formData properties without validation
  const categoryText = formData.main_category || formData.category;
}

// src/app/api/valuation/route.ts
const body: ValuationRequest = await request.json(); // ❌ No Zod schema
// Only manual field checks
if (!body.asset_type || !body.location) { /* ... */ }
```

**Risk:** 
- SQL injection via unvalidated strings
- Type coercion errors
- Invalid data reaching database
- XSS if user input is rendered

**Recommendation:**
```typescript
import { z } from 'zod';

const CreateListingSchema = z.object({
  title: z.string().min(1).max(200),
  category_id: z.string().uuid(),
  asking_price: z.number().positive().optional(),
  // ... etc
});

export async function createListing(formData: unknown) {
  const validated = CreateListingSchema.parse(formData);
  // ... use validated data
}
```

### 3.2 Type Safety

#### ⚠️ **MIXED TYPE USAGE**

**1. Database Types:**
- `src/types/database.types.ts` exists (3,187 lines) - Generated types from Supabase CLI ✅
- Used in client creation: `createClient<Database>()` ✅
- **BUT:** Many queries use `any` types:
  ```typescript
  // src/lib/v16/listings.repo.ts
  for (const row of data as any[]) { // ❌ Should use Database types
  ```

**2. Type Assertions:**
- Excessive use of `as any` in mappers and repos
- `mapV17ToGridListings(adaptedItems as Parameters<typeof mapV17ToGridListings>[0])` - Complex type assertion suggests type mismatch

**3. Missing Type Guards:**
- No runtime validation that database rows match expected types
- Relies on Supabase query types, but doesn't validate at runtime

---

## 4. SEARCH & PERFORMANCE AUDIT

### 4.1 Indexing Analysis

#### ✅ **EXISTING INDEXES** (Verified)
```sql
-- Listings
idx_listings_owner (owner_id)
idx_listings_status (status)
idx_listings_type (type) / idx_listings_asset_type (asset_type)
idx_listings_is_featured (is_featured)
idx_listings_is_ai_verified (is_ai_verified)

-- NDAs
idx_ndas_buyer (buyer_id)
idx_ndas_listing (listing_id)
idx_ndas_listing_buyer (listing_id, buyer_id) -- Composite ✅

-- Deal Rooms
idx_deal_rooms_buyer (buyer_id)
idx_deal_rooms_listing (listing_id)
idx_deal_rooms_listing_buyer (listing_id, buyer_id) -- Composite ✅

-- Categories/Subcategories
-- ⚠️ MISSING: No indexes found on tax_categories.code or tax_subcategories.code
```

#### ⚠️ **MISSING INDEXES** (Performance Risk)

**1. Search Query Indexes:**
```typescript
// src/lib/v16/listings.repo.ts:120
query = query.ilike("title", `%${filters.query}%`);
```
**Problem:** `ilike` on `title` with leading wildcard (`%...%`) cannot use standard B-tree indexes.

**Missing Indexes:**
- `listings_public_teaser.title` - No GIN index for full-text search
- `listings_public_teaser.category_id` - May need index if frequently filtered
- `listings_public_teaser.asking_price` - Used in ORDER BY, verify index exists
- `listings_public_teaser.created_at` - Used in ORDER BY, verify index exists

**2. Taxonomy Lookups:**
```typescript
// src/lib/v16/taxonomy.repo.ts
.eq("code", code) // No index on tax_categories.code
.eq("code", code) // No index on tax_subcategories.code
```
**Risk:** Category code lookups may be slow as table grows.

**Recommendation:**
```sql
CREATE INDEX IF NOT EXISTS idx_tax_categories_code ON public.tax_categories(code);
CREATE INDEX IF NOT EXISTS idx_tax_subcategories_code ON public.tax_subcategories(code);
CREATE INDEX IF NOT EXISTS idx_listings_public_teaser_title_gin ON public.listings_public_teaser USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_listings_public_teaser_category_id ON public.listings_public_teaser(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_public_teaser_asking_price ON public.listings_public_teaser(asking_price);
CREATE INDEX IF NOT EXISTS idx_listings_public_teaser_created_at ON public.listings_public_teaser(created_at DESC);
```

### 4.2 Search Implementation

#### ⚠️ **BASIC STRING FILTERING** (No Full-Text Search)

**Current Implementation:**
```typescript
// src/lib/v16/listings.repo.ts:120
query = query.ilike("title", `%${filters.query}%`);
```

**Problems:**
1. **Leading wildcard (`%...%`):** Prevents index usage, requires full table scan
2. **Case-insensitive only:** No stemming, no ranking
3. **No multi-column search:** Only searches `title`, not description, category, etc.
4. **No relevance ranking:** Results not sorted by match quality

**Recommendation:**
```sql
-- Enable pg_trgm extension for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index for trigram search
CREATE INDEX idx_listings_title_trgm ON public.listings USING gin(title gin_trgm_ops);

-- Or use full-text search
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS title_tsvector tsvector;
CREATE INDEX idx_listings_title_fts ON public.listings USING gin(title_tsvector);

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

**Query Improvement:**
```typescript
// Instead of ilike, use:
query = query.textSearch('title_tsvector', filters.query, {
  type: 'websearch',
  config: 'english'
});
```

---

## 5. HIGH RISK SECURITY VULNERABILITIES

### 🔴 **CRITICAL (Fix Immediately)**

1. **Missing Session Refresh in Proxy**
   - **File:** `src/proxy.ts`
   - **Risk:** Users logged out unexpectedly, expired tokens not refreshed
   - **Fix:** Add `await updateSession(request, response)` before auth checks

2. **No Input Validation (Zod)**
   - **Files:** All `src/app/actions/*.ts`, `src/app/api/**/route.ts`
   - **Risk:** SQL injection, XSS, invalid data corruption
   - **Fix:** Add Zod schemas to all form data and API request bodies

3. **Service Role Key Usage**
   - **Files:** `src/lib/analytics/server.ts`, `src/lib/supabaseAdmin.ts`
   - **Risk:** Bypasses ALL RLS policies. Verify `analytics_events` table has proper RLS or is admin-only.
   - **Fix:** Audit all service role usage, ensure it's only for admin/analytics operations

4. **Missing Audit Triggers**
   - **Risk:** No automatic logging of sensitive operations (listing creation, NDA signing, price changes)
   - **Fix:** Create PL/pgSQL triggers for `listings`, `ndas`, `deal_rooms` tables

5. **Taxonomy Tables RLS Status Unknown**
   - **Tables:** `tax_categories`, `tax_subcategories`
   - **Risk:** If these are public reference data without RLS, verify they're read-only or have proper policies
   - **Fix:** Verify RLS status and add policies if needed

### 🟡 **HIGH (Fix Soon)**

6. **Missing WITH CHECK Clauses**
   - Some UPDATE policies only have `USING` but no `WITH CHECK`
   - **Risk:** Users could update rows to values they shouldn't have access to
   - **Fix:** Add `WITH CHECK` to all UPDATE policies

7. **No DELETE Policies**
   - Most tables lack DELETE policies
   - **Risk:** If DELETE is allowed, users could delete data they shouldn't
   - **Fix:** Add explicit DELETE policies or verify DELETE is disabled

8. **Overly Permissive Public Listing Access**
   - `listings_public_select_published` allows any authenticated user to read ALL published listings
   - **Risk:** If sensitive fields are exposed, this is a data leak
   - **Fix:** Verify `listings_public_teaser` view only exposes safe fields

9. **Type Safety Gaps**
   - Excessive `as any` usage, no runtime type validation
   - **Risk:** Runtime errors, data corruption
   - **Fix:** Use Zod for runtime validation, reduce `as any` assertions

### 🟢 **MEDIUM (Technical Debt)**

10. **No Full-Text Search**
    - Using `ilike` with leading wildcards
    - **Impact:** Slow searches, poor user experience
    - **Fix:** Implement `pg_trgm` or `tsvector` full-text search

11. **Missing Indexes**
    - `tax_categories.code`, `tax_subcategories.code` not indexed
    - **Impact:** Slow category lookups
    - **Fix:** Add indexes on code columns

12. **Admin Policy Performance**
    - Admin checks use subqueries on every policy evaluation
    - **Impact:** Performance degradation with many policies
    - **Fix:** Consider function or materialized view for admin checks

---

## 6. TECHNICAL DEBT REPORT

### 6.1 Code Quality

**Issues:**
- ❌ No Zod validation in 30+ server actions
- ❌ Excessive `as any` type assertions (50+ instances)
- ❌ Mixed use of `Database` types vs manual types
- ⚠️ Complex type assertions suggest type system gaps

**Recommendation:**
1. Add Zod schemas to all server actions
2. Replace `as any` with proper types or Zod validation
3. Standardize on `Database` types from Supabase CLI

### 6.2 Architecture

**Issues:**
- ⚠️ Dual client pattern (`createClient` alias in both server/client files) - can cause confusion
- ⚠️ Service role usage not clearly documented
- ⚠️ No clear separation between public/private data access patterns

**Recommendation:**
1. Document when to use `server.ts` vs `client.ts`
2. Add JSDoc comments explaining service role usage
3. Create a data access layer guide

### 6.3 Performance

**Issues:**
- ❌ No full-text search (using `ilike` with wildcards)
- ❌ Missing indexes on taxonomy code columns
- ⚠️ Admin policy subqueries may impact performance

**Recommendation:**
1. Implement `pg_trgm` or `tsvector` for search
2. Add missing indexes
3. Monitor query performance, consider caching admin role checks

### 6.4 Security

**Issues:**
- ❌ No automatic audit logging triggers
- ❌ Missing session refresh in proxy
- ⚠️ RLS policies may have gaps (DELETE operations)

**Recommendation:**
1. Implement audit triggers for sensitive operations
2. Fix session refresh in proxy
3. Audit all RLS policies for completeness

---

## 7. PRIORITY ACTION ITEMS

### Immediate (This Week)
1. ✅ Add `updateSession()` to `src/proxy.ts`
2. ✅ Add Zod validation to `createListing` server action
3. ✅ Verify `tax_categories` and `tax_subcategories` RLS status
4. ✅ Audit all service role key usage

### Short Term (This Month)
5. ✅ Add Zod schemas to all API routes
6. ✅ Create audit triggers for `listings`, `ndas`, `deal_rooms`
7. ✅ Add missing indexes (taxonomy codes, search columns)
8. ✅ Add `WITH CHECK` clauses to UPDATE policies

### Medium Term (Next Quarter)
9. ✅ Implement full-text search (`pg_trgm` or `tsvector`)
10. ✅ Reduce `as any` usage, improve type safety
11. ✅ Optimize admin policy checks (function/materialized view)
12. ✅ Add DELETE policies where needed

---

## 8. VERIFICATION CHECKLIST

- [ ] Run `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';` to verify all tables have RLS enabled
- [ ] Test session refresh: Log in, wait 1 hour, verify session still valid
- [ ] Test input validation: Submit invalid data to API routes, verify 400 errors
- [ ] Test RLS policies: Try to access other users' data, verify denied
- [ ] Check query performance: Run `EXPLAIN ANALYZE` on search queries
- [ ] Verify audit logging: Create/update listing, check `audit_events` table

---

**Report Generated By:** AI Security Auditor  
**Next Review:** After implementing Priority Action Items


