#!/bin/bash

# Deployment script for ai-search-parser Edge Function

echo "🚀 Deploying ai-search-parser Edge Function..."

# Deploy the function
supabase functions deploy ai-search-parser

echo "✅ Deployment complete!"
echo ""
echo "To test the function, use:"
echo ""
echo "curl -i --location --request POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/ai-search-parser' \\"
echo "  --header 'Authorization: Bearer YOUR_ANON_KEY' \\"
echo "  --header 'Content-Type: application/json' \\"
echo "  --data '{\"query\": \"Gas stations in Ontario with >\$300k EBITDA\", \"mode\": \"operational\"}'"




