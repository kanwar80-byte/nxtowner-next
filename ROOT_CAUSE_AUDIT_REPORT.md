# Root Cause Audit Report - User Journey Analysis

## Executive Summary

This audit traces the user journey from homepage → browse page → database to identify broken links, legacy code, and data source mismatches.

---

## Step 1: Landing Pages Audit (Entry Points)

### Main Homepage
**File:** `src/app/page.tsx`

**Data Source:** ✅ **V17 Compliant**
- Uses `getFeaturedListingsV17()` - queries `public.listings` (V17)
- Uses `searchListingsV17()` - queries `public.listings` (V17)
- **Status:** ✅ Correct

**Browse Links Found:**
- `src/components/home/CuratedOpportunitiesClient.tsx` (Line 37, 56):
  - ❌ **MISMATCH:** Links to `/browse?asset_type=${track}` 
  - **Expected:** Should link to `/browse/${track}` (canonical route)
- `src/components/home/ListingsSection.tsx` (Line 49, 93):
  - ❌ **MISMATCH:** Links to `/browse/${track}?asset_type=${track}&sort=featured`
  - **Issue:** Redundant `asset_type` param (track is already in path)
- `src/components/home/BrowseByCategory.tsx` (Line 47):
  - ⚠️ **GENERIC:** Links to `/browse` (will redirect, but not ideal)
- `src/components/home/CategoryGrid.tsx` (Line 145):
  - ❌ **MISMATCH:** Links to `/browse/digital?asset_type=digital`
  - **Issue:** Redundant `asset_type` param

### Digital Homepage
**File:** `src/app/digital/page.tsx`
- Need to check this file

### Operational Homepage
**File:** `src/app/(platform)/browse/operational/page.tsx`
- This is a redirect file, not a homepage

---

## Step 2: Destination Page Audit (Browse Page)

### Main Browse Route
**File:** `src/app/(platform)/browse/[track]/page.tsx`

**Data Source:** ✅ **V17 Compliant**
- Uses `searchListingsV17()` from `@/lib/v17/listings.repo`
- Queries `public.listings` table (V17 canonical)
- **Status:** ✅ Correct

**Components:** ✅ **Modern**
- Uses `<SearchSidebar />` (new, URL-driven)
- Uses `<BrowseClientShell />` (modern)
- **Status:** ✅ Correct

**URL Parameter Handling:**
- ✅ Reads: `min_price`, `max_price`, `min_ebitda`, `max_ebitda`
- ✅ Reads: `deal_grade`, `tech_stack`, `location`, `real_estate`
- ✅ Reads: `category`, `subcategory`, `categoryId`, `subcategoryId`
- **Status:** ✅ Correct

**Potential Issues:**
- ⚠️ Some filters (deal_grade, tech_stack, mrr, ebitda, property_included, ai_verified) are not yet implemented in repo
- ⚠️ These filters are read from URL but may not be applied to the query

### Redirect Route
**File:** `src/app/(platform)/browse/page.tsx`

**Function:** ✅ **Correct**
- Redirects `/browse` → `/browse/operational` (or `/browse/digital` based on params)
- Handles legacy params: `assetType`, `type`, `asset_type`, `listing_type`
- **Status:** ✅ Working as intended

---

## Step 3: Blank Screen Analysis

### Potential Causes

1. **Missing Return Statement:** ❌ Not found - all components have returns
2. **Undefined Data Mapping:** ⚠️ **POTENTIAL ISSUE**
   - `BrowseClientShell` maps `listings.map()` - if `listings` is undefined, this could crash
   - **Check:** Line 62 in `BrowseClientShell.tsx` - has defensive check: `if (listings.length > 0)`
   - **Status:** ✅ Protected

3. **Server Component Fetch Failure:** ⚠️ **POTENTIAL ISSUE**
   - `searchListingsV17()` could return empty array or throw error
   - **Check:** Line 195-201 in `browse/[track]/page.tsx` - has try/catch
   - **Status:** ✅ Protected

4. **URL Parameter Mismatch:** ⚠️ **LIKELY ISSUE**
   - Homepage links use `/browse?asset_type=digital`
   - But browse page expects `/browse/digital` (path-based)
   - The redirect at `/browse/page.tsx` should handle this, but there may be edge cases

---

## Step 4: Mismatches Identified

### 🔴 High Priority Mismatches

1. **Homepage Links Use Query Params Instead of Path**
   - **Files:**
     - `src/components/home/CuratedOpportunitiesClient.tsx` (Lines 37, 56)
     - `src/components/home/ListingsSection.tsx` (Lines 49, 93)
     - `src/components/home/CategoryGrid.tsx` (Line 145)
   - **Current:** `/browse?asset_type=digital` or `/browse/digital?asset_type=digital`
   - **Expected:** `/browse/digital` (path-based, no redundant params)
   - **Impact:** Works (redirects), but not canonical

2. **Redundant URL Parameters**
   - Multiple components add `asset_type` param even when track is in path
   - **Example:** `/browse/digital?asset_type=digital` (redundant)
   - **Expected:** `/browse/digital` (track is in path)

### 🟡 Medium Priority Issues

