# AI Analysis Card - Placement Instructions

## ✅ Files Created

1. **`src/hooks/useAiAnalysis.ts`** - Custom hook using `supabase.functions.invoke('analyze-listing')`
2. **`src/components/AiAnalysisCard.tsx`** - Premium React component with all requirements

## 📍 Exact Placement Location

### File: `src/app/(platform)/listing/[id]/page.tsx`

**Insert the component RIGHT AFTER the "DESCRIPTION & AI INSIGHTS" section and BEFORE the "FINANCIALS PREVIEW" section.**

### Step 1: Add the Import

At the top of the file, add this import:

```tsx
import AiAnalysisCard from "@/components/AiAnalysisCard";
```

### Step 2: Insert the Component

Find this section (around line 160):

```tsx
            {/* DESCRIPTION & AI INSIGHTS */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8">
              {/* ... existing content ... */}
            </div>

            {/* FINANCIALS PREVIEW (Blurred) */}
            <div className="relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 overflow-hidden">
```

**Insert this code BETWEEN the two sections:**

```tsx
            {/* DESCRIPTION & AI INSIGHTS */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8">
              {/* ... existing content ... */}
            </div>

            {/* ✨ AI DEAL ANALYSIS CARD - INSERT HERE */}
            <AiAnalysisCard listingId={listing.id} />

            {/* FINANCIALS PREVIEW (Blurred) */}
            <div className="relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 overflow-hidden">
```

### Complete Example

Your file should look like this:

```tsx
"use client";

import { useState } from "react";
import { 
  MapPin, Globe, ShieldCheck, Lock, CheckCircle2, 
  TrendingUp, FileText, ArrowRight, Building2, Server, Briefcase
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AiAnalysisCard from "@/components/AiAnalysisCard"; // ✨ ADD THIS

// ... rest of your code ...

export default function ListingDetailPage() {
  const listing = MOCK_LISTING; // In real app: use params.id to fetch
  
  // ... existing code ...

  return (
    <main className="min-h-screen bg-[#050505] pt-24 pb-20">
      {/* ... breadcrumbs ... */}
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (Content) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* HERO CARD */}
            {/* ... existing hero card ... */}
            
            {/* DESCRIPTION & AI INSIGHTS */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8">
              {/* ... existing content ... */}
            </div>

            {/* ✨ AI DEAL ANALYSIS CARD - INSERT HERE */}
            <AiAnalysisCard listingId={listing.id} />

            {/* FINANCIALS PREVIEW (Blurred) */}
            <div className="relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 overflow-hidden">
              {/* ... existing content ... */}
            </div>
            
          </div>
          
          {/* RIGHT COLUMN (Sidebar) */}
          {/* ... existing sidebar ... */}
          
        </div>
      </div>
    </main>
  );
}
```

## 🎨 Component Features

✅ **Custom Hook** - Uses `supabase.functions.invoke('analyze-listing')`  
✅ **Grade Badge** - Large, colored badge (Green/Yellow/Red) in top right  
✅ **Bold Headline** - `summary_one_liner` prominently displayed  
✅ **2-Column Grid** - 🟢 Green Lights and 🚩 Red Flags side by side  
✅ **Distinct Sections** - Buyer Insight and Growth Vector in separate blocks  
✅ **Skeleton Loader** - Prevents layout shift while loading  
✅ **Premium Styling** - Tailwind CSS + Shadcn UI components  

## 🚀 Testing

1. Navigate to any listing detail page: `/listing/[id]`
2. The AI Analysis Card will appear below the description section
3. You'll see a skeleton loader while the Edge Function processes
4. Once loaded, you'll see the full analysis with the grade badge

## 📝 Notes

- The component automatically handles loading, errors, and empty states
- The `listingId` prop accepts `string | null` - if null, nothing renders
- The component uses the dark theme styling to match your existing design
- All data is fetched client-side using the custom hook

