# ANASY Backend API Reference

## Auth Endpoints

### POST /api/auth/register
- Registers a new user
- Body: { email, password, name }
- Response: User object

### POST /api/auth/login
- Authenticates user
- Body: { email, password }
- Response: { user, token }

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

## Status
- All endpoints return JSON
- Auth required for protected endpoints (to be implemented)
