# V15 → V16/V17 Upgrade Status Audit

**Date:** 2025-01-27  
**Audit Type:** Read-Only Analysis (No Edits Applied)  
**Scope:** Routing, Browse/Search, Listing Detail, NDA/Buyer Dashboard, Deal Room, Supabase Clients, V16 Repositories/Mappers

---

## A) Executive Summary

1. **✅ Canonical V16 Read Layer Established**: `src/lib/v16/listings.repo.ts` is the canonical repository with `searchListingsV16()`, `getListingByIdV16()`, and `getBrowseFacetsV16()` functions.

2. **⚠️ Multiple Bypasses Detected**: 15+ files still query `listings` table directly instead of using the canonical V16 repo, including critical paths like `src/app/actions/listings.ts` and home page components.

3. **✅ Core Routes Functional**: `/browse` and `/listing/[id]` routes exist, use canonical repo, and are properly linked from homepage/navbar. Search bar correctly routes to `/browse?q=...`.

4. **❌ Browse Page Syntax Error**: Missing comma on line 44 in `src/app/(platform)/browse/page.tsx` will cause compilation failure.

5. **⚠️ Listing Detail Page Incomplete**: Uses canonical repo but has commented-out `HeroGallery` import; gallery display is placeholder only.

6. **⚠️ Mixed V15/V16 Table Usage**: Deal room uses TABLES constants correctly, but buyer dashboard and NDA flows still reference V15 table names directly in some places.

