# 🚀 NxtOwner Deployment Guide

## Overview
This guide walks you through deploying the complete NxtOwner platform with Supabase database, admin console, watchlist functionality, and NDA/Deal Room features.

---

## 1️⃣ Deploy Database Migration

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project: `olxenztewnlmmdldotld`
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run Migration
1. Click **New Query**
2. Open `supabase/migrations/20241208_core_schema.sql` from this workspace
3. Copy the entire contents (372 lines)
4. Paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)

### Expected Output
You should see successful creation of:
- ✅ 9 tables (profiles, listings, watchlist, ndas, deal_rooms, deal_room_members, messages, offers, nda_signatures)
- ✅ RLS policies for each table
- ✅ Triggers for updated_at columns
- ✅ Indexes for performance

### Verify Migration
Run this query to confirm tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see all 9 tables listed.

---

## 2️⃣ Set Environment Variables

### Required Environment Variables

#### Supabase (Already Set)
```env
NEXT_PUBLIC_SUPABASE_URL=https://olxenztewnlmmdldotld.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

#### Supabase Service Role (Required for Admin Actions)
Add this to `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

**Where to find it:**
1. Go to Supabase Dashboard → Project Settings → API
2. Copy the `service_role` key (secret, server-side only)
3. Add to `.env.local` (never commit this!)

#### Gemini API (Required for AI Search)
Add this to `.env.local`:
```env
GEMINI_API_KEY=<your-gemini-api-key>
```

**Where to get it:**
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Add to `.env.local`

### Vercel Deployment
Add the same environment variables to Vercel:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
3. Redeploy for changes to take effect

---

## 3️⃣ Create Admin User

After migration is deployed, you need at least one admin user.

### Option A: Update Your Existing User
Run this in Supabase SQL Editor:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Option B: Create New Admin (If No Users Exist)
1. Sign up normally at `/signup`
2. Then run the SQL above to upgrade your role

### Verify Admin Access
```sql
SELECT id, email, role, full_name 
FROM profiles 
WHERE role = 'admin';
```

---

## 4️⃣ Test the Platform

### Test Admin Console
1. **Navigate to `/admin/listings`**
2. You should see:
   - Empty state: "All caught up! No pending listings to review."
   - Or list of pending listings if any exist

### Test Watchlist Feature
1. **Navigate to `/browse`**
2. You should see:
   - Heart icon in top-right of each listing card
   - Click to add/remove from watchlist
   - Filled heart = saved, outlined = not saved
3. **If not logged in:**
   - Clicking heart redirects to `/login?redirect=/browse`

### Test NDA Flow
1. **Navigate to any listing** (e.g., `/listing/[id]`)
2. **If not logged in:**
   - See "Sign In" and "Create Account" buttons
3. **If logged in (no NDA signed):**
   - See "🔒 Unlock Data Room" button
   - Click → NDA modal appears
   - Fill optional message
   - Click "I Agree & Sign"
   - Redirects to `/deal-room/[id]`
4. **If logged in (NDA already signed):**
   - See "🔓 Data Room Unlocked"
   - Click "Enter Deal Room →"

### Test AI Search (Once Gemini API is set)
1. **Make a POST request to `/api/ai-search-listings`**
   ```bash
   curl -X POST http://localhost:3000/api/ai-search-listings \
     -H "Content-Type: application/json" \
     -d '{"query": "profitable car wash under 1M in Ontario"}'
   ```
2. You should get:
   ```json
   {
     "success": true,
     "filters": {
       "type": "asset",
       "category": "car-wash-auto",
       "max_price": 1000000,
       "location": "Ontario"
     },
     "results": [...],
     "count": 5
   }
   ```

---

## 5️⃣ Create Test Data (Optional)

To test the full workflow, create some test listings:

### Create Test Listing as Seller
Run this in Supabase SQL Editor (replace `<seller-user-id>` with your user ID):
```sql
INSERT INTO listings (
  owner_id,
  title,
  summary,
  type,
  category,
  status,
  asking_price,
  annual_revenue,
  annual_cashflow,
  country,
  region
) VALUES (
  '<seller-user-id>',
  'Profitable Car Wash - Ottawa',
  'Established 5-bay self-serve car wash with consistent revenue. Prime location near highway. Equipment recently upgraded.',
  'asset',
  'car-wash-auto',
  'draft',
  750000,
  420000,
  180000,
  'Canada',
  'Ontario'
);
```

### Submit for Review
```sql
UPDATE listings 
SET status = 'pending_review' 
WHERE title = 'Profitable Car Wash - Ottawa';
```

