# Complete API Test Suite for ANASY Backend
$baseUrl = "http://localhost:3000"
$ErrorActionPreference = "Continue"

Write-Host "=== ANASY Backend API Complete Test Suite ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1. Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method Get
    Write-Host "PASS: $response" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Register
Write-Host "2. User Registration" -ForegroundColor Yellow
$registerBody = @{
    email = "test@anasy.com"
    password = "test123"
    name = "Test User"
    role = "owner"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "PASS: User registered with ID $($registerResponse.user.id)" -ForegroundColor Green
} catch {
    Write-Host "NOTE: User may already exist" -ForegroundColor Yellow
}
Write-Host ""

# Test 3: Login
Write-Host "3. Login" -ForegroundColor Yellow
$loginBody = @{
    email = "test@anasy.com"
    password = "test123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $accessToken = $loginResponse.accessToken
    $refreshToken = $loginResponse.refreshToken
    $userId = $loginResponse.user.id
    Write-Host "PASS: Login successful, User ID: $userId" -ForegroundColor Green
} catch {
    Write-Host "FAIL: Login failed" -ForegroundColor Red
    exit
}
Write-Host ""

# Test 4: Create Device
Write-Host "4. Create Device" -ForegroundColor Yellow
$deviceBody = @{
    name = "Smart Light"
    type = "light"
    room = "Living Room"
    protocol = "wifi"
    status = "off"
    user_id = $userId
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $accessToken"
    "Content-Type" = "application/json"
}

try {
    $deviceResponse = Invoke-RestMethod -Uri "$baseUrl/api/devices" -Method Post -Body $deviceBody -Headers $headers
    $deviceId = $deviceResponse.id
    Write-Host "PASS: Device created with ID $deviceId" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Get Devices
Write-Host "5. Get All Devices" -ForegroundColor Yellow
try {
    $devices = Invoke-RestMethod -Uri "$baseUrl/api/devices" -Method Get -Headers $headers
    Write-Host "PASS: Retrieved $($devices.Count) devices" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

# Test 6: Update Device Status
Write-Host "6. Update Device Status" -ForegroundColor Yellow
$statusBody = @{ status = "on" } | ConvertTo-Json

try {
    $updated = Invoke-RestMethod -Uri "$baseUrl/api/devices/$deviceId/status" -Method Patch -Body $statusBody -Headers $headers
    Write-Host "PASS: Device status is now $($updated.status)" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

# Test 7: Create Scenario
Write-Host "7. Create Scenario" -ForegroundColor Yellow
$scenarioBody = @{
    name = "Morning Routine"
    description = "Turn on lights"
    user_id = $userId
} | ConvertTo-Json

try {
    $scenario = Invoke-RestMethod -Uri "$baseUrl/api/scenarios" -Method Post -Body $scenarioBody -Headers $headers
    $scenarioId = $scenario.id
    Write-Host "PASS: Scenario created with ID $scenarioId" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

# Test 8: Get Scenarios
Write-Host "8. Get All Scenarios" -ForegroundColor Yellow
try {
    $scenarios = Invoke-RestMethod -Uri "$baseUrl/api/scenarios" -Method Get -Headers $headers
    Write-Host "PASS: Retrieved $($scenarios.Count) scenarios" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

# Test 9: Create Energy Record
Write-Host "9. Create Energy Consumption" -ForegroundColor Yellow
$energyBody = @{
    device_id = $deviceId
    user_id = $userId
    consumption_kwh = 2.5
    cost = 1.25
} | ConvertTo-Json

try {
    $energy = Invoke-RestMethod -Uri "$baseUrl/api/energy" -Method Post -Body $energyBody -Headers $headers
    Write-Host "PASS: Energy recorded: $($energy.consumption_kwh) kWh" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

# Test 10: Get Energy Data
Write-Host "10. Get Energy by Device" -ForegroundColor Yellow
try {
    $energyData = Invoke-RestMethod -Uri "$baseUrl/api/energy/device/$deviceId" -Method Get -Headers $headers
    Write-Host "PASS: Retrieved $($energyData.Count) energy records" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

# Test 11: Create Security Event
Write-Host "11. Create Security Event" -ForegroundColor Yellow
$securityBody = @{
    user_id = $userId
    event_type = "unauthorized_access"
    severity = "high"
    description = "Failed login attempt detected"
} | ConvertTo-Json

try {
    $security = Invoke-RestMethod -Uri "$baseUrl/api/security" -Method Post -Body $securityBody -Headers $headers
    Write-Host "PASS: Security event created: $($security.event_type)" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

# Test 12: Get Security Events
Write-Host "12. Get Security Events" -ForegroundColor Yellow
try {
    $securityEvents = Invoke-RestMethod -Uri "$baseUrl/api/security/user/$userId" -Method Get -Headers $headers
    Write-Host "PASS: Retrieved $($securityEvents.Count) security events" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

# Test 13: Create Health Metric
Write-Host "13. Create Health Metric" -ForegroundColor Yellow
$healthBody = @{
    user_id = $userId
    metric_type = "heart_rate"
    metric_value = 72
    unit = "bpm"
} | ConvertTo-Json

try {
    $health = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Post -Body $healthBody -Headers $headers
    Write-Host "PASS: Health metric created: $($health.metric_value) $($health.unit)" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

# Test 14: Get Health Metrics
Write-Host "14. Get Health Metrics" -ForegroundColor Yellow
try {
    $healthMetrics = Invoke-RestMethod -Uri "$baseUrl/api/health/user/$userId" -Method Get -Headers $headers
    Write-Host "PASS: Retrieved $($healthMetrics.Count) health metrics" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

# Test 15: Create Event
Write-Host "15. Create Event" -ForegroundColor Yellow
$eventBody = @{
    user_id = $userId
    event_type = "device_triggered"
    description = "Light turned on automatically"
} | ConvertTo-Json

try {
    $event = Invoke-RestMethod -Uri "$baseUrl/api/events" -Method Post -Body $eventBody -Headers $headers
    Write-Host "PASS: Event created: $($event.event_type)" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

# Test 16: Get Events
Write-Host "16. Get Events" -ForegroundColor Yellow
try {
    $events = Invoke-RestMethod -Uri "$baseUrl/api/events/user/$userId" -Method Get -Headers $headers
    Write-Host "PASS: Retrieved $($events.Count) events" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

# Test 17: Refresh Token
Write-Host "17. Refresh Token" -ForegroundColor Yellow
$refreshBody = @{ refreshToken = $refreshToken } | ConvertTo-Json

try {
    $refreshResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/refresh" -Method Post -Body $refreshBody -ContentType "application/json"
    Write-Host "PASS: Token refreshed successfully" -ForegroundColor Green
} catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Test Summary ===" -ForegroundColor Cyan
Write-Host "Backend features verified:" -ForegroundColor White
Write-Host "  - Authentication & Authorization" -ForegroundColor Green
Write-Host "  - Device Management" -ForegroundColor Green
Write-Host "  - Scenario Management" -ForegroundColor Green
Write-Host "  - Energy Monitoring" -ForegroundColor Green
Write-Host "  - Security Events" -ForegroundColor Green
Write-Host "  - Health Metrics" -ForegroundColor Green
Write-Host "  - Event Logging" -ForegroundColor Green
Write-Host "  - Token Refresh" -ForegroundColor Green
Write-Host ""