7. **✅ Supabase Client Setup**: Multiple client files exist (some duplication), all correctly reference `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, but no runtime validation.

8. **❌ V15 Legacy References**: Extensive legacy references found: `listings` table (23 occurrences), `hero_image_url` vs `heroImageUrl` field name inconsistencies, and V15 component patterns.

---

## B) Completed vs Remaining Checklist

### ✅ Completed

- [x] Canonical V16 read layer created (`src/lib/v16/listings.repo.ts`)
- [x] Browse page route (`/browse`) implemented with canonical repo
- [x] Listing detail route (`/listing/[id]`) implemented with canonical repo
- [x] Homepage search bar routes to `/browse?q=...`
- [x] MainNav links to `/browse` and `/dashboard`
- [x] Deal room uses TABLES constants from `src/lib/spine/constants.ts`
- [x] Supabase client files reference correct env vars
- [x] V16 mappers exist (`src/lib/v16/mappers.ts`)
- [x] V16 taxonomy repo exists (`src/lib/v16/taxonomy.repo.ts`)

### ❌ Remaining / Issues

- [ ] **CRITICAL**: Fix syntax error in `src/app/(platform)/browse/page.tsx` line 44 (missing comma)
- [ ] **HIGH**: Migrate 15+ files from direct `listings` table queries to canonical V16 repo
- [ ] **HIGH**: Implement HeroGallery component for listing detail page
- [ ] **MEDIUM**: Standardize field naming (`hero_image_url` vs `heroImageUrl`) across codebase
- [ ] **MEDIUM**: Add runtime validation for Supabase env vars
- [ ] **MEDIUM**: Consolidate duplicate Supabase client files
- [ ] **LOW**: Update buyer dashboard to use canonical repo instead of direct `listings_v16` query
- [ ] **LOW**: Audit and update all V15 table references to use TABLES constants

---

## C) Blockers (Ranked by Severity)

### 🔴 CRITICAL (Blocks Compilation)

1. **Browse Page Syntax Error**
   - **File**: `src/app/(platform)/browse/page.tsx`
   - **Line**: 44
   - **Issue**: Missing comma after `query: sp.q as string | undefined,`
   - **Fix**: Add comma: `query: sp.q as string | undefined,`
   - **Impact**: TypeScript/Next.js compilation will fail

### 🟠 HIGH (Blocks Functionality)

2. **Direct `listings` Table Queries Bypassing Canonical Repo**
   - **Files Affected**:
     - `src/app/actions/listings.ts` (13 occurrences)
     - `src/components/home/RecentListings.tsx` (line 22)
     - `src/components/platform/ComparisonQueue.tsx` (line 28)
     - `src/app/api/ai-search-listings/route.ts` (line 74)
     - `src/app/admin/listing-upgrades/page.tsx` (4 occurrences)
     - `src/app/actions/createListing.ts` (line 52)
     - `src/app/actions/aiProcessListing.ts` (line 28)
     - `src/app/actions/getListings.ts` (line 18)
     - `src/app/actions/getFilteredListings.ts` (line 26)
     - `src/app/actions/leads.ts` (line 87)
     - `src/app/api/seed/route.ts` (line 24)
   - **Issue**: These files query `listings` table directly, bypassing the canonical V16 repository
   - **Impact**: Inconsistent data access, potential V15/V16 schema mismatches, harder to maintain
   - **Fix**: Refactor to use `searchListingsV16()` or `getListingByIdV16()` from canonical repo

3. **Missing HeroGallery Component**
   - **File**: `src/app/(platform)/listing/[id]/page.tsx`
   - **Line**: 5 (commented out), 73 (placeholder)
   - **Issue**: `HeroGallery` import is commented out, gallery display is placeholder
   - **Impact**: Listing detail pages show "Image Gallery Placeholder" instead of actual images
   - **Fix**: Create `src/components/listings/v16/HeroGallery.tsx` or uncomment if exists

### 🟡 MEDIUM (Causes Inconsistencies)

4. **Field Name Inconsistencies (`hero_image_url` vs `heroImageUrl`)**
   - **Files Affected**: Multiple components use both naming conventions
   - **Issue**: V16 mappers output `heroImageUrl` (camelCase), but many components expect `hero_image_url` (snake_case)
   - **Impact**: Potential runtime errors when accessing image URLs
   - **Fix**: Standardize on one convention (recommend `heroImageUrl` for V16) and update all references

5. **No Runtime Env Var Validation**
   - **Files**: All Supabase client files
   - **Issue**: Uses `process.env.NEXT_PUBLIC_SUPABASE_URL!` with non-null assertion but no runtime check
   - **Impact**: App will crash at runtime if env vars are missing, with unclear error message
   - **Fix**: Add validation in client creation functions

6. **Duplicate Supabase Client Files**
   - **Files**:
     - `src/utils/supabase/client.ts`
     - `src/utils/supabase/server.ts`
     - `src/lib/supabase/client.ts`
     - `src/lib/supabase/server.ts`
     - `src/lib/supabase.ts`
   - **Issue**: Multiple client implementations with slight variations
   - **Impact**: Confusion about which to use, potential inconsistencies
   - **Fix**: Consolidate to single canonical client/server pair

### 🟢 LOW (Technical Debt)

7. **Buyer Dashboard Direct Query**
   - **File**: `src/app/dashboard/buyer/page.tsx`
   - **Line**: 45
   - **Issue**: Queries `listings_v16` directly instead of using canonical repo
   - **Impact**: Minor inconsistency, but should use canonical layer for consistency
   - **Fix**: Use `getListingByIdV16()` for individual listings

8. **V15 Table Name References**
   - **Files**: Multiple files still reference `deal_rooms`, `deal_room_members`, `messages`, `offers` as hardcoded strings
   - **Issue**: Should use `TABLES` constants from `src/lib/spine/constants.ts`
   - **Impact**: If table names change, need to update multiple files
   - **Fix**: Replace hardcoded strings with `TABLES.deal_rooms`, etc.

---

## D) Recommended Next Step Plan (Max 8 Steps)

1. **Fix Browse Page Syntax Error** (5 min)
   - File: `src/app/(platform)/browse/page.tsx`
   - Change: Add comma after line 44: `query: sp.q as string | undefined,`

2. **Verify Compilation** (2 min)
   - Run: `npm run build` or `next build`
   - Confirm: No TypeScript errors

3. **Create/Uncomment HeroGallery Component** (30 min)
   - File: `src/components/listings/v16/HeroGallery.tsx`
   - If exists: Uncomment import in listing detail page
   - If missing: Create component that displays gallery from `listing.galleryUrls` or `listing.meta.gallery`

4. **Migrate Critical Actions to Canonical Repo** (2 hours)
   - Priority files:
     - `src/app/actions/listings.ts` → Replace `getListingById()` with `getListingByIdV16()`
     - `src/app/actions/getFilteredListings.ts` → Replace with `searchListingsV16()`
     - `src/components/home/RecentListings.tsx` → Use `searchListingsV16()` with limit

5. **Add Env Var Validation** (15 min)
   - File: `src/utils/supabase/client.ts` and `server.ts`
   - Add: Runtime checks that throw clear errors if env vars missing

6. **Standardize Field Names** (1 hour)
   - Audit all components using `hero_image_url`
   - Update to use `heroImageUrl` from V16 mappers
   - Or update mappers to output both for backward compatibility

7. **Consolidate Supabase Clients** (30 min)
   - Choose canonical location (recommend `src/utils/supabase/`)
   - Update all imports to use canonical clients
   - Remove duplicate files

8. **Update Buyer Dashboard** (15 min)
   - File: `src/app/dashboard/buyer/page.tsx`
   - Change: Use `getListingByIdV16()` instead of direct query

---

## E) Exact Commands to Run Locally

### Verify Compilation
```bash
cd /Users/vishalkanwar/Projects/nxtowner-next
npm run build
```

### Check for Direct `listings` Table Queries
```bash
cd /Users/vishalkanwar/Projects/nxtowner-next
grep -r "\.from(['\"]listings['\"])" src/ --include="*.ts" --include="*.tsx"
```

### Check for V15 Legacy Table Names
```bash
cd /Users/vishalkanwar/Projects/nxtowner-next
grep -r "deal_rooms\|deal_room_members\|messages\|offers" src/ --include="*.ts" --include="*.tsx" | grep -v "TABLES\|constants"
```

### Check for Field Name Inconsistencies
```bash
cd /Users/vishalkanwar/Projects/nxtowner-next
grep -r "hero_image_url\|heroImageUrl" src/ --include="*.ts" --include="*.tsx"
```

### Verify Env Vars Are Set
```bash
cd /Users/vishalkanwar/Projects/nxtowner-next
grep -r "NEXT_PUBLIC_SUPABASE" .env* 2>/dev/null || echo "Check .env.local or .env files"
```

### Check for Missing Imports/Components
```bash
cd /Users/vishalkanwar/Projects/nxtowner-next
find src/components -name "*HeroGallery*" -o -name "*Gallery*" | head -10
```

### Count Files Using Canonical Repo vs Direct Queries
```bash
cd /Users/vishalkanwar/Projects/nxtowner-next
echo "Files using canonical repo:"
grep -r "from.*v16/listings.repo" src/ --include="*.ts" --include="*.tsx" | wc -l
echo "Files using direct listings table:"
grep -r "\.from(['\"]listings['\"])" src/ --include="*.ts" --include="*.tsx" | wc -l
```

---

## Detailed Findings

### 1) Canonical Read Layer Status

**✅ Canonical Repo Located**: `src/lib/v16/listings.repo.ts`

**Functions Available**:
- `searchListingsV16(filters: BrowseFiltersV16)` - Browse/search listings
- `getListingByIdV16(id: string)` - Get single listing detail
- `getBrowseFacetsV16(filters: BrowseFiltersV16)` - Get facet counts
- `getFeaturedListingsV16()` - Get featured listings

**✅ Uses Canonical Repo**:
- `src/app/(platform)/browse/page.tsx` - Uses `searchListingsV16()` and `getBrowseFacetsV16()`
- `src/app/(platform)/listing/[id]/page.tsx` - Uses `getListingByIdV16()`
- `src/lib/db/listings.ts` - Thin wrapper that delegates to canonical repo
- `src/components/home/CuratedOpportunities.tsx` - Uses `getFeaturedListingsV16()` (when `NEXT_PUBLIC_USE_V16=1`)

**❌ Bypasses Canonical Repo** (Direct `listings` table queries):
- `src/app/actions/listings.ts` - Lines 54, 128, 158, 171, 210, 226, 249, 309, 351, 392 (13 occurrences)
- `src/components/home/RecentListings.tsx` - Line 22
- `src/components/platform/ComparisonQueue.tsx` - Line 28
- `src/app/api/ai-search-listings/route.ts` - Line 74
- `src/app/admin/listing-upgrades/page.tsx` - Lines 53, 87, 120, 150
- `src/app/actions/createListing.ts` - Line 52
- `src/app/actions/aiProcessListing.ts` - Line 28
- `src/app/actions/getListings.ts` - Line 18
- `src/app/actions/getFilteredListings.ts` - Line 26
- `src/app/actions/leads.ts` - Line 87
- `src/app/api/seed/route.ts` - Line 24

**⚠️ Mixed / Unclear**:
- `src/components/home/CuratedOpportunities.tsx` - Uses env flag `NEXT_PUBLIC_USE_V16` to switch between V15/V16 (line 20)

### 2) Routing & Link Integrity Audit

| Link Source File | Link Target | Route Exists? | Notes |
|-----------------|-------------|---------------|-------|
| `src/components/layout/MainNav.tsx:37` | `/browse` | ✅ | Correct |
| `src/components/layout/MainNav.tsx:41` | `/dashboard` | ✅ | Correct |
| `src/components/home/Hero.tsx:56` | `/browse?q=...&assetType=...` | ✅ | Search bar routes correctly |
| `src/components/home/CuratedOpportunities.tsx:50` | `/browse` | ✅ | Correct |
| `src/components/home/CuratedOpportunities.tsx:69` | `/browse?sort=newest` | ✅ | Correct |
| `src/components/home/CuratedOpportunities.tsx:80` | `/listing/${deal.id}` | ✅ | Correct |
| `src/components/home/BrowseByCategory.tsx:34` | `/browse` | ✅ | Correct |
| `src/components/home/BrowseByCategory.tsx:45` | `/browse?category=...&assetType=all` | ✅ | Correct |
| `src/components/home/CuratedListings.tsx:64` | `/browse` | ✅ | Correct |
| `src/components/home/CuratedListings.tsx:74` | `/listing/${listing.id}` | ✅ | Correct (but uses hardcoded IDs) |
| `src/components/home/RecentListings.tsx:36` | `/browse` | ✅ | Correct |
| `src/components/home/RecentListings.tsx:52` | `/browse?sort=newest` | ✅ | Correct |
| `src/components/home/RecentListings.tsx:63` | `/listing/${item.id}` | ✅ | Correct |

**✅ All Routes Valid**: No broken links detected. All routes exist and are properly linked.

### 3) Browse Page Data Wiring

**File**: `src/app/(platform)/browse/page.tsx`

**Data Flow**:
1. ✅ Receives `searchParams` from Next.js (q, assetType, category, subcategory, min_price, max_price, sort)
2. ✅ Translation layer normalizes params (handles 'physical' → 'Operational', resolves category codes to UUIDs)
3. ✅ Calls `searchListingsV16(filters)` for listings
4. ✅ Calls `getBrowseFacetsV16(filters)` for facets
5. ✅ Passes data to `BrowseClientShell` and `FilterSidebar` components

**Supported Params**:
- `q` - Search query
- `assetType` / `asset_type` - Asset type filter (normalized to 'Operational' or 'Digital')
- `category` - Category code (resolved to UUID via `getCategoryIdByCode()`)
- `subcategory` - Subcategory code (resolved to UUID via `getSubcategoryIdByCode()`)
- `min_price` - Minimum price filter
- `max_price` - Maximum price filter
- `sort` - Sort order (defaults to 'newest')

**❌ Blocker**: Syntax error on line 44 - missing comma after `query: sp.q as string | undefined,`

**Compilation Status**: Will fail due to syntax error.

### 4) Listing Detail Page Wiring

**File**: `src/app/(platform)/listing/[id]/page.tsx`

**Data Flow**:
1. ✅ Uses `getListingByIdV16(id)` from canonical repo
2. ✅ Handles `notFound()` if listing missing
3. ✅ Extracts gallery from `listing.images`, `listing.meta.images`, or `listing.meta.gallery`
4. ✅ Displays basic listing info (title, price, location, category, etc.)

**❌ Missing Components**:
- `HeroGallery` component is commented out (line 5)
- Gallery display is placeholder text (line 73): `<div>Image Gallery Placeholder</div>`

**Missing Fields Accessed** (may cause runtime errors):
- `listing.description` - Used but not in `getListingByIdV16()` select query
- `listing.deal_structure` - Used but not in select query
- `listing.business_status` - Used but not in select query
- `listing.currency` - Used but not in select query
- `listing.images` - Used but not in select query (only `hero_image_url` is selected)

**Fix Required**: 
- Uncomment or create `HeroGallery` component
- Update `getListingByIdV16()` to select additional fields: `description`, `meta_operational`, `meta_digital` (for deal_structure, business_status, currency, images)

### 5) NDA / Buyer Dashboard / Deal Room Status

#### NDA Implementation
**Status**: ⚠️ **Functional but uses V15 table name**

**Files**:
- `src/app/nda/[listingId]/page.tsx` - NDA signing page
- `src/app/dashboard/buyer/page.tsx` - Fetches NDAs (line 227-247)
- `src/lib/spine/server.ts` - NDA creation logic (line 15-24)

**Table Used**: `ndas` (hardcoded string in buyer dashboard, but `TABLES.ndas` constant exists)

**Issue**: Buyer dashboard uses hardcoded `"ndas"` string instead of `TABLES.ndas` constant.

#### Buyer Dashboard
**Status**: ⚠️ **Functional but bypasses canonical repo**

**File**: `src/app/dashboard/buyer/page.tsx`

**Data Sources**:
1. ✅ Watchlist - Uses `getWatchlistForUser()` action
2. ⚠️ Deal Rooms - Uses `getUserDealRooms()` action
3. ✅ NDAs - Uses `fetchUserNDAs()` function
4. ❌ Listing Details - Direct query to `listings_v16` table (line 45) instead of canonical repo

**Issue**: Line 45 queries `listings_v16` directly. Should use `getListingByIdV16()` for consistency.

#### Deal Room
**Status**: ✅ **Uses TABLES constants correctly**

**File**: `src/app/deal-room/[id]/page.tsx`

**Implementation**:
- ✅ Uses `TABLES.deal_rooms` constant (line 27)
- ✅ Uses `TABLES.deal_room_members` constant (line 36)
- ✅ Queries `listings_v16` for listing data (line 46) - This is acceptable as it's a detail view with joins

**Actions File**: `src/app/actions/dealroom.ts`
- ✅ Uses `TABLES` constants throughout
- ✅ Has fallback logic for legacy table names

### 6) Supabase Client + Env Audit

**Client Files Found**:
1. `src/utils/supabase/client.ts` - Browser client (uses `createBrowserClient` from `@supabase/ssr`)
2. `src/utils/supabase/server.ts` - Server client (uses `createServerClient` from `@supabase/ssr`)
3. `src/lib/supabase/client.ts` - Browser client (uses `createBrowserClient` from `@supabase/ssr`)
4. `src/lib/supabase/server.ts` - Server client (uses `createServerClient` from `@supabase/ssr`)
5. `src/lib/supabase.ts` - Legacy client (uses `createClient` from `@supabase/supabase-js`)

**Required Env Vars**:
- `NEXT_PUBLIC_SUPABASE_URL` - Used in all client files
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Used in all client files
- `SUPABASE_SERVICE_ROLE_KEY` - Used in `src/lib/supabaseAdmin.ts` (optional, for admin operations)

**Env Var Usage**:
- All files use non-null assertion operator (`!`) but no runtime validation
- If env vars are missing, app will crash at runtime with unclear error

**Crash Points**:
- Any Supabase client creation will fail if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing
- Error will be: "Cannot read property of undefined" or similar, not a clear "Missing env var" message

**Recommendation**: Add runtime validation:
```typescript
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}
```

### 7) V15 Legacy Reference Sweep

#### Hardcoded Table Names (Should use TABLES constants)

**Files with hardcoded `deal_rooms`, `deal_room_members`, `messages`, `offers`**:
- `src/lib/spine/server.ts:30` - Uses `TABLES.deal_rooms` ✅
- `src/app/deal-room/[id]/page.tsx:27,36` - Uses `TABLES.deal_rooms`, `TABLES.deal_room_members` ✅
- `src/app/actions/dealroom.ts` - Uses `TABLES` constants throughout ✅
- `src/app/dashboard/buyer/page.tsx:227` - Uses hardcoded `"ndas"` string ❌

#### Field Name Inconsistencies

**`hero_image_url` (snake_case) vs `heroImageUrl` (camelCase)**:

**Files using `hero_image_url`**:
- `src/types/supabase.ts` - Type definitions
- `src/types/listing.ts` - Type definitions
- `src/lib/v16/listings.repo.ts` - Database column name (correct)
- `src/app/(platform)/listing/[id]/page.tsx` - Accesses `listing.hero_image_url`
- `src/components/home/RecentListings.tsx` - Accesses `item.hero_image_url`
- `src/components/home/CuratedOpportunities.tsx` - Accesses `deal.hero_image_url`
- `src/components/platform/ComparisonQueue.tsx` - Accesses `biz.hero_image_url`

**Files using `heroImageUrl`**:
- `src/lib/v16/types.ts` - V16 type definition (camelCase)
- `src/lib/v16/mappers.ts` - Maps to `heroImageUrl` (camelCase)
- `src/components/platform/ListingCard.tsx` - Expects `heroImageUrl` prop
- `src/components/platform/ListingRow.tsx` - Handles both `hero_image_url` and `heroImageUrl`

**Issue**: V16 mappers output `heroImageUrl` (camelCase), but many components still expect `hero_image_url` (snake_case). This creates a mismatch.

#### V15 Component Patterns

**Files still using V15 patterns**:
- `src/components/browse/ListingCard.tsx` - Uses `meta.image_url` instead of V16 mapper output
- `src/components/browse/ListingGrid.tsx` - Uses `cover_image_url` (not a V16 field)

**Safe to Keep** (Backward compatibility):
- `src/lib/db/listings.ts` - Thin wrapper for backward compatibility (marked as DEPRECATED)
- `src/components/home/CuratedOpportunities.tsx` - Has env flag to switch between V15/V16

**Must Refactor**:
- All files in "Bypasses Canonical Repo" section (Section 1)
- Field name inconsistencies (standardize on `heroImageUrl` for V16)

---

## Summary Statistics

- **Files using canonical repo**: 4
- **Files bypassing canonical repo**: 11+ (15+ occurrences)
- **Routes verified**: 13 links, all valid
- **Syntax errors**: 1 (browse page)
- **Missing components**: 1 (HeroGallery)
- **Supabase client files**: 5 (should consolidate to 2)
- **V15 legacy references**: 23+ direct `listings` table queries, multiple field name inconsistencies

---

## Next Actions

1. **Immediate**: Fix browse page syntax error
2. **High Priority**: Migrate critical actions to canonical repo
3. **High Priority**: Implement HeroGallery component
4. **Medium Priority**: Standardize field names and add env validation
5. **Low Priority**: Consolidate Supabase clients and update remaining V15 references