### Test Admin Approval
1. Go to `/admin/listings`
2. You should see the listing
3. Click "Approve" or "Reject"
4. Approved listings become visible on `/browse`

---

## 6️⃣ Next Steps

### Remaining Features to Build
1. **Deal Room UI** (`/deal-room/[id]`)
   - Message thread
   - Offer submission/management
   - Document uploads
   - Real-time updates

2. **Listing Creation Wizard** (`/sell` or `/listing/new`)
   - Multi-step form
   - Draft saving
   - Submit for review

3. **Dashboard Enhancement** (`/dashboard`)
   - Buyer: Watchlist, active deal rooms, submitted offers
   - Seller: My listings, pending approvals, active negotiations
   - Partner: Referral tracking
   - Admin: Platform metrics, user management

4. **Real-time Features**
   - Supabase subscriptions on messages table
   - Live notifications for new messages/offers

5. **Email Notifications**
   - NDA signed confirmation
   - New offer alerts
   - Listing approved/rejected
   - New message notifications

---

## 7️⃣ Architecture Highlights

### Security Model
- **RLS (Row Level Security)**: All tables have policies enforced at database level
- **Server Actions**: All mutations happen server-side, never exposing secrets to client
- **Role-Based Access**: Admin actions verify `role='admin'` before execution
- **NDA Gating**: Deal room access requires signed NDA (verified via `deal_room_members`)

### Data Flow
```
Client Request → Server Action → Supabase RLS Check → Database
                                      ↓
                                If unauthorized → Error
                                If authorized → Success
```

### Type Safety
- All database operations use `Database` generic type
- TypeScript enforces correct column types
- No runtime type errors

### Performance
- Indexed columns: `owner_id`, `status`, `type`, `user_id`, `listing_id`, `deal_room_id`
- Efficient queries with `.eq()`, `.select()` filters
- Pagination ready (use `.range()` for large datasets)

---

## 8️⃣ Common Issues

### "Not authenticated" error
- User is not logged in
- Check `supabase.auth.getSession()` returns session
- Ensure cookies are enabled

### "Permission denied" error
- RLS policy blocking access
- Check user role matches policy requirements
- Verify `deal_room_members` entry exists for deal room access

### Admin actions fail
- Service role key not set in environment
- User role is not 'admin'
- Check `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` and Vercel

### AI Search returns empty results
- Gemini API key not set
- Check `GEMINI_API_KEY` in environment
- Verify query is natural language (not SQL)

---

## 9️⃣ Monitoring & Maintenance

### Database Health
Check table sizes:
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Active Deal Rooms
```sql
SELECT 
  dr.id,
  dr.listing_id,
  dr.status,
  l.title,
  COUNT(drm.user_id) as member_count
FROM deal_rooms dr
JOIN listings l ON l.id = dr.listing_id
LEFT JOIN deal_room_members drm ON drm.deal_room_id = dr.id
WHERE dr.status IN ('pending', 'open', 'under_offer')
GROUP BY dr.id, dr.listing_id, dr.status, l.title
ORDER BY dr.created_at DESC;
```

### Recent Activity
```sql
SELECT 
  'listing' as type,
  id,
  title as description,
  created_at
FROM listings
WHERE created_at > NOW() - INTERVAL '7 days'
UNION ALL
SELECT 
  'offer' as type,
  id,
  'Offer: ' || amount::text as description,
  created_at
FROM offers
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 20;
```

---

## ✅ Deployment Checklist

- [ ] Database migration deployed (`supabase/migrations/20241208_core_schema.sql`)
- [ ] All 9 tables verified in Supabase
- [ ] `SUPABASE_SERVICE_ROLE_KEY` added to `.env.local` and Vercel
- [ ] `GEMINI_API_KEY` added to `.env.local` and Vercel
- [ ] At least one admin user created
- [ ] Admin console accessible at `/admin/listings`
- [ ] Browse page shows watchlist hearts
- [ ] Listing detail page shows NDA unlock flow
- [ ] Test listing created and approved
- [ ] AI search tested with sample query
- [ ] Vercel deployment successful

---

## 🎉 You're Ready!

Once all checklist items are complete, your NxtOwner platform is live with:
- ✅ Functional admin console for listing approval
- ✅ Watchlist functionality on browse/listing pages
- ✅ NDA signing and deal room creation
- ✅ AI-powered natural language search
- ✅ Secure RLS-enforced database
- ✅ Type-safe server actions

**Next:** Build the Deal Room UI and Listing Creation Wizard to complete the platform! 🚀
