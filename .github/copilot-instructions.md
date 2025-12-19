# Copilot Instructions for AI Agents

## Project Overview
- This is a Next.js 14+ monorepo using TypeScript, Tailwind CSS, and Supabase for backend services.
- The main app is in `src/app/`, with feature routes (e.g., `dashboard/`, `admin/`, `listing/`).
- Business logic and data access are in `src/actions/` (server actions) and `src/lib/` (helpers, Supabase clients).
- Supabase is the primary database and auth provider. See `src/lib/supabase.ts` and `src/lib/supabaseAdmin.ts`.
- SQL migrations and helpers are in `supabase/migrations/` and `supabase/sql/`.

## Key Patterns & Conventions
- Use server actions in `src/actions/` for all data mutations and queries. These are invoked from React Server Components or API routes.
- Supabase service role (admin) access is only used server-side via `src/lib/supabaseAdmin.ts`.
- Client-side code should use the public Supabase client (`src/lib/supabase.ts`).
- Shared types are in `src/types/` (e.g., `listing.ts`, `database.ts`).
- UI components are in `src/components/`, organized by feature and common/shared.
- CSS is managed via Tailwind (`globals.css`, `tailwind.config.ts`).

## Developer Workflows
- **Local dev:** `npm install` then `npm run dev` (see README.md).
- **Environment:** Set up `.env.local` with Supabase keys as shown in README.md.
- **Migrations:** Place SQL files in `supabase/migrations/`. Apply using Supabase CLI or dashboard.
- **Adding features:** Create a new folder in `src/app/` for new routes/pages. Add server actions in `src/actions/` and UI in `src/components/`.
- **Deal Room helpers:** Use `src/lib/dealRoom.ts` for deal room logic. Only call admin RPCs from server-side code.

## Integration Points
- Supabase: All data and auth. Use the correct client for server/client context.
- Stripe: Payment logic in `src/actions/stripe.ts` and `src/lib/stripe.ts`.
- AI: AI listing processing in `src/actions/aiProcessListing.ts` and `src/app/api/ai-search-listings/`.

## Examples
- To create a deal room with NDA:
  See `src/lib/dealRoom.ts` and README.md for usage.
- To add a new dashboard widget:
  Add logic in `src/actions/get*DashboardData.ts` and UI in `src/components/dashboard/`.

## Project-Specific Notes
- Do not use the service role key on the client.
- Follow the folder structure for scalability: actions, lib, types, components, app routes.
- Use TypeScript types from `src/types/` for all data models.

---
For more, see `README.md` and comments in key files. Ask for clarification if a pattern is unclear or missing.
