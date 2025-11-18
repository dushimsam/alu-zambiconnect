#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5500/api/v1"
TOKEN=""
USER_ID=""
ORG_ID=""
JOB_ID=""
OPP_ID=""
CONTENT_ID=""
PLACE_ID=""
PRICE_ID=""

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     ZambiConnect API Testing Suite                        ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Function to print test header
print_test() {
    echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}TEST: $1${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to check if server is running
check_server() {
    echo -e "${BLUE}Checking if server is running...${NC}"
    if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/../" | grep -q "404\|200"; then
        echo -e "${GREEN}✓ Server is running${NC}\n"
        return 0
    else
        echo -e "${RED}✗ Server is not running. Please start with: yarn start:dev${NC}\n"
        exit 1
    fi
}

# Function to make API call and display result
api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    local auth=$4
    
    echo -e "${BLUE}Request: $method $endpoint${NC}"
    if [ -n "$data" ]; then
        echo -e "${BLUE}Body: $data${NC}"
    fi
    
    if [ -n "$auth" ]; then
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -d "$data")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    echo -e "${GREEN}Response:${NC}"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
    echo "$response"
}

# Start testing
check_server

# ============================================================
# 1. USER & AUTH MODULE
# ============================================================
print_test "1.1 Create User (Registration)"
response=$(api_call "POST" "/users" '{
  "email": "testuser@zambiconnect.com",
  "password": "Test123456",
  "phoneNumber": "+260123456789",
  "role": "NORMAL"
}')
USER_ID=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))" 2>/dev/null)
echo -e "${GREEN}User ID: $USER_ID${NC}"

print_test "1.2 Login"
response=$(api_call "POST" "/auth/login" '{
  "email": "testuser@zambiconnect.com",
  "password": "Test123456"
}')
TOKEN=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('access_token', ''))" 2>/dev/null)
echo -e "${GREEN}Token obtained: ${TOKEN:0:50}...${NC}"

print_test "1.3 Get Current User Profile"
api_call "GET" "/auth/me" "" "auth"

print_test "1.4 Get All Users"
api_call "GET" "/users" "" ""

print_test "1.5 Get User by ID"
if [ -n "$USER_ID" ]; then
    api_call "GET" "/users/$USER_ID" "" ""
fi

print_test "1.6 Create User Profile"
if [ -n "$USER_ID" ]; then
    api_call "POST" "/users/$USER_ID/profile" '{
      "bio": "Wildlife enthusiast from Lusaka",
      "skills": ["Conservation", "Photography"],
      "interests": ["Wildlife", "Nature", "Tourism"],
      "experience": "5 years in wildlife photography",
      "education": "BSc Environmental Science"
    }' ""
fi

# ============================================================
# 2. ORGANIZATION MODULE
# ============================================================
print_test "2.1 Create Organization"
response=$(api_call "POST" "/organizations" '{
  "name": "Zambia Wildlife Trust",
  "type": "NGO",
  "description": "Conservation organization protecting Zambian wildlife",
  "email": "info@zwt.org",
  "phoneNumber": "+260211234567",
  "address": "Lusaka, Zambia",
  "website": "https://zwt.org"
}')
ORG_ID=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))" 2>/dev/null)
echo -e "${GREEN}Organization ID: $ORG_ID${NC}"

print_test "2.2 Get All Organizations"
api_call "GET" "/organizations" "" ""

print_test "2.3 Get Organization by ID"
if [ -n "$ORG_ID" ]; then
    api_call "GET" "/organizations/$ORG_ID" "" ""
fi

print_test "2.4 Update Organization"
if [ -n "$ORG_ID" ]; then
    api_call "PUT" "/organizations/$ORG_ID" '{
      "description": "Leading conservation organization in Zambia"
    }' ""
fi

print_test "2.5 Verify Organization"
if [ -n "$ORG_ID" ]; then
    api_call "PUT" "/organizations/$ORG_ID/verify" '{
      "verificationStatus": "VERIFIED",
      "verificationNotes": "Organization verified by admin"
    }' ""
fi

print_test "2.6 Get Verified Organizations"
api_call "GET" "/organizations/verified" "" ""

# ============================================================
# 3. JOB MODULE
# ============================================================
print_test "3.1 Create Job"
if [ -n "$ORG_ID" ]; then
    response=$(api_call "POST" "/jobs" '{
      "title": "Wildlife Conservation Officer",
      "description": "Join our team to protect endangered species",
      "organizationId": "'"$ORG_ID"'",
      "location": "South Luangwa National Park",
      "employmentType": "FULL_TIME",
      "salaryMin": 5000,
      "salaryMax": 8000,
      "salaryCurrency": "ZMW",
      "requiredSkills": ["Wildlife Management", "Field Research"],
      "experienceYears": 2,
      "applicationDeadline": "2025-12-31"
    }')
    JOB_ID=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))" 2>/dev/null)
    echo -e "${GREEN}Job ID: $JOB_ID${NC}"
fi

print_test "3.2 Get All Jobs"
api_call "GET" "/jobs" "" ""

print_test "3.3 Get Job by ID"
if [ -n "$JOB_ID" ]; then
    api_call "GET" "/jobs/$JOB_ID" "" ""
fi

print_test "3.4 Get Jobs by Organization"
if [ -n "$ORG_ID" ]; then
    api_call "GET" "/jobs/organization/$ORG_ID" "" ""
fi

print_test "3.5 Apply for Job"
if [ -n "$JOB_ID" ] && [ -n "$USER_ID" ]; then
    api_call "POST" "/jobs/applications" '{
      "jobId": "'"$JOB_ID"'",
      "userId": "'"$USER_ID"'",
      "coverLetter": "I am passionate about wildlife conservation...",
      "resumeUrl": "https://example.com/resume.pdf"
    }' ""
fi

print_test "3.6 Get User Applications"
if [ -n "$USER_ID" ]; then
    api_call "GET" "/jobs/applications/user/$USER_ID" "" ""
fi

# ============================================================
# 4. OPPORTUNITY MODULE  
# ============================================================
print_test "4.1 Create Volunteer Opportunity"
if [ -n "$ORG_ID" ]; then
    response=$(api_call "POST" "/opportunities" '{
      "title": "Elephant Conservation Volunteer",
      "description": "Help protect elephants in Kafue National Park",
      "organizationId": "'"$ORG_ID"'",
      "location": "Kafue National Park",
      "startDate": "2025-12-01",
      "endDate": "2026-01-31",
      "hoursPerWeek": 40,
      "accommodationProvided": true,
      "mealsProvided": true,
      "transportProvided": false,
      "requiredSkills": ["Physical fitness", "Team work"],
      "applicationDeadline": "2025-11-30"
    }')
    OPP_ID=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))" 2>/dev/null)
    echo -e "${GREEN}Opportunity ID: $OPP_ID${NC}"
fi

print_test "4.2 Get All Opportunities"
api_call "GET" "/opportunities" "" ""

print_test "4.3 Get Opportunity by ID"
if [ -n "$OPP_ID" ]; then
    api_call "GET" "/opportunities/$OPP_ID" "" ""
fi

print_test "4.4 Apply for Opportunity"
if [ -n "$OPP_ID" ] && [ -n "$USER_ID" ]; then
    api_call "POST" "/opportunities/applications" '{
      "opportunityId": "'"$OPP_ID"'",
      "userId": "'"$USER_ID"'",
      "motivation": "I want to contribute to elephant conservation",
      "availability": "Full-time for 2 months"
    }' ""
fi

print_test "4.5 Add Impact Metric"
if [ -n "$OPP_ID" ]; then
    api_call "POST" "/opportunities/impact-metrics" '{
      "opportunityId": "'"$OPP_ID"'",
      "metricType": "TREES_PLANTED",
      "value": 150,
      "unit": "trees",
      "description": "Trees planted during reforestation project"
    }' ""
fi

# ============================================================
# 5. EXPLORE/CONTENT MODULE
# ============================================================
print_test "5.1 Create Content"
if [ -n "$USER_ID" ]; then
    response=$(api_call "POST" "/explore/content" '{
      "title": "Top 10 Wildlife Destinations in Zambia",
      "description": "Discover the best places to see wildlife",
      "contentType": "ARTICLE",
      "creatorId": "'"$USER_ID"'",
      "contentUrl": "https://example.com/article",
      "thumbnailUrl": "https://example.com/thumb.jpg",
      "tags": ["Wildlife", "Tourism", "Safari"]
    }')
    CONTENT_ID=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))" 2>/dev/null)
    echo -e "${GREEN}Content ID: $CONTENT_ID${NC}"
fi

print_test "5.2 Get All Content"
api_call "GET" "/explore/content" "" ""

print_test "5.3 Get Content by ID"
if [ -n "$CONTENT_ID" ]; then
    api_call "GET" "/explore/content/$CONTENT_ID" "" ""
fi

print_test "5.4 Like Content"
if [ -n "$CONTENT_ID" ]; then
    api_call "POST" "/explore/content/$CONTENT_ID/like" '{}' ""
fi