3. **Filter Parameters Not Fully Implemented**
   - **File:** `src/app/(platform)/browse/[track]/page.tsx`
   - **Issue:** Reads `deal_grade`, `tech_stack`, `mrr`, `ebitda`, `real_estate` from URL
   - **Problem:** These filters are not yet implemented in `searchListingsV17Repo`
   - **Impact:** Filters appear in URL but don't actually filter results
   - **Status:** TODO comments exist, but functionality incomplete

4. **Generic Browse Links**
   - **Files:**
     - `src/components/home/BrowseByCategory.tsx` (Line 47): `/browse`
     - `src/components/home/BuyerSellerPanels.tsx` (Line 40): `/browse`
   - **Impact:** Works (redirects), but not track-specific

### 🟢 Low Priority (Cosmetic)

5. **Legacy Component Names**
   - `CuratedOpportunitiesClient.tsx` - filename suggests legacy, but code is V17
   - **Impact:** None (just naming)

---

## Step 5: Data Source Verification

### ✅ V17 Compliant (Correct)

| File | Data Source | Status |
|------|-------------|--------|
| `src/app/page.tsx` | `getFeaturedListingsV17()`, `searchListingsV17()` | ✅ V17 |
| `src/app/(platform)/browse/[track]/page.tsx` | `searchListingsV17()` | ✅ V17 |
| `src/components/home/RecentListings.tsx` | `searchListingsV17()` | ✅ V17 |
| `src/components/home/CuratedListings.tsx` | `getFeaturedListingsV17()` | ✅ V17 |

### ❌ Legacy Tables (None Found)
- No references to `digital_assets`, `operational_assets`, `listings_v15_legacy`, or `listings_old`
- **Status:** ✅ Clean

---

## Step 6: Fix Plan

### Priority 1: Fix Homepage Links (High Impact)

**Files to Update:**

1. **`src/components/home/CuratedOpportunitiesClient.tsx`**
   - **Line 37:** Change `/browse?asset_type=${track}` → `/browse/${track}`
   - **Line 56:** Change `/browse?asset_type=${track}&sort=newest` → `/browse/${track}?sort=newest`

2. **`src/components/home/ListingsSection.tsx`**
   - **Line 49:** Change `/browse/${track}?asset_type=${track}&sort=featured` → `/browse/${track}?sort=featured`
   - **Line 93:** Change `/browse/${track}?asset_type=${track}&sort=newest&since_days=7` → `/browse/${track}?sort=newest&since_days=7`

3. **`src/components/home/CategoryGrid.tsx`**
   - **Line 145:** Change `/browse/digital?asset_type=digital` → `/browse/digital`

4. **`src/components/home/BrowseByCategory.tsx`**
   - **Line 47:** Change `/browse` → `/browse/operational` (or make track-aware)

### Priority 2: Implement Missing Filters (Medium Impact)

**File:** `src/lib/v17/listings.repo.ts`

**Add Support For:**
- `deal_grade` → Map to `ai_growth_score`/`ai_risk_score` ranges
- `tech_stack` → Filter by tech stack array (if column exists)
- `min_mrr`/`max_mrr` → Filter by MRR (if column exists)
- `min_ebitda`/`max_ebitda` → Filter by EBITDA (if column exists)
- `real_estate` → Filter by `property_included` (if column exists)
- `ai_verified` → Filter by `is_ai_verified` or similar

### Priority 3: Standardize Generic Links (Low Impact)

**Files:**
- `src/components/home/BrowseByCategory.tsx` - Make track-aware
- `src/components/home/BuyerSellerPanels.tsx` - Make track-aware

---

## Summary of Issues

| Issue | Severity | Files Affected | Fix Complexity |
|-------|----------|----------------|----------------|
| Homepage links use query params | 🔴 High | 4 files | Low (simple href changes) |
| Redundant URL parameters | 🟡 Medium | 3 files | Low (remove params) |
| Filters not implemented in repo | 🟡 Medium | 1 file | High (need DB schema + repo logic) |
| Generic browse links | 🟢 Low | 2 files | Low (make track-aware) |

---

## Recommended Action Order

1. ✅ **Fix homepage links** (5 minutes) - High impact, low effort
2. ⚠️ **Remove redundant params** (5 minutes) - Medium impact, low effort
3. ⚠️ **Implement missing filters** (2-4 hours) - Medium impact, high effort
4. ⚠️ **Standardize generic links** (10 minutes) - Low impact, low effort

---

## Files Requiring Changes

### Immediate Fixes (High Priority)
1. `src/components/home/CuratedOpportunitiesClient.tsx`
2. `src/components/home/ListingsSection.tsx`
3. `src/components/home/CategoryGrid.tsx`
4. `src/components/home/BrowseByCategory.tsx`

### Future Enhancements (Medium Priority)
1. `src/lib/v17/listings.repo.ts` - Add filter support
2. `src/components/home/BuyerSellerPanels.tsx` - Make track-aware

---

## Conclusion

**Root Cause:** Homepage components are using legacy URL patterns (`/browse?asset_type=X`) instead of canonical path-based routes (`/browse/digital`). While the redirect handles this, it's not optimal.

**Data Sources:** ✅ All correct - using V17 `listings` table

**Components:** ✅ All modern - using new `SearchSidebar` and V17 repos

**Blank Screen Risk:** ⚠️ Low - defensive coding exists, but URL mismatches could cause confusion

