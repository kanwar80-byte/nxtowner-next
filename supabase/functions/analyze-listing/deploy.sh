#!/bin/bash

# Deploy analyze-listing Supabase Edge Function

echo "🚀 Deploying analyze-listing function..."

supabase functions deploy analyze-listing

if [ $? -eq 0 ]; then
  echo "✅ Successfully deployed analyze-listing function"
else
  echo "❌ Deployment failed"
  exit 1
fi

