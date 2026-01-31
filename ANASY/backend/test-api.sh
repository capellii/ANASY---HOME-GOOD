#!/bin/bash

# Script para testar a API ANASY Backend
echo "=================================="
echo "ANASY Backend - API Test Suite"
echo "=================================="
echo ""

BASE_URL="http://localhost:3000/api"
DELAY=1

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para fazer requisições
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local description=$4

  echo -e "${YELLOW}Testing: $description${NC}"
  echo "  Method: $method"
  echo "  Endpoint: $endpoint"
  
  if [ -z "$data" ]; then
    response=$(curl -s -X $method "$BASE_URL$endpoint")
  else
    echo "  Data: $data"
    response=$(curl -s -X $method "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$data")
  fi
  
  echo "  Response: $response"
  echo ""
  sleep $DELAY
}

# Teste 1: Health Check
echo -e "${GREEN}=== TEST 1: Health Check ===${NC}"
test_endpoint "GET" "" "" "Server Health Check"

# Teste 2: Register a new user
echo -e "${GREEN}=== TEST 2: User Registration ===${NC}"
test_endpoint "POST" "/auth/register" \
  '{"name":"João Teste","email":"joao@teste.com","password":"123456"}' \
  "Register New User"

# Teste 3: Login
echo -e "${GREEN}=== TEST 3: User Login ===${NC}"
test_endpoint "POST" "/auth/login" \
  '{"email":"joao@teste.com","password":"123456"}' \
  "User Login"

# Teste 4: Get Devices
echo -e "${GREEN}=== TEST 4: Get Devices ===${NC}"
test_endpoint "GET" "/devices" "" "Get All Devices"

# Teste 5: Create a Device
echo -e "${GREEN}=== TEST 5: Create Device ===${NC}"
test_endpoint "POST" "/devices" \
  '{"name":"Lâmpada Sala","type":"light","protocol":"zigbee","status":{"power":"on"}}' \
  "Create New Device"

# Teste 6: Get Scenarios
echo -e "${GREEN}=== TEST 6: Get Scenarios ===${NC}"
test_endpoint "GET" "/scenarios" "" "Get All Scenarios"

# Teste 7: Create a Scenario
echo -e "${GREEN}=== TEST 7: Create Scenario ===${NC}"
test_endpoint "POST" "/scenarios" \
  '{"name":"Modo Noite","description":"Desliga todos os dispositivos","trigger":{"type":"time","value":"22:00"},"actions":[{"deviceId":"1","command":"off"}],"enabled":true}' \
  "Create New Scenario"

echo ""
echo "=================================="
echo "Tests Completed!"
echo "=================================="
