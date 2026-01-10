# SearchSidebar Component - Setup Guide

## ✅ Files Created

1. **`src/hooks/useDebounce.ts`** - Custom debounce hook (300ms default)
2. **`src/components/ui/switch.tsx`** - Shadcn Switch component
3. **`src/components/ui/sheet.tsx`** - Shadcn Sheet component (for mobile drawer)
4. **`src/components/SearchSidebar.tsx`** - Main filtering component

## 📦 Required Dependencies

You need to install these Radix UI packages:

```bash
pnpm add @radix-ui/react-switch @radix-ui/react-dialog
```

## 🎯 Features Implemented

### Layout
- ✅ **Desktop:** Sticky sidebar on left (w-64)
- ✅ **Mobile:** Hidden by default, triggered by "Filters" button that opens Shadcn Sheet drawer from left

### Asset Type Switcher
- ✅ Segmented Control (Tabs-style) at top: `[ All | Digital | Operational ]`
- ✅ When "Digital" selected: Hides Real Estate filters
- ✅ When "Operational" selected: Hides Tech Stack filters

### Universal Filters (Always Visible)
- ✅ **Deal Grade** (Prominent, near top): Multiselect checkboxes (A, B, C)
- ✅ **Verified Only**: Toggle switch
- ✅ **Price Range**: Dual-thumb slider (debounced 300ms)
- ✅ **EBITDA Range**: Dual-thumb slider (debounced 300ms)

### Conditional Filters
- ✅ **Digital Filters:**
  - MRR Range slider
  - Tech Stack: Searchable input with tag-based selection
- ✅ **Operational Filters:**
  - Location input (City/State)
  - Real Estate toggle (included/not included)

### Technical Features
- ✅ `useDebounce` hook (300ms) for Price/EBITDA sliders
- ✅ `onFilterChange` prop that passes filter object to parent
- ✅ Accordion sections for collapsible filter groups
- ✅ Badge indicators showing active filter counts
- ✅ Clear All button when filters are active

## 📝 Usage Example

```tsx
import SearchSidebar, { SearchFilters } from "@/components/SearchSidebar";

function BrowsePage() {
  const handleFilterChange = (filters: SearchFilters) => {
    // Use these filters to query Supabase
    console.log("Active filters:", filters);
    
    // Example filter object:
    // {
    //   listing_type: "digital",
    //   min_price: 100000,
    //   max_price: 5000000,
    //   deal_grade: ["A", "B"],
    //   verified_only: true,
    //   min_mrr: 5000,
    //   max_mrr: 50000,
    //   tech_stack: ["React", "Next.js"],
    // }
  };

  return (
    <div className="flex">
      <SearchSidebar onFilterChange={handleFilterChange} />
      <main className="flex-1">
        {/* Your listings grid */}
      </main>
    </div>
  );
}
```

## 🔧 Filter Object Structure

```typescript
interface SearchFilters {
  // Asset type
  listing_type?: "digital" | "operational";

  // Universal filters
  min_price?: number;
  max_price?: number;
  min_ebitda?: number;
  max_ebitda?: number;
  deal_grade?: ("A" | "B" | "C")[];
  verified_only?: boolean;

  // Digital-specific
  min_mrr?: number;
  max_mrr?: number;
  tech_stack?: string[];

  // Operational-specific
  location?: string;
  real_estate_included?: boolean;
}
```

## 🎨 Component Highlights

- **Deal Grade** is prominently placed near the top (as requested for ROI)
- **Debounced sliders** prevent excessive database queries
- **Tech Stack** supports both search and tag-based selection
- **Responsive design** with mobile-first approach
- **Accordion sections** keep the UI clean and organized
- **Badge indicators** show active filter counts

## 🚀 Next Steps

1. Install dependencies: `pnpm add @radix-ui/react-switch @radix-ui/react-dialog`
2. Import and use `SearchSidebar` in your browse page
3. Connect `onFilterChange` to your Supabase query logic
4. Map `deal_grade` filters to `ai_growth_score` and `ai_risk_score` in your database queries

