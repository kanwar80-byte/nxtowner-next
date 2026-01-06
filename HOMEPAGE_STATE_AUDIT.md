# HOMEPAGE STATE AUDIT: "3 Homepages" Mismatch Investigation
**Date:** 2025-01-XX  
**Type:** Read-Only Investigation  
**Goal:** Identify all home entry points, mode/toggle state sources, and section rendering logic

---

## 1. HOME ROUTE FILES

### Primary Entry Point
- **File:** `src/app/page.tsx`
  - **Type:** Server Component (async)
  - **Exports:** `HomePage` (default)
  - **Renders:** `<HomePageClient>` wrapped in `<Suspense>`
  - **Props passed:** `initialOperationalListings`, `initialDigitalListings` (from `getFeaturedListingsV17`)

### Client Component
- **File:** `src/app/home/HomePageClient.tsx`
  - **Type:** Client Component
  - **Exports:** `HomePageClient` (default)
  - **Wraps:** `<HomeContent>` in `<TrackProvider>`
  - **Sections rendered:** Hero, HeroCapabilities, FeaturedDigitalAcquisitions (conditional), CategoryGrid (conditional), ProcessRoadmap, Verification, Deal Rooms, AI Tools, Services, SellerCTA, MarketInsights

**No other home route files found** (no `src/app/home/page.tsx` or `src/app/(home)/page.tsx`)

---

## 2. STATE SOURCES (3 SEPARATE STATE SYSTEMS)

### A) TrackContext (`src/contexts/TrackContext.tsx`)
- **Storage:** `localStorage` with key `'nx_track'`
- **Type:** `'all' | 'operational' | 'digital'`
- **Initial value:** `initialTrack` prop OR `'operational'` (default)
- **Persistence:** 
  - Reads from localStorage on mount (if different from initial)
  - Writes to localStorage on every change
- **Usage:** 
  - Used in `HomePageClient` via `useTrack()` hook
  - Used in `Hero` via `useTrack()` hook
  - Used in `CategoryGrid` via `useTrack()` hook
  - Used for styling decisions (amber vs teal colors) in multiple sections

### B) HomePageClient Local State (`src/app/home/HomePageClient.tsx:33-35`)
- **State variable:** `homepageMode`
- **Type:** `'operational' | 'digital'`
- **Initial value:** `track === 'operational' || track === 'digital' ? track : 'operational'`
- **Storage:** React state only (no persistence)
- **Updates via:** `handleModeChange` callback (called by Hero)
- **Usage:** 
  - Controls which sections render:
    - `homepageMode === 'digital'` → Shows `FeaturedDigitalAcquisitions`
    - `homepageMode === 'operational'` → Shows `CategoryGrid`
  - **CRITICAL:** This is separate from `track` context!

### C) Hero Local State (`src/components/home/Hero.tsx:22-24`)
- **State variable:** `mode`
- **Type:** `'operational' | 'digital'`
- **Initial value:** `(track === 'operational' || track === 'digital') ? track : 'operational'`
- **Storage:** React state only (no persistence)
- **Updates via:** `handleToggleSwitch` function
- **Usage:**
  - Controls Hero UI (toggle switch, search inputs)
  - Passed to AI search API as `mode` parameter
  - Calls `onModeChange(newMode)` to update `homepageMode` in parent
  - Calls `setTrack(newMode)` to update TrackContext
  - **CRITICAL:** This is a third separate state!

---

## 3. STATE SYNCHRONIZATION FLOW

### On Initial Load:
1. `TrackContext` initializes from `initialTrack` prop OR `'operational'` default
2. `TrackContext` reads from `localStorage` on mount (if different from initial)
3. `HomePageClient.homepageMode` initializes from `track` context
4. `Hero.mode` initializes from `track` context

### On Toggle Switch (Hero):
1. User clicks toggle in Hero
2. `Hero.handleToggleSwitch(newMode)` is called
3. `Hero.mode` state updates
4. `Hero.setTrack(newMode)` updates TrackContext
5. `Hero.onModeChange(newMode)` updates `HomePageClient.homepageMode`
6. TrackContext writes to localStorage

### Potential Mismatches:
- **Mismatch 1:** If `TrackContext.track` is `'all'`, but `homepageMode` defaults to `'operational'`
- **Mismatch 2:** If localStorage has `'all'` but components expect `'operational' | 'digital'`
- **Mismatch 3:** If Hero's `mode` state gets out of sync with TrackContext (e.g., if TrackContext updates from another source)

