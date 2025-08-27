#!/bin/bash

# 🚀 Khadum Review SMTP Deployment Script
# This script deploys the email notification edge function to Supabase

echo "📧 Deploying Khadum Review SMTP System..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "❌ Supabase project not linked. Please run:"
    echo "   supabase link --project-ref YOUR_PROJECT_REF"
    exit 1
fi

# Deploy the edge function
echo "🚀 Deploying send-review-notification function..."
supabase functions deploy send-review-notification

if [ $? -eq 0 ]; then
    echo "✅ Edge function deployed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set RESEND_API_KEY in Supabase Dashboard > Settings > Edge Functions"
    echo "2. Test the function with the admin dashboard"
    echo "3. Monitor logs in Supabase Dashboard > Edge Functions > Logs"
    echo ""
    echo "🔗 Function URL:"
    echo "   https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-review-notification"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi

