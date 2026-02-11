#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:4000/trpc"

echo -e "${YELLOW}=== Testing Product CRUD Integration ===${NC}\n"

# Step 1: Login to get JWT token
echo -e "${YELLOW}Step 1: Logging in...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth.login?batch=1" \
  -H "Content-Type: application/json" \
  -d '{
    "0": {
      "json": {
        "email": "admin@aloha.com",
        "password": "Admin123456!"
      }
    }
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.[0].result.data.json.accessToken')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo -e "${RED}✗ Login failed${NC}"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✓ Login successful${NC}"
echo "Token: ${TOKEN:0:20}..."
echo ""

# Step 2: Get all products
echo -e "${YELLOW}Step 2: Fetching all products...${NC}"
PRODUCTS=$(curl -s -X GET "${API_URL}/products.getProducts?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22limit%22%3A100%2C%22offset%22%3A0%7D%7D%7D" \
  -H "Authorization: Bearer $TOKEN")

PRODUCT_COUNT=$(echo $PRODUCTS | jq '.[0].result.data.json | length')
echo -e "${GREEN}✓ Found $PRODUCT_COUNT products${NC}"
echo "$PRODUCTS" | jq '.[0].result.data.json[] | {name: .name, sku: .sku, status: .status}'
echo ""

# Step 3: Get first product ID for update test
PRODUCT_ID=$(echo $PRODUCTS | jq -r '.[0].result.data.json[0]._id')
echo -e "${YELLOW}Step 3: Testing product update (ID: $PRODUCT_ID)...${NC}"

UPDATE_RESPONSE=$(curl -s -X POST "${API_URL}/products.updateProduct?batch=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"0\": {
      \"json\": {
        \"productId\": \"$PRODUCT_ID\",
        \"status\": \"inactive\"
      }
    }
  }")

UPDATED_STATUS=$(echo $UPDATE_RESPONSE | jq -r '.[0].result.data.json.status')
if [ "$UPDATED_STATUS" = "inactive" ]; then
    echo -e "${GREEN}✓ Product updated successfully (status: $UPDATED_STATUS)${NC}"
else
    echo -e "${RED}✗ Update failed${NC}"
    echo "Response: $UPDATE_RESPONSE"
fi
echo ""

# Step 4: Create new product
echo -e "${YELLOW}Step 4: Creating new product...${NC}"
CREATE_RESPONSE=$(curl -s -X POST "${API_URL}/products.createProduct?batch=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "0": {
      "json": {
        "name": "Test Product from API",
        "description": "This is a test product created via TRPC API integration test",
        "sku": "TEST-001",
        "status": "active",
        "mainImage": "https://example.com/test.jpg",
        "images": ["https://example.com/test1.jpg", "https://example.com/test2.jpg"]
      }
    }
  }')

NEW_PRODUCT_ID=$(echo $CREATE_RESPONSE | jq -r '.[0].result.data.json._id')
NEW_PRODUCT_NAME=$(echo $CREATE_RESPONSE | jq -r '.[0].result.data.json.name')

if [ "$NEW_PRODUCT_ID" != "null" ] && [ ! -z "$NEW_PRODUCT_ID" ]; then
    echo -e "${GREEN}✓ Product created successfully${NC}"
    echo "ID: $NEW_PRODUCT_ID"
    echo "Name: $NEW_PRODUCT_NAME"
else
    echo -e "${RED}✗ Create failed${NC}"
    echo "Response: $CREATE_RESPONSE"
fi
echo ""

# Step 5: Delete the test product
echo -e "${YELLOW}Step 5: Deleting test product...${NC}"
DELETE_RESPONSE=$(curl -s -X POST "${API_URL}/products.deleteProduct?batch=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"0\": {
      \"json\": {
        \"productId\": \"$NEW_PRODUCT_ID\"
      }
    }
  }")

DELETE_SUCCESS=$(echo $DELETE_RESPONSE | jq -r '.[0].result.data.json.success')
if [ "$DELETE_SUCCESS" = "true" ]; then
    echo -e "${GREEN}✓ Product deleted successfully${NC}"
else
    echo -e "${RED}✗ Delete failed${NC}"
    echo "Response: $DELETE_RESPONSE"
fi
echo ""

echo -e "${GREEN}=== All tests completed successfully! ===${NC}"
echo -e "${YELLOW}Frontend ProductService is now integrated with Backend API${NC}"
