# Analyze Listing - M&A Analysis Function

Supabase Edge Function that performs comprehensive deal analysis using OpenAI GPT-4o and a 5-hat framework for NxtOwner listings.

## Overview

This function uses OpenAI GPT-4o to analyze listing data through 5 distinct perspectives:
1. **The Buyer** - Risk & Lifestyle assessment
2. **The Seller** - Valuation & Story validation
3. **The Strategist** - Growth & SWOT analysis
4. **The Asset Expert** - Operational nuance detection
5. **The Founder** - Platform data quality standards

The analysis is automatically saved back to the `listings` table with `ai_summary`, `ai_growth_score`, and `ai_risk_score`.

## Usage

### Request Format

```json
{
  "listing_id": "uuid-of-listing"
}
```

**Note:** The function fetches data from the V17 `listings` table using these columns:
- `title`, `asking_price`, `ebitda`, `revenue_annual`, `net_margin_pct`
- `owner_hours_per_week`, `reason_for_selling`, `tech_stack`
- `growth_opportunities`, `churn_rate_pct`, `founded_year`
- `team_count`, `platform_type`, `inventory_value`

### Response Format

```json
{
  "summary_one_liner": "Premium SaaS opportunity with strong margins and passive operations",
  "deal_grade": "A",
  "buyer_insight": "Investment Grade / Passive Opportunity",
  "growth_vector": "Add SEO/content marketing to acquire organic customers and reduce CAC",
  "red_flags": [
    "High churn rate (6%) with low growth - customer retention risk"
  ],
  "green_lights": [
    "Owner works only 5 hours/week - true passive income",
    "Low churn rate (2.5%) indicates strong customer stickiness"
  ],
  "valuation_comment": "Multiple (3.2x EBITDA) is fair given 25% growth rate"
}
```

## Deal Grades

- **A**: Premium opportunity with strong fundamentals, low risk, high reward
- **B**: Solid business with manageable risks and growth potential
- **C**: High-risk deal requiring extensive due diligence

## How It Works

1. Fetches listing data from V17 `listings` table
2. Sends data to OpenAI GPT-4o with the 5-hat system prompt
3. Parses AI response into structured JSON
4. Saves analysis back to database:
   - `ai_summary` = summary_one_liner
   - `ai_growth_score` = 95 (A), 80 (B), or 60 (C)
   - `ai_risk_score` = 10 (A), 40 (B), or 80 (C)
5. Returns full analysis JSON to caller

## Analysis Criteria (5 Hats)

The AI analyzes through these lenses:

### Hat 1: The Buyer
- **Passivity Test**: Checks `owner_hours_per_week` (< 10 = Investment Grade, > 30 = Owner-Operator)
- **Stickiness Test** (Digital): Analyzes `churn_rate_pct` and growth correlation
- **Longevity Test** (Operational): Evaluates `founded_year` and business age

### Hat 2: The Seller
- **Hook Detection**: Identifies premium efficiency from margins
- **Exit Validation**: Validates `reason_for_selling` against business metrics

### Hat 3: The Strategist
- **Tech Stack Audit**: Evaluates `tech_stack` for transferability
- **Growth Path**: Prioritizes `growth_opportunities` by business type

### Hat 4: The Asset Expert
- **Inventory Check**: Compares `inventory_value` to `asking_price`
- **Team Reliance**: Analyzes `team_count` vs revenue dependency

### Hat 5: The Founder
- **Data Integrity**: Flags missing critical fields
- **Tone**: Professional, objective, encouraging

## Deployment

```bash
supabase functions deploy analyze-listing
```

## Environment Variables

- `SUPABASE_URL` - Automatically provided by Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Automatically provided by Supabase
- `OPENAI_API_KEY` - **Required** - Your OpenAI API key for GPT-4o access

## Example cURL

```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/analyze-listing \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"listing_id": "123e4567-e89b-12d3-a456-426614174000"}'
```

