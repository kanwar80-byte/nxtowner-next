\# NxtOwner Milestones — 2025-12-23 (Toronto)



\## ✅ Confirmed Wiring (Homepage)

\- Home page file: src/app/page.tsx

\- Wired components:

&nbsp; - src/components/Hero.tsx  (NOT components/home/Hero.tsx)

&nbsp; - src/components/MarketInsights.tsx (NOT components/home/MarketInsights.tsx)

&nbsp; - src/components/Opportunities.tsx

&nbsp; - src/components/SelectServices.tsx

&nbsp; - src/components/home/BrowseByCategory.tsx

&nbsp; - src/components/home/RecentListings.tsx



\## ✅ Confirmed Wiring (Browse)

\- Browse route: src/app/(platform)/browse/page.tsx

\- Uses:

&nbsp; - src/components/platform/BrowseClientShell.tsx

&nbsp; - src/components/platform/FilterSidebar.tsx

&nbsp; - supabase server helper: src/lib/supabase/server (supabaseServer())



\## ✅ Duplicate Components (Found)

\- Hero.tsx duplicated:

&nbsp; - src/components/Hero.tsx  ✅ wired + newest

&nbsp; - src/components/home/Hero.tsx  ❌ unused

\- MarketInsights.tsx duplicated:

&nbsp; - src/components/MarketInsights.tsx ✅ wired + newest

&nbsp; - src/components/home/MarketInsights.tsx ❌ unused

\- Browse/platform duplicates exist (to verify later):

&nbsp; - FilterSidebar.tsx (browse vs platform)

&nbsp; - ListingCard.tsx (browse vs platform)

&nbsp; - ListingGrid.tsx (browse vs platform)

&nbsp; - ListingRow.tsx (listings vs platform)



\## ✅ Supabase + Buyer Dashboard (Working Path)

\- Buyer dashboard: src/app/dashboard/buyer/page.tsx

\- Uses:

&nbsp; - requireAuth from src/lib/auth

&nbsp; - watchlist + dealroom actions from src/app/actions/\*

&nbsp; - supabase import from '@/lib/supabase'

&nbsp; - Queries tables: profiles, listings, ndas

\- Buyer dashboard links deal rooms to: /deal-room/:id



\## ⚠️ Issue Found: Missing deal-room route page

\- Folder exists: src/app/deal-room/\[id]

\- But it contains no page.tsx (route broken)

\- Actual deal page exists at:

&nbsp; - src/app/(platform)/deals/\[id]/page.tsx



\## ✅ Planned Safe Fix (Bridge)

\- Create: src/app/deal-room/\[id]/page.tsx

\- Re-export:

&nbsp; - default + revalidate from "@/app/(platform)/deals/\[id]/page"

\- Purpose: keep buyer dashboard links working without touching deal logic



\## ✅ Safety Notes

\- components/home/Hero and components/home/MarketInsights are not imported anywhere (Select-String returned none)

\- No conflict markers detected in repo search (<<<<<<< etc)