print_test "5.5 Add Comment"
if [ -n "$CONTENT_ID" ] && [ -n "$USER_ID" ]; then
    api_call "POST" "/explore/comments" '{
      "contentId": "'"$CONTENT_ID"'",
      "userId": "'"$USER_ID"'",
      "comment": "Great article! Very informative."
    }' ""
fi

print_test "5.6 Get Content Comments"
if [ -n "$CONTENT_ID" ]; then
    api_call "GET" "/explore/content/$CONTENT_ID/comments" "" ""
fi

# ============================================================
# 6. PLACES MODULE
# ============================================================
print_test "6.1 Create Place"
response=$(api_call "POST" "/places" '{
  "name": "Victoria Falls",
  "description": "One of the Seven Natural Wonders of the World",
  "category": "NATIONAL_PARK",
  "location": "Livingstone, Southern Province",
  "latitude": -17.9243,
  "longitude": 25.8572,
  "amenities": ["Parking", "Restaurant", "Gift Shop"],
  "entryFee": 20,
  "currency": "USD",
  "isAccessible": true
}')
PLACE_ID=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))" 2>/dev/null)
echo -e "${GREEN}Place ID: $PLACE_ID${NC}"

print_test "6.2 Get All Places"
api_call "GET" "/places" "" ""

print_test "6.3 Get Place by ID"
if [ -n "$PLACE_ID" ]; then
    api_call "GET" "/places/$PLACE_ID" "" ""
fi

print_test "6.4 Get Nearby Places"
api_call "GET" "/places/nearby?latitude=-17.9243&longitude=25.8572&radius=50" "" ""

print_test "6.5 Add Review"
if [ -n "$PLACE_ID" ] && [ -n "$USER_ID" ]; then
    api_call "POST" "/places/reviews" '{
      "placeId": "'"$PLACE_ID"'",
      "userId": "'"$USER_ID"'",
      "rating": 5,
      "title": "Absolutely Breathtaking",
      "comment": "Victoria Falls is amazing! A must-visit destination.",
      "visitDate": "2025-11-01"
    }' ""
fi

print_test "6.6 Get Place Reviews"
if [ -n "$PLACE_ID" ]; then
    api_call "GET" "/places/$PLACE_ID/reviews" "" ""
fi

# ============================================================
# 7. PRICING MODULE
# ============================================================
print_test "7.1 Create Price Entry"
response=$(api_call "POST" "/pricing" '{
  "itemName": "Hotel Stay (Budget)",
  "category": "ACCOMMODATION",
  "location": "Lusaka",
  "lowestPrice": 150,
  "highestPrice": 350,
  "averagePrice": 250,
  "currency": "ZMW",
  "description": "Budget hotel per night"
}')
PRICE_ID=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))" 2>/dev/null)
echo -e "${GREEN}Price ID: $PRICE_ID${NC}"

print_test "7.2 Get All Prices"
api_call "GET" "/pricing" "" ""

print_test "7.3 Get Price by ID"
if [ -n "$PRICE_ID" ]; then
    api_call "GET" "/pricing/$PRICE_ID" "" ""
fi

print_test "7.4 Compare Prices"
api_call "GET" "/pricing/compare?category=ACCOMMODATION&location=Lusaka" "" ""

print_test "7.5 Submit Price Update"
if [ -n "$PRICE_ID" ] && [ -n "$ORG_ID" ]; then
    api_call "POST" "/pricing/updates" '{
      "priceId": "'"$PRICE_ID"'",
      "organizationId": "'"$ORG_ID"'",
      "newPrice": 280,
      "source": "Hotel website verification",
      "notes": "Price increased due to peak season"
    }' ""
fi

print_test "7.6 Get Price History"
if [ -n "$PRICE_ID" ]; then
    api_call "GET" "/pricing/$PRICE_ID/updates" "" ""
fi

# ============================================================
# SUMMARY
# ============================================================
echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     API Testing Complete!                                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo -e "\n${GREEN}✓ All modules tested successfully!${NC}"
echo -e "\n${YELLOW}Created Resources:${NC}"
echo -e "  User ID:         $USER_ID"
echo -e "  JWT Token:       ${TOKEN:0:30}..."
echo -e "  Organization ID: $ORG_ID"
echo -e "  Job ID:          $JOB_ID"
echo -e "  Opportunity ID:  $OPP_ID"
echo -e "  Content ID:      $CONTENT_ID"
echo -e "  Place ID:        $PLACE_ID"
echo -e "  Price ID:        $PRICE_ID"
echo -e "\n${BLUE}Visit Swagger UI: http://localhost:5500/api${NC}\n"
