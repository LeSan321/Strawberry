#!/bin/bash


set -e

echo "🧪 STRAWBERRY FRONTEND INTEGRATION TEST"
echo "======================================="

if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

echo "🔍 Checking environment variables..."
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo "⚠️  Warning: No .env.local or .env file found."
    echo "   Make sure to set up your environment variables:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    echo ""
fi

echo "🏗️  Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🧹 Running linter..."
npm run lint

if [ $? -eq 0 ]; then
    echo "✅ Lint check passed!"
else
    echo "⚠️  Lint issues found, but continuing..."
fi

echo "🚀 Starting development server..."
echo "   You can now test the upload functionality at http://localhost:5173"
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev
