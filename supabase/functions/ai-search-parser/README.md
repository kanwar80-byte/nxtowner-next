# AI Search Parser Edge Function

Supabase Edge Function that parses natural language search queries into structured filters for NxtOwner.ca.

## Features

- **Lightweight NLP**: Regex-based parsing for fast, cost-effective query processing
- **AI-Enhanced** (Optional): Supports OpenAI or Groq for advanced parsing when API keys are configured
- **Mode-Aware**: Different parsing logic for operational vs digital assets
- **Structured Output**: Returns JSON with category, location, financial metrics, and verification status

## Input

```json
{
  "query": "Gas stations in Ontario with >$300k EBITDA",
  "mode": "operational"
}
```

## Output

```json
{
  "filters": {
    "category": "Gas Stations",
    "location": "Ontario",
    "min_value": 300000,
    "is_verified": false,
    "type": "operational"
  },
  "raw_query": "Gas stations in Ontario with >$300k EBITDA"
}
```

## Deployment

### Prerequisites

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-ref
```

### Deploy Function

```bash
supabase functions deploy ai-search-parser
```

### Set Environment Variables (Optional)

If you want to use AI-enhanced parsing, set these secrets:

```bash
# OpenAI (optional)
supabase secrets set OPENAI_API_KEY=your-openai-key

# Groq (optional, alternative to OpenAI)
supabase secrets set GROQ_API_KEY=your-groq-key
```

## Testing

### Local Testing

```bash
supabase functions serve ai-search-parser
```

Then test with curl:

```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/ai-search-parser' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "query": "Gas stations in Ontario with >$300k EBITDA",
    "mode": "operational"
  }'
```

### Production Testing

```bash
curl -i --location --request POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/ai-search-parser' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "query": "SaaS with <10% churn and $20k MRR",
    "mode": "digital"
  }'
```

## Usage in Frontend

```typescript
const response = await fetch(
  `${supabaseUrl}/functions/v1/ai-search-parser`,
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: "Gas stations in Ontario with >$300k EBITDA",
      mode: "operational",
    }),
  }
);

const { filters, raw_query } = await response.json();
```


