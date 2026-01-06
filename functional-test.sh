#!/bin/bash

# ================================================
# NXTOWNER FUNCTIONAL TESTING SCRIPT
# Tests the actual running application
# Usage: ./functional-test.sh [URL]
# Example: ./functional-test.sh http://localhost:3000
# ================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Default to localhost if no URL provided
BASE_URL="${1:-http://localhost:3000}"

echo -e "${BOLD}${CYAN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     NXTOWNER FUNCTIONAL TEST - STARTING                  ║"
echo "║     Testing: $BASE_URL"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Test function
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_code="${3:-200}"
    local search_text="$4"
    
    echo -e "\n${BLUE}Testing:${NC} $name"
    echo -e "URL: $url"
    
    # Make request and capture response
    response=$(curl -s -o /tmp/response.html -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" == "$expected_code" ]; then
        echo -e "${GREEN}✓${NC} HTTP Status: $response"
        
        # If search text provided, check if it exists
        if [ -n "$search_text" ]; then
            if grep -q "$search_text" /tmp/response.html 2>/dev/null; then
                echo -e "${GREEN}✓${NC} Found expected content: '$search_text'"
                ((PASSED++))
            else
                echo -e "${RED}✗${NC} Expected content not found: '$search_text'"
                ((FAILED++))
            fi
        else
            ((PASSED++))
        fi
    else
        echo -e "${RED}✗${NC} HTTP Status: $response (expected $expected_code)"
        ((FAILED++))
    fi
}

# ================================================
# 1. BASIC CONNECTIVITY
# ================================================

echo -e "\n${BOLD}${CYAN}1. CHECKING BASIC CONNECTIVITY${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if server is running
if curl -s --head --request GET "$BASE_URL" | grep "200\|301\|302" > /dev/null; then
    echo -e "${GREEN}✓${NC} Server is responding"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Server is not responding"
    echo -e "${RED}ERROR:${NC} Cannot reach $BASE_URL"
    echo "Make sure your dev server is running: npm run dev"
    exit 1
fi

# ================================================
# 2. HOMEPAGE TESTS
# ================================================

echo -e "\n${BOLD}${CYAN}2. TESTING HOMEPAGE${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Homepage loads" "$BASE_URL" 200
test_endpoint "Homepage has title" "$BASE_URL" 200 "NxtOwner"
test_endpoint "Homepage has hero section" "$BASE_URL" 200 "Operating System"

# ================================================
# 3. NAVIGATION LINKS
# ================================================

echo -e "\n${BOLD}${CYAN}3. TESTING NAVIGATION LINKS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Buy page" "$BASE_URL/buy" 200
test_endpoint "Sell page" "$BASE_URL/sell" 200
test_endpoint "About page" "$BASE_URL/about" 200
test_endpoint "Contact page" "$BASE_URL/contact" 200

# ================================================
# 4. ASSET TYPE FILTERING
# ================================================

echo -e "\n${BOLD}${CYAN}4. TESTING ASSET TYPE FILTERS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Digital assets view" "$BASE_URL/?type=digital" 200 "Digital"
test_endpoint "Operational assets view" "$BASE_URL/?type=operational" 200 "Operational"

# ================================================
# 5. CATEGORY FILTERING
# ================================================

echo -e "\n${BOLD}${CYAN}5. TESTING CATEGORY FILTERS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

categories=("saas" "ecommerce" "agency" "mobile-app" "content-site")

for category in "${categories[@]}"; do
    test_endpoint "Category: $category" "$BASE_URL/?category=$category" 200
done

# ================================================
# 6. SEARCH FUNCTIONALITY
# ================================================

echo -e "\n${BOLD}${CYAN}6. TESTING SEARCH FUNCTIONALITY${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Search: SaaS" "$BASE_URL/?search=saas" 200
test_endpoint "Search: ecommerce" "$BASE_URL/?search=ecommerce" 200
test_endpoint "Empty search" "$BASE_URL/?search=" 200

# ================================================
# 7. API ENDPOINTS
# ================================================

echo -e "\n${BOLD}${CYAN}7. TESTING API ENDPOINTS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if API routes exist
if curl -s "$BASE_URL/api/listings" | grep -q "listings\|error\|\[" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} API /listings endpoint exists"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} API /listings endpoint may not be implemented"
    ((WARNINGS++))
fi

# ================================================
# 8. STATIC ASSETS
# ================================================

echo -e "\n${BOLD}${CYAN}8. TESTING STATIC ASSETS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test common static assets
static_assets=(
    "/favicon.ico"
    "/_next/static/css"
)

for asset in "${static_assets[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$asset" 2>/dev/null)
    if [ "$response" == "200" ] || [ "$response" == "304" ]; then
        echo -e "${GREEN}✓${NC} $asset: $response"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠${NC} $asset: $response (may not exist)"
        ((WARNINGS++))
    fi
done

# ================================================
# 9. PERFORMANCE CHECK
# ================================================

echo -e "\n${BOLD}${CYAN}9. TESTING PERFORMANCE${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Measure homepage load time
load_time=$(curl -o /dev/null -s -w "%{time_total}" "$BASE_URL")
load_time_ms=$(echo "$load_time * 1000" | bc)

echo -e "Homepage load time: ${load_time}s (${load_time_ms}ms)"

if (( $(echo "$load_time < 2" | bc -l) )); then
    echo -e "${GREEN}✓${NC} Load time is good"
    ((PASSED++))
elif (( $(echo "$load_time < 5" | bc -l) )); then
    echo -e "${YELLOW}⚠${NC} Load time is acceptable but could be better"
    ((WARNINGS++))
else
    echo -e "${RED}✗${NC} Load time is slow"
    ((FAILED++))
fi

# ================================================
# 10. SECURITY HEADERS
# ================================================

echo -e "\n${BOLD}${CYAN}10. TESTING SECURITY HEADERS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

headers=$(curl -s -I "$BASE_URL")

security_headers=(
    "X-Frame-Options"
    "X-Content-Type-Options"
    "Strict-Transport-Security"
)

for header in "${security_headers[@]}"; do
    if echo "$headers" | grep -qi "$header"; then
        echo -e "${GREEN}✓${NC} $header present"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠${NC} $header missing (consider adding for production)"
        ((WARNINGS++))
    fi
done

# ================================================
# SUMMARY
# ================================================

echo -e "\n${BOLD}${CYAN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║              FUNCTIONAL TEST SUMMARY                     ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}Passed:   $PASSED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo -e "${RED}Failed:   $FAILED${NC}"

total=$((PASSED + FAILED))
if [ $total -gt 0 ]; then
    success_rate=$(echo "scale=1; $PASSED * 100 / $total" | bc)
    echo -e "\nSuccess Rate: ${success_rate}%"
fi

echo -e "\n${BOLD}${CYAN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║              TEST COMPLETE                               ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Clean up
rm -f /tmp/response.html

# Exit with error if critical tests failed
if [ $FAILED -gt 0 ]; then
    exit 1
fi

exit 0


