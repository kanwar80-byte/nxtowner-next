# SearchSidebar Integration Audit Report

## ✅ 1. MAIN LISTINGS PAGE LOCATION

**EXACT FILE PATH:**
```
src/app/(platform)/browse/[track]/page.tsx
```

**Router Type:** ✅ **App Router** (Next.js 13+ App Router pattern)

**Current Status:**
- This is the **SOURCE OF TRUTH** for displaying listings
- It handles both `/browse/operational` and `/browse/digital` routes
- Uses dynamic route parameter `[track]` to determine asset type

---

## ⚠️ 2. EXISTING SIDEBAR COMPONENT

**CURRENT SIDEBAR IN USE:**
```tsx
// Line 2: Import
import FilterSidebar from "@/components/platform/FilterSidebar";

// Line 201: Usage
<aside className="w-64 flex-shrink-0 sticky top-28 h-[calc(100vh-120px)] overflow-y-auto hidden md:block">
  <FilterSidebar categoryCounts={facets.categoryCounts} />
</aside>
```

**Component Name:** `<FilterSidebar />`  
**Location:** `src/components/platform/FilterSidebar.tsx`  
**Props:** `{ categoryCounts: Record<string, number | FacetValue> }`

**Current Features:**
- Asset Type radio buttons (All/Operational/Digital)
- Category checkboxes with counts
- Price range slider
- Uses `nuqs` for URL state management

---

## 🔍 3. DUPLICATE FILES CHECK

### ✅ SearchSidebar.tsx
**Location:** `src/components/SearchSidebar.tsx`  
**Status:** ✅ **NEW FILE** (just created)  
**Action:** This is the component you want to use

### ⚠️ Existing FilterSidebar Files

1. **`src/components/platform/FilterSidebar.tsx`** 
   - ✅ **CURRENTLY IN USE** (line 201 of browse/[track]/page.tsx)
   - Uses `nuqs` for URL state
   - Has category filtering with counts
   - **ACTION:** Replace this with `SearchSidebar`

2. **`src/components/browse/FilterSidebar.tsx`**
   - ⚠️ **LEGACY FILE** (not currently imported anywhere)
   - Uses old taxonomy system
   - **ACTION:** Can be deleted or archived

---

## 📋 INTEGRATION INSTRUCTIONS

### Step 1: Update the Main Page

**File to Edit:**
```
src/app/(platform)/browse/[track]/page.tsx
```

**Changes Required:**

1. **Replace Import (Line 2):**
   ```tsx
   // OLD:
   import FilterSidebar from "@/components/platform/FilterSidebar";
   
   // NEW:
   import SearchSidebar, { SearchFilters } from "@/components/SearchSidebar";
   ```

2. **Replace Sidebar Usage (Line 200-202):**
   ```tsx
   // OLD:
   <aside className="w-64 flex-shrink-0 sticky top-28 h-[calc(100vh-120px)] overflow-y-auto hidden md:block">
     <FilterSidebar categoryCounts={facets.categoryCounts} />
   </aside>
   
   // NEW:
   <SearchSidebar 
     onFilterChange={(filters) => {
       // Handle filter changes - update URL params or refetch listings
       console.log('Filters changed:', filters);
     }}
   />
   ```

3. **Remove categoryCounts prop** (SearchSidebar doesn't need it)

### Step 2: Handle Filter Changes

You'll need to update the page to:
- Convert `SearchFilters` to URL search params
- Refetch listings when filters change
- Or use client-side filtering

**Example Integration:**
```tsx
'use client'; // If you make this a client component

const handleFilterChange = (filters: SearchFilters) => {
  // Build URL params from filters
  const params = new URLSearchParams();
  
  if (filters.listing_type) params.set('listing_type', filters.listing_type);
  if (filters.min_price) params.set('min_price', filters.min_price.toString());
  if (filters.max_price) params.set('max_price', filters.max_price.toString());
  // ... etc
  
  // Update URL (triggers page re-render with new searchParams)
  router.push(`/browse/${track}?${params.toString()}`);
};
```

### Step 3: Clean Up Old Files (Optional)

**Files you can DELETE:**
- `src/components/browse/FilterSidebar.tsx` (legacy, not used)

**Files you can KEEP (for reference):**
- `src/components/platform/FilterSidebar.tsx` (currently in use, replace first)

---

## ⚠️ WARNINGS

1. **⚠️ DELETE OLD SIDEBAR FIRST?**
   - **NO** - Keep `FilterSidebar` until `SearchSidebar` is fully integrated and tested
   - Once `SearchSidebar` works, you can delete `FilterSidebar`

2. **⚠️ PROPS MISMATCH:**
   - `FilterSidebar` expects: `{ categoryCounts }`
   - `SearchSidebar` expects: `{ onFilterChange }`
   - These are **completely different APIs** - you'll need to refactor the page logic

3. **⚠️ STATE MANAGEMENT:**
   - `FilterSidebar` uses `nuqs` (URL-based state)
   - `SearchSidebar` uses callback props
   - You'll need to bridge these approaches

---

## 📝 SUMMARY

| Item | Value |
|------|-------|
| **Main Page** | `src/app/(platform)/browse/[track]/page.tsx` |
| **Router** | App Router ✅ |
| **Current Sidebar** | `<FilterSidebar />` from `@/components/platform/FilterSidebar` |
| **New Sidebar** | `<SearchSidebar />` from `@/components/SearchSidebar` |
| **Action Required** | Replace `FilterSidebar` with `SearchSidebar` on line 201 |
| **Delete Old?** | Not yet - test first, then delete `FilterSidebar` files |

---

## 🚀 NEXT STEPS

1. ✅ Edit `src/app/(platform)/browse/[track]/page.tsx`
2. ✅ Replace `FilterSidebar` import with `SearchSidebar`
3. ✅ Update sidebar usage (line 200-202)
4. ✅ Implement `onFilterChange` handler to update URL/search params
5. ✅ Test filtering functionality
6. ✅ Delete old `FilterSidebar` files once confirmed working

