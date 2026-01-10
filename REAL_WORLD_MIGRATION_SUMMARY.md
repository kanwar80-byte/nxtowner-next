# Real World Migration Summary

## Overview
Standardized the platform to use "Real World" instead of "Operational" for better user-facing terminology.

## Changes Made

### 1. Browse Page (`src/app/(platform)/browse/[track]/page.tsx`)
✅ **URL Handling:**
- Accepts `/browse/real-world` as canonical URL
- Maintains backward compatibility with `/browse/operational` (legacy)
- Maps URL `real-world` → DB value `real_world` (snake_case)
- Maps URL `operational` → DB value `real_world` (for backward compatibility)

✅ **Display Updates:**
- Header shows "Real World Assets" when track is `real-world`
- Empty state messages updated to "No Real World Assets found"
- Track description updated to "Discover physical businesses, real estate, and franchises."

### 2. Search Sidebar (`src/components/SearchSidebar.tsx`)
✅ **Track Switcher:**
- Changed from `["digital", "operational"]` to `["digital", "real-world"]`
- Button labels: "Digital" and "Real World"
- Clicking "Real World" navigates to `/browse/real-world`
- Maintains backward compatibility (maps "operational" URLs to "real-world")

✅ **Conditional Filters:**
- Location/Real Estate filters show when track is `real-world`
- Digital filters (MRR, Tech Stack) show when track is `digital`

### 3. Home Component Links (5 files updated)

#### `CuratedOpportunitiesClient.tsx`
- ✅ `/browse/operational` → `/browse/real-world`
- ✅ Handles `track === 'operational'` → maps to `real-world`

#### `CuratedListingsClient.tsx`
- ✅ `/browse/operational` → `/browse/real-world`
- ✅ Handles `track === 'operational'` → maps to `real-world`

#### `ListingsSection.tsx`
- ✅ Updated Track type to support `"real-world" | "digital" | "operational"`
- ✅ Normalizes `operational` → `real-world` for display
- ✅ All links use `normalizedTrack` (real-world)

#### `CategoryGrid.tsx`
- ✅ Updated mode type to support `"real-world" | "digital" | "operational"`
- ✅ Maps `operational` → `real-world` in `effectiveMode`
- ✅ All conditional checks updated to handle both `operational` and `real-world`

#### `HeroSection.tsx`
- ✅ `/browse/operational` → `/browse/real-world`

## Database Mapping

**URL → Database:**
- `/browse/real-world` → `asset_type = 'real_world'` (snake_case)
- `/browse/operational` → `asset_type = 'real_world'` (backward compatibility)
- `/browse/digital` → `asset_type = 'digital'`

**Note:** The database column `asset_type` uses snake_case (`real_world`), while URLs use kebab-case (`real-world`).

## Backward Compatibility

✅ **Maintained:**
- Old URLs (`/browse/operational`) still work and redirect internally to `real-world`
- Database queries handle both URL formats
- Component logic supports both `operational` and `real-world` track values

## Testing Checklist

- [ ] Navigate to `/browse/real-world` - should display "Real World Assets"
- [ ] Navigate to `/browse/operational` - should work (backward compatibility)
- [ ] Click "Real World" tab in SearchSidebar - should navigate to `/browse/real-world`
- [ ] Location/Real Estate filters appear when "Real World" is selected
- [ ] All homepage links point to `/browse/real-world` instead of `/browse/operational`
- [ ] Empty states show "No Real World Assets found"
- [ ] Database queries use `real_world` (snake_case) for asset_type

## Files Modified

1. `src/app/(platform)/browse/[track]/page.tsx` - Complete rewrite with real-world support
2. `src/components/SearchSidebar.tsx` - Updated track switcher and conditional filters
3. `src/components/home/CuratedOpportunitiesClient.tsx` - Updated links
4. `src/components/home/CuratedListingsClient.tsx` - Updated links
5. `src/components/home/ListingsSection.tsx` - Updated track handling
6. `src/components/home/CategoryGrid.tsx` - Updated mode handling
7. `src/components/home/HeroSection.tsx` - Updated base path

## Next Steps (Optional)

- Consider adding a redirect from `/browse/operational` → `/browse/real-world` at the route level
- Update any remaining references in other components
- Update API documentation to reflect "Real World" terminology
- Consider database migration if `asset_type` values need to change from `operational` to `real_world`

