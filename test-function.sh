#!/bin/bash


set -e

JWT_TOKEN="$1"
ENVIRONMENT="${2:-local}"

if [ -z "$JWT_TOKEN" ]; then
    echo "❌ Usage: $0 \"YOUR_JWT_TOKEN\" [environment]"
    echo "   environment: local (default) or production"
    exit 1
fi

if [ "$ENVIRONMENT" = "production" ]; then
    if [ -z "$SUPABASE_PROJECT_REF" ]; then
        echo "❌ SUPABASE_PROJECT_REF environment variable is required for production testing"
        echo "   Example: SUPABASE_PROJECT_REF=your-ref ./test-function.sh \"token\" production"
        exit 1
    fi
    FUNCTION_URL="https://${SUPABASE_PROJECT_REF}.supabase.co/functions/v1/create-upload-url"
else
    FUNCTION_URL="http://127.0.0.1:54321/functions/v1/create-upload-url"
fi

echo "🧪 Testing create-upload-url edge function..."
echo "📍 Environment: $ENVIRONMENT"
echo "🔗 URL: $FUNCTION_URL"
echo ""

TEST_FILE_NAME="test-audio.mp3"
TEST_FILE_SIZE=5242880  # 5MB
TEST_CONTENT_TYPE="audio/mpeg"

echo "📝 Test parameters:"
echo "   File name: $TEST_FILE_NAME"
echo "   File size: $TEST_FILE_SIZE bytes"
echo "   Content type: $TEST_CONTENT_TYPE"
echo ""

echo "🚀 Making request to edge function..."

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"fileName\": \"$TEST_FILE_NAME\",
    \"fileSize\": $TEST_FILE_SIZE,
    \"contentType\": \"$TEST_CONTENT_TYPE\"
  }" \
  "$FUNCTION_URL")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$RESPONSE" | head -n -1)

echo "📊 Response:"
echo "   HTTP Status: $HTTP_CODE"
echo "   Body: $RESPONSE_BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Test passed! Edge function is working correctly."
    
    echo ""
    echo "📋 Response details:"
    echo "$RESPONSE_BODY" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE_BODY"
    
    echo ""
    echo "🎉 You can now use this signed URL to upload files directly to storage!"
else
    echo "❌ Test failed with HTTP status $HTTP_CODE"
    echo "📋 Error details:"
    echo "$RESPONSE_BODY"
    exit 1
fi

echo ""
echo "🔧 Additional tests you can run:"
echo "1. Test with invalid JWT token"
echo "2. Test with oversized file (>100MB)"
echo "3. Test with unsupported file type"
echo "4. Test the actual file upload using the returned signed URL"
