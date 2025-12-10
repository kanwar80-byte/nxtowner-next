# Valuation System: Internal Developer Notes

## High-Level Flow

1. **Valuation Wizard (UI):**
   - Users (buyers/sellers) enter business details in a step-by-step wizard (`src/app/valuation/page.tsx`).
2. **API Request:**
   - Wizard submits data to `/api/ai-valuation` (see `src/app/api/ai-valuation/route.ts`).
3. **AI Valuation:**
   - API builds a prompt and sends it to Gemini AI for valuation.
   - The AI prompt is constructed in the API route.
4. **JSON Cleaning & Validation:**
   - AI output is cleaned with `cleanJsonString` (`src/lib/cleanJsonString.ts`).
   - Output is validated with Zod schema (`src/lib/valuationSchema.ts`).
5. **Supabase Storage:**
   - Validated results are stored in Supabase (see API route).
6. **Badges & Admin:**
   - Valuation badges are shown on dashboards/listings.
   - Admins manage valuations in `src/app/admin/valuations/page.tsx`.

## Key Locations

- **AI Prompt:** Built in `/api/ai-valuation/route.ts`.
- **JSON Cleaning:** `src/lib/cleanJsonString.ts`.
- **Validation:** `src/lib/valuationSchema.ts` (Zod).
- **Admin Actions:** Delete/rerun in `/api/admin/valuations/[id]/route.ts` and `/rerun/route.ts`.

## Admin Dashboard
- Table view of all valuations, with controls to delete or rerun AI.
- Table columns: ID, Title, Type, Status, Min/Max, Currency, Actions.

## UI/UX
- ValuationWizard: Stepwise, clear labels, error handling, and loading states.
- Admin: Readable, responsive table, critical info visible, consistent with dashboard visuals.

---
For questions, see the code comments in the above files or contact the lead developer.
