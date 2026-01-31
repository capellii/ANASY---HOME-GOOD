# ANASY Backend API Reference

## Auth Endpoints

### POST /api/auth/register
- Registers a new user
- Body: { email, password, name }
- Response: User object

### POST /api/auth/login
- Authenticates user
- Body: { email, password }
- Response: { user, accessToken, refreshToken }

### POST /api/auth/refresh
- Refreshes access token
- Body: { refreshToken }
- Response: { accessToken }

---

## Device Endpoints

### GET /api/devices
- Returns all devices
- Response: Array of Device

### POST /api/devices
- Creates a new device
- Body: Device object (without id)
- Response: Device object

---

## Scenario Endpoints

### GET /api/scenarios
- Returns all scenarios
- Response: Array of Scenario

### POST /api/scenarios
- Creates a new scenario
- Body: Scenario object (without id)
- Response: Scenario object

---

## Energy Endpoints

### GET /api/energy/device/:device_id
- Returns energy consumption for a device

### POST /api/energy
- Creates a new energy record

---

## Security Endpoints

### GET /api/security/user/:user_id
- Returns security events by user

### POST /api/security
- Creates a security event

---

## Health Endpoints

### GET /api/health/user/:user_id
- Returns health metrics by user

### POST /api/health
- Creates a health metric

---

## Event Endpoints

### GET /api/events/user/:user_id
- Returns event logs by user

### POST /api/events
- Creates an event log

---

## Status
- All endpoints return JSON
- Auth required for protected endpoints (to be implemented)
