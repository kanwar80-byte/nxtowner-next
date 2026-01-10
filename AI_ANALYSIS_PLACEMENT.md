# AI Analysis Card - Placement Guide

## ✅ Created Files

1. **`src/hooks/useAiAnalysis.ts`** - Custom hook using `supabase.functions.invoke()`
2. **`src/components/AiAnalysisCard.tsx`** - Premium UI component with all requirements

## 📍 Where to Place the Component

### Option 1: Listing Detail Page (Recommended)

**File:** `src/app/(platform)/listing/[id]/page.tsx`

Add the component in the **LEFT COLUMN** after the "DESCRIPTION & AI INSIGHTS" section:

```tsx
import AiAnalysisCard from "@/components/AiAnalysisCard";

// Inside the LEFT COLUMN (lg:col-span-2), after the "DESCRIPTION & AI INSIGHTS" section:

{/* AI DEAL ANALYSIS CARD */}
<AiAnalysisCard listingId={listing.id} />
```

**Full placement example:**

```tsx
{/* LEFT COLUMN (Content) */}
<div className="lg:col-span-2 space-y-8">
  
  {/* HERO CARD */}
  {/* ... existing hero card ... */}
  
  {/* DESCRIPTION & AI INSIGHTS */}
  {/* ... existing description section ... */}
  
  {/* ✨ ADD AI ANALYSIS CARD HERE */}
  <AiAnalysisCard listingId={listing.id} />
  
  {/* FINANCIALS PREVIEW */}
  {/* ... existing financials section ... */}
  
</div>
```

### Option 2: Deal Room Page

**File:** `src/app/deal-room/[id]/page.tsx`

Add it in the main content area where deal details are shown.

## 🎨 Component Features

✅ **Custom Hook** (`useAiAnalysis`) - Uses `supabase.functions.invoke()`  
✅ **Grade Badge** - Large, colored badge (Green/Yellow/Red) in top right  
✅ **Bold Headline** - `summary_one_liner` prominently displayed  
✅ **2-Column Grid** - Red Flags (🚩) and Green Lights (🟢) side by side  
✅ **Distinct Sections** - Buyer insight and growth vector in separate cards  
✅ **Skeleton Loader** - Mimics card layout while loading  
✅ **Premium Styling** - Tailwind CSS + Shadcn UI components  

## 🚀 Usage

```tsx
import AiAnalysisCard from "@/components/AiAnalysisCard";

// In your component:
<AiAnalysisCard listingId="your-listing-uuid" />
```

The component automatically:
- Fetches analysis on mount
- Shows loading skeleton
- Handles errors gracefully
- Displays all analysis data beautifully

