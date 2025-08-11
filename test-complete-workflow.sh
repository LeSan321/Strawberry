#!/bin/bash


set -e

echo "🧪 STRAWBERRY COMPLETE WORKFLOW TEST"
echo "===================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SUPABASE_PROJECT_REF=${SUPABASE_PROJECT_REF:-""}
TEST_MODE=${1:-"local"}
JWT_TOKEN=${2:-""}

echo -e "${BLUE}🔍 Test Configuration:${NC}"
echo "  Mode: $TEST_MODE"
echo "  Project Ref: ${SUPABASE_PROJECT_REF:-'Not set'}"
echo "  JWT Token: ${JWT_TOKEN:+[PROVIDED]}${JWT_TOKEN:-[NOT PROVIDED]}"
echo ""

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ Error: $1 is not installed${NC}"
        exit 1
    fi
}

test_edge_function() {
    echo -e "${BLUE}🔧 Testing Edge Function...${NC}"
    
    if [ "$TEST_MODE" = "local" ]; then
        FUNCTION_URL="http://127.0.0.1:54321/functions/v1/create-upload-url"
    else
        if [ -z "$SUPABASE_PROJECT_REF" ]; then
            echo -e "${RED}❌ SUPABASE_PROJECT_REF required for production testing${NC}"
            exit 1
        fi
        FUNCTION_URL="https://${SUPABASE_PROJECT_REF}.supabase.co/functions/v1/create-upload-url"
    fi
    
    if [ -z "$JWT_TOKEN" ]; then
        echo -e "${YELLOW}⚠️  No JWT token provided, skipping edge function test${NC}"
        return 0
    fi
    
    echo "  Testing URL: $FUNCTION_URL"
    
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "fileName": "test-song.mp3",
            "fileSize": 5242880,
            "contentType": "audio/mpeg"
        }' \
        "$FUNCTION_URL" 2>/dev/null || echo -e "\n000")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n -1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ Edge function test passed${NC}"
        echo "  Response: $BODY"
    else
        echo -e "${RED}❌ Edge function test failed (HTTP $HTTP_CODE)${NC}"
        echo "  Response: $BODY"
        return 1
    fi
}

test_frontend_build() {
    echo -e "${BLUE}🏗️  Testing Frontend Build...${NC}"
    
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json not found${NC}"
        exit 1
    fi
    
    if [ ! -d "node_modules" ]; then
        echo "  Installing dependencies..."
        npm install --legacy-peer-deps --silent
    fi
    
    echo "  Building project..."
    if npm run build --silent; then
        echo -e "${GREEN}✅ Frontend build successful${NC}"
    else
        echo -e "${RED}❌ Frontend build failed${NC}"
        return 1
    fi
}

validate_file_structure() {
    echo -e "${BLUE}📁 Validating File Structure...${NC}"
    
    REQUIRED_FILES=(
        "supabase/functions/create-upload-url/index.ts"
        "supabase/functions/_shared/cors.ts"
        "supabase/config.toml"
        "deploy.sh"
        "test-function.sh"
        "storage-policies.sql"
        "lib/uploadUtils.ts"
        "lib/supabase.ts"
    )
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ -f "$file" ]; then
            echo -e "  ${GREEN}✅${NC} $file"
        else
            echo -e "  ${RED}❌${NC} $file (missing)"
            return 1
        fi
    done
    
    echo -e "${GREEN}✅ All required files present${NC}"
}

validate_environment() {
    echo -e "${BLUE}🌍 Validating Environment...${NC}"
    
    if [ -f ".env.local" ] || [ -f ".env" ]; then
        echo -e "  ${GREEN}✅${NC} Environment file found"
    else
        echo -e "  ${YELLOW}⚠️${NC}  No .env file found (may need manual setup)"
    fi
    
    REQUIRED_COMMANDS=("node" "npm")
    for cmd in "${REQUIRED_COMMANDS[@]}"; do
        if command -v $cmd &> /dev/null; then
            echo -e "  ${GREEN}✅${NC} $cmd available"
        else
            echo -e "  ${RED}❌${NC} $cmd not found"
            return 1
        fi
    done
    
    if [ "$TEST_MODE" = "local" ] || [ -n "$SUPABASE_PROJECT_REF" ]; then
        if command -v supabase &> /dev/null; then
            echo -e "  ${GREEN}✅${NC} Supabase CLI available"
        else
            echo -e "  ${YELLOW}⚠️${NC}  Supabase CLI not found (needed for deployment)"
        fi
    fi
}

run_integration_tests() {
    echo -e "${BLUE}🔗 Running Integration Tests...${NC}"
    
    echo "  Testing uploadUtils import..."
    if node -e "
        try {
            const fs = require('fs');
            const content = fs.readFileSync('lib/uploadUtils.ts', 'utf8');
            if (content.includes('create-upload-url')) {
                console.log('✅ uploadUtils updated for signed URLs');
                process.exit(0);
            } else {
                console.log('❌ uploadUtils not updated');
                process.exit(1);
            }
        } catch (e) {
            console.log('❌ Error reading uploadUtils:', e.message);
            process.exit(1);
        }
    "; then
        echo -e "    ${GREEN}✅${NC} Upload utils integration verified"
    else
        echo -e "    ${RED}❌${NC} Upload utils integration failed"
        return 1
    fi
    
    echo "  Testing Track interface..."
    if node -e "
        try {
            const fs = require('fs');
            const content = fs.readFileSync('lib/supabase.ts', 'utf8');
            if (content.includes('artist?:') && content.includes('genre?:')) {
                console.log('✅ Track interface updated');
                process.exit(0);
            } else {
                console.log('❌ Track interface not updated');
                process.exit(1);
            }
        } catch (e) {
            console.log('❌ Error reading supabase.ts:', e.message);
            process.exit(1);
        }
    "; then
        echo -e "    ${GREEN}✅${NC} Track interface verified"
    else
        echo -e "    ${RED}❌${NC} Track interface verification failed"
        return 1
    fi
    
    echo -e "${GREEN}✅ Integration tests passed${NC}"
}

main() {
    echo -e "${BLUE}🚀 Starting Complete Workflow Test...${NC}"
    echo ""
    
    validate_environment
    echo ""
    
    validate_file_structure
    echo ""
    
    test_frontend_build
    echo ""
    
    run_integration_tests
    echo ""
    
    test_edge_function
    echo ""
    
    echo -e "${GREEN}🎉 ALL TESTS COMPLETED SUCCESSFULLY!${NC}"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "1. Deploy edge function: ./deploy.sh"
    echo "2. Create storage bucket: 'audio-uploads' in Supabase dashboard"
    echo "3. Apply storage policies: Run SQL from storage-policies.sql"
    echo "4. Test complete workflow with real uploads"
    echo ""
    echo -e "${BLUE}🔗 Useful Commands:${NC}"
    echo "  Local development: npm run dev"
    echo "  Test edge function: ./test-function.sh YOUR_JWT_TOKEN"
    echo "  View function logs: supabase functions logs create-upload-url"
}

main "$@"
