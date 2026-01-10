# SearchSidebar - NxtOwner Standard Implementation ✅

## Summary

Production-ready, URL-driven SearchSidebar component following NxtOwner Standard architecture.

## Files Created/Updated

### 1. ✅ `src/hooks/useDebounce.ts`
- Generic TypeScript hook
- Default delay: 400ms (NxtOwner Standard)
- Proper cleanup on unmount
- JSDoc documentation

### 2. ✅ `src/components/SearchSidebar.tsx`
- **Architecture:** URL as single source of truth
- **Type:** Client Component (`"use client"`)
- **State Management:** Reads from/writes to URL params
- **Debounce:** 400ms for sliders, 400ms for location input
- **Features:**
  - Track switcher (Digital | Operational) - navigates to correct path
  - Deal Grade badges (A/B/C) - Badge-like checkbox style
  - Price & EBITDA range sliders (dual-thumb, debounced)
  - Contextual filters:
    - Digital: MRR slider, Tech Stack (searchable multi-select)
    - Operational: Location input, Real Estate (Owned/Leased buttons)
  - Clear All button
  - Desktop sticky sidebar layout

### 3. ✅ `src/app/(platform)/browse/[track]/page.tsx`
- Removed `FilterSidebar` import
- Added `SearchSidebar` import
- Reads filter params from URL:
  - `min_price`, `max_price`
  - `min_ebitda`, `max_ebitda`
  - `deal_grade` (comma-separated: "A,B")
  - `tech_stack` (comma-separated: "React,Next.js")
  - `location`
  - `real_estate` ("owned" or "leased")
- Passes filters to `v17Filters` for database query

### 4. ✅ Cleanup
- Deleted: `src/components/browse/FilterSidebar.tsx`
- Deleted: `src/components/platform/FilterSidebar.tsx`
- Deleted: `src/components/platform/FilterSidebar.backup.tsx`

## URL Parameter Format

```
/browse/digital?min_price=100000&max_price=5000000&deal_grade=A,B&tech_stack=React,Next.js&min_mrr=5000&max_mrr=50000

/browse/operational?min_price=500000&deal_grade=A&location=Toronto,ON&real_estate=owned
```

## Architecture Principles

1. **URL as State:** No local state for filters - all state lives in URL
2. **Debounced Updates:** 400ms delay prevents URL spam during slider drags
3. **Clean Separation:** 
   - Client component (SearchSidebar) manages URL
   - Server component (page.tsx) reads URL and fetches data
4. **Type Safety:** Full TypeScript with proper types
5. **No Prop Drilling:** Self-contained component

## Visual Hierarchy

1. **Top:** Segmented Control [Digital | Operational]
2. **Primary:** Deal Grade (Badge-style buttons for A/B/C)
3. **Financials:** Price & EBITDA Range Sliders (Accordion)
4. **Contextual:**
   - Digital: MRR Slider + Tech Stack (searchable)
   - Operational: Location Input + Real Estate (Owned/Leased buttons)

## Production Ready ✅

- ✅ Type-safe (TypeScript)
- ✅ URL-driven (shareable, bookmarkable, refreshable)
- ✅ Debounced (400ms prevents spam)
- ✅ Clean architecture (no legacy code)
- ✅ Responsive (desktop sticky sidebar)
- ✅ Accessible (proper labels, keyboard navigation)

