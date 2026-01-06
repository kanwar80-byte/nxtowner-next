# HOMEPAGE CLICK WIRING AUDIT REPORT

## CLICK MAP TABLE

| Component | File | Line(s) | UI Label | Click Type | Current Destination | Expected Destination | Status |
|-----------|------|---------|----------|------------|---------------------|---------------------|--------|
| **1. HERO SECTION** |
| Operational Toggle | Hero.tsx | 194 | "Operational Assets" button | route | `/browse?assetType=operational` | `/browse?assetType=operational` | ✅ OK |
| Digital Toggle | Hero.tsx | 202 | "Digital Assets" button | route | `/browse?assetType=digital` | `/browse?assetType=digital` | ✅ OK |
| Search Submit | Hero.tsx | 101 | "Search" button | route | `/browse?assetType=${track}&q=...` | `/browse?assetType=${track}&q=...` | ✅ OK |
| **2. TRUST AND CATEGORIES** |
| Category Chip (All) | TrustAndCategories.tsx | 80 | "All Listings" | route | `/browse?assetType=${track}` | `/browse?assetType=${track}` | ✅ OK |
| Category Chip (Gas Stations) | TrustAndCategories.tsx | 94 | "Gas Stations" | route | `/browse?assetType=${track}&categoryId=${uuid}` | `/browse?assetType=${track}&categoryId=${uuid}` | ✅ OK |
| Category Chip (Fallback) | TrustAndCategories.tsx | 97,101 | Category chips | route | `/browse?assetType=${track}&category=${code}` | `/browse?assetType=${track}&categoryId=${uuid}` | ⚠️ FALLBACK (should use UUID) |
| **3. SMART LISTING GRID** |
| Listing Card | SmartListingGrid.tsx | 92 | "View Deal →" link | route | `/listing/${listing.id}` | `/listing/${listing.id}` | ✅ OK |
| View All Listings | SmartListingGrid.tsx | 268 | "View all listings →" | route | `/browse?assetType=${track}` | `/browse?assetType=${track}` | ✅ OK |
| Clear Filters | SmartListingGrid.tsx | 198 | "Clear Filters" button | route | `/browse?assetType=${track}` | `/browse?assetType=${track}` | ✅ OK |
| **4. CATEGORY GRID** |
| View All Categories | CategoryGrid.tsx | 48 | "View all categories →" | route | `/search` | `/browse` | ❌ BROKEN (route doesn't exist) |
| Category Tile | CategoryGrid.tsx | 55 | Category name (e.g., "Gas Stations") | route | `/search?category=${cat.name}` | `/browse?assetType=${track}&categoryId=${uuid}` | ❌ BROKEN (route doesn't exist, wrong params) |
| **5. PROCESS ROADMAP** |
| Step Cards | ProcessRoadmap.tsx | 54 | Step titles | action | None (not clickable) | Scroll to section OR route to /how-it-works | ⚠️ NO-OP (intentional?) |
| **6. VERIFICATION/TRUST SECTION** |
| Learn About Trust | HomePageClient.tsx | 133 | "Learn About Trust →" | route | `/trust?mode=${modeParam}` | `/trust?mode=${modeParam}` | ✅ OK (if route exists) |
| How It Works | HomePageClient.tsx | 137 | "How It Works →" | route | `/how-it-works?mode=${modeParam}` | `/how-it-works?mode=${modeParam}` | ✅ OK (if route exists) |
| **7. DEAL ROOMS + NDA SECTION** |
| Learn More | HomePageClient.tsx | 176 | "Learn More →" | route | `/how-it-works?mode=${modeParam}` | `/how-it-works?mode=${modeParam}` | ✅ OK (if route exists) |
| **8. AI TOOLS / VALUATION SECTION** |
| NxtValuation Wizard | HomePageClient.tsx | 220 | "NxtValuation™ Wizard" card | route | `/sell/valuation?mode=${modeParam}` | `/sell/valuation?mode=${modeParam}` | ✅ OK (if route exists) |
| NxtAI Due Diligence | HomePageClient.tsx | 232 | "NxtAI™ Due Diligence" card | route | `/tools/valuations?mode=${modeParam}` | `/tools/valuations?mode=${modeParam}` | ⚠️ CHECK (route may not exist) |
| NxtAI Risk Scan | HomePageClient.tsx | 244 | "NxtAI™ Risk Scan" card | route | `/tools/valuations?mode=${modeParam}` | `/tools/valuations?mode=${modeParam}` | ⚠️ CHECK (route may not exist) |
| **9. SERVICES SECTION** |
| View All (top) | ServicesSection.tsx | 63 | "View All →" | route | `/partners` | `/partners` | ✅ OK (if route exists) |
| View All Services | ServicesSection.tsx | 84 | "View All Services" button | route | `/partners` | `/partners` | ✅ OK (if route exists) |
| Service Cards | ServicesSection.tsx | 70-79 | Service titles | action | None (not clickable) | Route to /partners OR scroll | ⚠️ NO-OP (should be clickable?) |
| **10. SELLER CTA** |
| Start Valuation | SellerCTA.tsx | 51 | "Start Your Valuation →" button | route | `/sell` | `/sell` | ✅ OK (route exists) |
| **11. MARKET INSIGHTS** |
| View All Reports | MarketInsights.tsx | 87 | "View All Reports →" | route | `/resources` | `/resources` | ✅ OK (if route exists) |
| Insight Cards | MarketInsights.tsx | 109 | Insight titles | route | `/tools/valuations` or `/resources` | `/tools/valuations` or `/resources` | ⚠️ CHECK (routes may not exist) |

## ROUTE EXISTENCE CHECK

Based on file system search:
- ✅ `/browse` - EXISTS (`src/app/(platform)/browse/page.tsx`)
- ✅ `/listing/[id]` - EXISTS (`src/app/(platform)/listing/[id]/page.tsx`)
- ✅ `/sell` - EXISTS (`src/app/sell/page.tsx`)
- ✅ `/trust` - EXISTS (`src/app/trust/page.tsx`)
- ✅ `/how-it-works` - EXISTS (`src/app/how-it-works/page.tsx`)
- ✅ `/partners` - EXISTS (`src/app/partners/page.tsx`)
- ✅ `/resources` - EXISTS (`src/app/resources/page.tsx`)
- ❌ `/search` - DOES NOT EXIST (used in CategoryGrid)
- ⚠️ `/tools/valuations` - NEEDS VERIFICATION
- ⚠️ `/sell/valuation` - NEEDS VERIFICATION

## PRIORITY FIX LIST

### P0 (CRITICAL - Broken Routes)
1. **CategoryGrid.tsx** - Line 48, 55: `/search` route doesn't exist → Change to `/browse` with proper params
2. **CategoryGrid.tsx** - Line 55: Category tiles use wrong params → Use `categoryId` (UUID) instead of `category` (name)

### P1 (HIGH - Wrong Params)
3. **TrustAndCategories.tsx** - Lines 97, 101: Fallback uses `category` code instead of `categoryId` UUID → Should use UUID or fallback to `/browse` without category filter

### P2 (MEDIUM - Missing Functionality)
4. **SmartListingGrid.tsx** - Line 268: "View all listings" uses `<a>` tag → Should use `<Link>` for Next.js optimization
5. **HomePageClient.tsx** - Missing section anchors for scroll-to-section functionality
6. **ServicesSection.tsx** - Service cards not clickable → Should link to `/partners` or specific service pages

### P3 (LOW - Verification Needed)
7. **HomePageClient.tsx** - Lines 232, 244: `/tools/valuations` route needs verification
8. **HomePageClient.tsx** - Line 220: `/sell/valuation` route needs verification