---

## 4. SECTIONS RENDERED BY MODE

### When `homepageMode === 'digital'`:
- ✅ `FeaturedDigitalAcquisitions` (lines 79-86)
  - Receives: `selectedModel={selectedDigitalModel}`, `onSelectModel={handleSelectDigitalModel}`
  - Has its own internal state for model filtering
- ❌ `CategoryGrid` is NOT rendered

### When `homepageMode === 'operational'`:
- ✅ `CategoryGrid` (lines 102-106)
  - No props passed (uses TrackContext directly)
- ❌ `FeaturedDigitalAcquisitions` is NOT rendered

### Always Rendered (regardless of mode):
- `Hero` (always rendered, uses its own `mode` state)
- `HeroCapabilities`
- `ProcessRoadmap`
- `Verification Section` (uses `track` from context for styling)
- `Deal Rooms Section` (uses `track` from context for styling)
- `AI Tools Section` (uses `track` from context for styling)
- `ServicesSection`
- `SellerCTA`
- `MarketInsights`

### Commented Out / Disabled:
- `TrustAndCategories` (commented out, line 71-76)
- `SmartListingGrid` (commented out, line 90-99)

---

## 5. COMPONENT DEPENDENCIES

### Hero Component (`src/components/home/Hero.tsx`)
- **Props:** `onModeChange?: (mode: 'operational' | 'digital') => void`
- **State:** Local `mode` state (separate from context)
- **Context:** Uses `useTrack()` to read/write `track`
- **Behavior:** 
  - Toggle switch updates local `mode` state
  - Calls `setTrack(newMode)` to update context
  - Calls `onModeChange(newMode)` to notify parent
  - Search uses local `mode` state

### FeaturedDigitalAcquisitions (`src/components/home/FeaturedDigitalAcquisitions.tsx`)
- **Props:** `selectedModel?: string`, `onSelectModel?: (model: string) => void`
- **State:** None (controlled component)
- **Context:** Does NOT use TrackContext
- **Behavior:**
  - Filters listings based on `selectedModel` prop
  - Renders "Browse by Business Model" tiles inline (not using CategoryGrid)
  - Only renders when `homepageMode === 'digital'`

### CategoryGrid (`src/components/home/CategoryGrid.tsx`)
- **Props:** `selectedDigitalModel?: string`, `onSelectDigitalModel?: (model: string) => void`
- **State:** None (controlled component)
- **Context:** Uses `useTrack()` to determine which categories to show
- **Behavior:**
  - Shows operational categories when `track === 'operational'`
  - Shows digital categories when `track === 'digital'`
  - Only renders when `homepageMode === 'operational'`
  - For digital mode: can filter locally if `onSelectDigitalModel` is provided

---

## 6. IDENTIFIED MISMATCHES

### Mismatch #1: Three Separate State Variables
**Issue:** Three different state variables control the same concept:
- `TrackContext.track` (can be `'all' | 'operational' | 'digital'`)
- `HomePageClient.homepageMode` (can be `'operational' | 'digital'`)
- `Hero.mode` (can be `'operational' | 'digital'`)

**Impact:**
- If `track === 'all'`, `homepageMode` defaults to `'operational'` (line 34)
- If `track` changes from another source (e.g., localStorage sync), `homepageMode` doesn't update
- Hero's `mode` can get out of sync if TrackContext updates independently

**Evidence:**
- `HomePageClient.tsx:33-35`: `homepageMode` initialized from `track`, but no useEffect to sync
- `Hero.tsx:22-24`: `mode` initialized from `track`, but no useEffect to sync
- `TrackContext.tsx:30-46`: Reads from localStorage on mount, but doesn't notify children

### Mismatch #2: TrackContext Can Be 'all', But Components Expect 'operational' | 'digital'
**Issue:** TrackContext allows `'all'` as a value, but:
- `HomePageClient.homepageMode` only accepts `'operational' | 'digital'`
- `Hero.mode` only accepts `'operational' | 'digital'`
- Default fallback is `'operational'` when `track === 'all'`

**Impact:**
- If user previously selected `'all'` and it's stored in localStorage, homepage will show operational mode
- No way to show "all" mode on homepage (always defaults to operational)

