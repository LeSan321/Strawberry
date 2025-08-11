#!/bin/bash


set -e

echo "🚀 Starting Supabase Edge Function Deployment..."

if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run:"
    echo "supabase login"
    exit 1
fi

if [ ! -f ".supabase/config.toml" ]; then
    echo "❌ Project not linked to Supabase. Please run:"
    echo "supabase link --project-ref YOUR_PROJECT_REF"
    exit 1
fi

echo "✅ Prerequisites check passed"

echo "🔧 Setting up environment variables..."

echo "📝 Please ensure the following secrets are set in your Supabase project:"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - FRONTEND_URL"
echo ""
echo "You can set them using:"
echo "supabase secrets set SUPABASE_SERVICE_ROLE_KEY=\"your-service-role-key\""
echo "supabase secrets set FRONTEND_URL=\"https://yourdomain.com\""
echo ""

read -p "Have you set the required secrets? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please set the required secrets before deploying"
    exit 1
fi

echo "🚀 Deploying create-upload-url edge function..."
supabase functions deploy create-upload-url

if [ $? -eq 0 ]; then
    echo "✅ Edge function deployed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Create the 'audio-uploads' storage bucket in your Supabase dashboard"
    echo "2. Set up the storage policies (see deployment-guide.md)"
    echo "3. Test the function using ./test-function.sh"
    echo "4. Update your frontend to use the new upload workflow"
    echo ""
    echo "🔗 Function URL: https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-upload-url"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi
