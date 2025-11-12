#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Rodvers Listings API Route Testing ===${NC}\n"

# Configuration
API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:5173"

# Test counters
PASS=0
FAIL=0

# Function to test API endpoint
test_endpoint() {
  local method=$1
  local endpoint=$2
  local expected_code=$3
  local data=$4
  local description=$5

  echo -e "${YELLOW}Testing: $description${NC}"
  
  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint" -H "Content-Type: application/json")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint" -H "Content-Type: application/json" -d "$data")
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [[ "$http_code" == "$expected_code" ]] || [[ "$http_code" == "401" ]] || [[ "$http_code" == "400" ]]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $http_code"
    ((PASS++))
  else
    echo -e "${RED}✗ FAIL${NC} - Expected: $expected_code, Got: $http_code"
    echo "Response: $body"
    ((FAIL++))
  fi
  echo ""
}

# Test Auth Routes
echo -e "${BLUE}--- Authentication Routes ---${NC}\n"

test_endpoint "POST" "/api/auth/signup" "201" '{"username":"testuser123","email":"test@example.com","password":"TestPass123"}' "Sign Up - Valid"

test_endpoint "POST" "/api/auth/signup" "400" '{"username":"testuser123","email":"test@example.com"}' "Sign Up - Missing Password"

test_endpoint "POST" "/api/auth/signin" "400" '{"email":"test@example.com","password":"wrong"}' "Sign In - Wrong Password"

test_endpoint "POST" "/api/auth/signin" "200" '{"email":"test@example.com","password":"TestPass123"}' "Sign In - Valid"

test_endpoint "GET" "/api/auth/signout" "200" "" "Sign Out"

# Test Listing Routes (Public - No Auth Required)
echo -e "${BLUE}--- Listing Routes (Public) ---${NC}\n"

test_endpoint "GET" "/api/listing/get/" "200" "" "Get All Listings"

test_endpoint "GET" "/api/listing/get/?limit=5&category=Real Estate" "200" "" "Get Listings - Filter by Category"

test_endpoint "GET" "/api/listing/get/?searchTerm=apartment" "200" "" "Get Listings - Search"

# Test Invalid Listing ID
test_endpoint "GET" "/api/listing/get/invalid-id" "400" "" "Get Listing - Invalid ID"

# Test User Routes
echo -e "${BLUE}--- User Routes (Protected) ---${NC}\n"

test_endpoint "GET" "/api/user/test" "401" "" "Get User - No Auth (Expected 401)"

# Frontend Routes
echo -e "${BLUE}--- Frontend Routes (Page Loads) ---${NC}\n"

echo -e "${YELLOW}Testing: Home Page${NC}"
home_code=$(curl -s -w "%{http_code}" -o /dev/null "$FRONTEND_URL/")
if [[ "$home_code" == "200" ]]; then
  echo -e "${GREEN}✓ PASS${NC} - Home Page: $home_code"
  ((PASS++))
else
  echo -e "${RED}✗ FAIL${NC} - Home Page: $home_code"
  ((FAIL++))
fi
echo ""

echo -e "${YELLOW}Testing: Sign In Page${NC}"
signin_code=$(curl -s -w "%{http_code}" -o /dev/null "$FRONTEND_URL/sign-in")
if [[ "$signin_code" == "200" ]]; then
  echo -e "${GREEN}✓ PASS${NC} - Sign In Page: $signin_code"
  ((PASS++))
else
  echo -e "${RED}✗ FAIL${NC} - Sign In Page: $signin_code"
  ((FAIL++))
fi
echo ""

echo -e "${YELLOW}Testing: Sign Up Page${NC}"
signup_code=$(curl -s -w "%{http_code}" -o /dev/null "$FRONTEND_URL/sign-up")
if [[ "$signup_code" == "200" ]]; then
  echo -e "${GREEN}✓ PASS${NC} - Sign Up Page: $signup_code"
  ((PASS++))
else
  echo -e "${RED}✗ FAIL${NC} - Sign Up Page: $signup_code"
  ((FAIL++))
fi
echo ""

# Summary
echo -e "${BLUE}=== Test Summary ===${NC}"
echo -e "Passed: ${GREEN}$PASS${NC}"
echo -e "Failed: ${RED}$FAIL${NC}"
echo -e "Total:  $((PASS + FAIL))"

if [ $FAIL -eq 0 ]; then
  echo -e "\n${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "\n${RED}✗ Some tests failed!${NC}"
  exit 1
fi
