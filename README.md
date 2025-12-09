## Setup

Create `.env.local` with your Supabase keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... # service role; server-only
```

Install and run:

```bash
npm install
npm run dev
```

## Server helper for deal rooms

The RPC `create_deal_room_with_nda` is exposed via `src/lib/dealRoom.ts` using the service-role client (`src/lib/supabaseAdmin.ts`). Call it only from server-side code with the service key loaded.

```ts
import { createDealRoomWithNda } from "@/lib/dealRoom";

await createDealRoomWithNda({
	listingId: "...",
	buyerId: "...",
	signedPdfUrl: "https://.../nda.pdf",
	initialMessage: "Excited to discuss",
});
```