**Evidence:**
- `HomePageClient.tsx:34`: `track === 'operational' || track === 'digital' ? track : 'operational'`
- `Hero.tsx:23`: `(track === 'operational' || track === 'digital') ? track : 'operational'`

### Mismatch #3: Section Rendering Uses Different State Than Styling
**Issue:** 
- Section visibility controlled by `homepageMode` (HomePageClient state)
- Section styling controlled by `track` (TrackContext)
- These can be out of sync

**Impact:**
- If `homepageMode === 'digital'` but `track === 'operational'`, sections will:
  - Show digital content (FeaturedDigitalAcquisitions)
  - But use operational styling (amber colors instead of teal)

**Evidence:**
- `HomePageClient.tsx:79`: `{homepageMode === 'digital' && <FeaturedDigitalAcquisitions />}`
- `HomePageClient.tsx:120`: `track === 'operational' ? 'bg-amber-500/10' : 'bg-teal-500/10'`
- `HomePageClient.tsx:102`: `{homepageMode === 'operational' && <CategoryGrid />}`

### Mismatch #4: CategoryGrid Not Used in Digital Mode
**Issue:** 
- `FeaturedDigitalAcquisitions` has its own inline "Browse by Business Model" tiles
- `CategoryGrid` is only rendered for operational mode
- But `CategoryGrid` supports digital mode with `selectedDigitalModel` prop

**Impact:**
- Code duplication: Business model tiles are implemented twice
- Inconsistent styling between operational and digital category grids
- `CategoryGrid` has digital mode support that's never used

**Evidence:**
- `HomePageClient.tsx:102-106`: CategoryGrid only rendered when `homepageMode === 'operational'`
- `FeaturedDigitalAcquisitions.tsx:241-293`: Inline business model tiles implementation
- `CategoryGrid.tsx:17`: Supports `selectedDigitalModel` and `onSelectDigitalModel` props

---

## 7. STORAGE PERSISTENCE

### localStorage Usage:
- **Key:** `'nx_track'`
- **Location:** `TrackContext.tsx:14, 34, 53`
- **Values stored:** `'all' | 'operational' | 'digital'`
- **Read:** On mount (if different from initial value)
- **Write:** On every `setTrack()` call

### No Other Persistence:
- ❌ No `sessionStorage` usage for mode
- ❌ No cookies for mode
- ❌ No URL params for mode (Hero search uses URL params, but not for mode toggle)

---

## 8. IMPORT GRAPH

```
src/app/page.tsx
  └─> HomePageClient (src/app/home/HomePageClient.tsx)
      ├─> TrackProvider (src/contexts/TrackContext.tsx)
      ├─> Hero (src/components/home/Hero.tsx)
      │   └─> useTrack() hook
      ├─> HeroCapabilities
      ├─> FeaturedDigitalAcquisitions (conditional: homepageMode === 'digital')
      │   └─> Inline business model tiles (NOT CategoryGrid)
      ├─> CategoryGrid (conditional: homepageMode === 'operational')
      │   └─> useTrack() hook
      ├─> ProcessRoadmap
      ├─> ServicesSection
      ├─> SellerCTA
      └─> MarketInsights
```

---

## 9. SUMMARY OF FINDINGS

### State Sources (3):
1. **TrackContext** (`localStorage` + React state) - `'all' | 'operational' | 'digital'`
2. **HomePageClient.homepageMode** (React state only) - `'operational' | 'digital'`
3. **Hero.mode** (React state only) - `'operational' | 'digital'`

### Section Rendering Logic:
- **Digital mode:** Shows `FeaturedDigitalAcquisitions` (with inline tiles)
- **Operational mode:** Shows `CategoryGrid`
- **Styling:** Uses `track` from TrackContext (can mismatch with `homepageMode`)

### Key Mismatches:
1. **Three separate state variables** for the same concept
2. **TrackContext can be 'all'** but components expect 'operational' | 'digital'
3. **Section visibility uses `homepageMode`** but **styling uses `track`**
4. **CategoryGrid not used in digital mode** (duplicate tile implementation)

### Recommendations:
1. **Unify state:** Use single source of truth (TrackContext) and derive `homepageMode` from it
2. **Handle 'all' mode:** Either remove 'all' from TrackContext or implement 'all' mode UI
3. **Sync state:** Add useEffect to sync `homepageMode` when `track` changes
4. **Consolidate tiles:** Use CategoryGrid for both modes, or extract tiles to shared component

---

**Audit Complete — No Changes Applied**


