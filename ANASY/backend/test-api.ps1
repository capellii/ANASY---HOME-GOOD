# Script para testar a API ANASY Backend
Write-Host "==================================" -ForegroundColor Green
Write-Host "ANASY Backend - API Test Suite" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""

$BASE_URL = "http://localhost:3000/api"

# Função para fazer requisições
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Data,
        [string]$Description
    )
    
    Write-Host "Testing: $Description" -ForegroundColor Yellow
    Write-Host "  Method: $Method"
    Write-Host "  Endpoint: $Endpoint"
    
    try {
        if ($null -eq $Data) {
            $response = Invoke-WebRequest -Uri "$BASE_URL$Endpoint" -Method $Method
        } else {
            $body = $Data | ConvertTo-Json
            Write-Host "  Data: $body"
            $response = Invoke-WebRequest -Uri "$BASE_URL$Endpoint" -Method $Method -Body $body -ContentType "application/json"
        }
        
        $content = $response.Content | ConvertFrom-Json
        Write-Host "  Status: ✅ Success ($($response.StatusCode))" -ForegroundColor Green
        Write-Host "  Response: $($response.Content)" -ForegroundColor Cyan
    } catch {
        Write-Host "  Status: ❌ Error" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Start-Sleep -Milliseconds 500
}

# Teste 1: Health Check
Write-Host "=== TEST 1: Health Check ===" -ForegroundColor Green
Test-Endpoint -Method "GET" -Endpoint "" -Data $null -Description "Server Health Check"

# Teste 2: Register a new user
Write-Host "=== TEST 2: User Registration ===" -ForegroundColor Green
$registerData = @{
    name = "João Teste"
    email = "joao@teste.com"
    password = "123456"
}
Test-Endpoint -Method "POST" -Endpoint "/auth/register" -Data $registerData -Description "Register New User"

# Teste 3: Login
Write-Host "=== TEST 3: User Login ===" -ForegroundColor Green
$loginData = @{
    email = "joao@teste.com"
    password = "123456"
}
Test-Endpoint -Method "POST" -Endpoint "/auth/login" -Data $loginData -Description "User Login"

# Teste 4: Get Devices
Write-Host "=== TEST 4: Get Devices ===" -ForegroundColor Green
Test-Endpoint -Method "GET" -Endpoint "/devices" -Data $null -Description "Get All Devices"

# Teste 5: Create a Device
Write-Host "=== TEST 5: Create Device ===" -ForegroundColor Green
$deviceData = @{
    name = "Lâmpada Sala"
    type = "light"
    protocol = "zigbee"
    status = @{ power = "on" }
}
Test-Endpoint -Method "POST" -Endpoint "/devices" -Data $deviceData -Description "Create New Device"

# Teste 6: Get Scenarios
Write-Host "=== TEST 6: Get Scenarios ===" -ForegroundColor Green
Test-Endpoint -Method "GET" -Endpoint "/scenarios" -Data $null -Description "Get All Scenarios"

# Teste 7: Create a Scenario
Write-Host "=== TEST 7: Create Scenario ===" -ForegroundColor Green
$scenarioData = @{
    name = "Modo Noite"
    description = "Desliga todos os dispositivos"
    trigger = @{ type = "time"; value = "22:00" }
    actions = @(@{ deviceId = "1"; command = "off" })
    enabled = $true
}
Test-Endpoint -Method "POST" -Endpoint "/scenarios" -Data $scenarioData -Description "Create New Scenario"

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "Tests Completed!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
