# 🧪 ANASY - Mobile App Integration Testing Guide

## Status: ✅ READY FOR TESTING

### Prerequisites
- ✅ Backend running on Docker (localhost:3000)
- ✅ Mobile app running on Expo (localhost:8082)
- ✅ All 5 screens implemented (Devices, Scenarios, Energy, Security, Health)

---

## 🚀 How to Start Testing

### 1. Start Backend
```powershell
cd ANASY/backend
docker-compose up -d
Start-Sleep -Seconds 15
```

**Verify Backend**: http://localhost:3000 should show "ANASY Backend API is running!"

### 2. Start Mobile App
```powershell
cd mobile
npx expo start --clear
```

**Options**:
- Press `w` for web browser testing (easiest)
- Scan QR code with Expo Go app for mobile device testing
- Press `a` for Android emulator (if installed)

---

## 📱 Test Scenarios

### **Test 1: Authentication Flow**
**Goal**: Verify login and logout functionality

1. Open app (should show Login screen automatically)
2. Click "Register" or login with existing account:
   - **Email**: test@anasy.com
   - **Password**: test123
3. ✅ **Expected**: Dashboard appears with 5 tabs at bottom
4. Click "Logout" button (top right)
5. ✅ **Expected**: Returns to Login screen

**API Endpoints Used**:
- `POST /api/auth/login`
- `POST /api/auth/register`

---

### **Test 2: Device Management (Devices Tab)**
**Goal**: List, create, and control IoT devices

1. Navigate to "Devices" tab (house icon 🏠)
2. ✅ **Expected**: See existing devices or empty state
3. Click "+ New Device" button
4. Fill in device details:
   - **Name**: Test Light
   - **Type**: Select "light"
   - **Protocol**: Select "wifi"
5. Click "Create Device"
6. ✅ **Expected**: New device appears in list
7. Toggle device status (Ligar/Desligar button)
8. ✅ **Expected**: Status changes (on/off)

**API Endpoints Used**:
- `GET /api/devices`
- `POST /api/devices`
- `PATCH /api/devices/:id/status`

---

### **Test 3: Automation Scenarios (Scenarios Tab)**
**Goal**: Create and view automation rules

1. Navigate to "Scenarios" tab (lightning icon ⚡)
2. ✅ **Expected**: See scenarios or empty state
3. Click "+ New" button
4. Fill in scenario details:
   - **Name**: Morning Routine
   - **Description**: Turn on lights at 7am
5. Click "Create"
6. ✅ **Expected**: New scenario appears with "Active" badge

**API Endpoints Used**:
- `GET /api/scenarios`
- `POST /api/scenarios`

---

### **Test 4: Energy Monitor (Energy Tab)**
**Goal**: View energy consumption data

1. Navigate to "Energy" tab (battery icon 🔋)
2. ✅ **Expected**: See summary card with total consumption
3. ✅ **Expected**: See list of energy records by device
4. Note: If no data, it shows "No energy data available yet"

**API Endpoints Used**:
- `GET /api/devices` (to fetch all devices)
- `GET /api/energy/device/:device_id` (for each device)

---

### **Test 5: Security Events (Security Tab)**
**Goal**: View security alerts and events

1. Navigate to "Security" tab (lock icon 🔒)
2. ✅ **Expected**: See statistics (Total Events, High Priority count)
3. ✅ **Expected**: See list of security events with severity badges
4. Note color codes:
   - 🔴 **Critical** - Red
   - 🟠 **High** - Orange
   - 🟡 **Medium** - Yellow
   - 🟢 **Low** - Green

**API Endpoints Used**:
- `GET /api/security/user/:user_id`

---

### **Test 6: Health Metrics (Health Tab)**
**Goal**: View health monitoring data

1. Navigate to "Health" tab (heart icon ❤️)
2. ✅ **Expected**: See summary card with average value
3. ✅ **Expected**: See list of health metrics with icons
4. Metric types:
   - ❤️ heart_rate
   - 🌡️ temperature
   - 👟 steps
   - 😴 sleep

**API Endpoints Used**:
- `GET /api/health/user/:user_id`

---

### **Test 7: Token Refresh (Automatic)**
**Goal**: Verify refresh token interceptor works

1. Log in to the app
2. Wait 15 minutes (access token expires)
3. Perform any action (navigate between tabs)
4. ✅ **Expected**: App continues working seamlessly (no logout)

**How it works**:
- When API returns 401, interceptor automatically refreshes token
- Original request is retried with new token
- User sees no interruption

**API Endpoint Used**:
- `POST /api/auth/refresh`

---

## 🧪 API Testing from Browser (Alternative)

If you prefer testing APIs directly:

### Open Browser DevTools Console

```javascript
// Set base URL
const api = 'http://localhost:3000/api';

// Login
const loginResponse = await fetch(`${api}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@anasy.com', password: 'test123' })
});
const { accessToken } = await loginResponse.json();

// Get devices
const devicesResponse = await fetch(`${api}/devices`, {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
const devices = await devicesResponse.json();
console.log('Devices:', devices);

// Get scenarios
const scenariosResponse = await fetch(`${api}/scenarios`, {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
const scenarios = await scenariosResponse.json();
console.log('Scenarios:', scenarios);
```

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to backend"
**Solution**: 
- Verify Docker containers are running: `docker ps`
- Check backend health: http://localhost:3000
- For mobile device testing, change API URL in `mobile/services/api.ts`:
  ```typescript
  baseURL: 'http://192.168.3.5:3000/api'  // Use your local IP
  ```

### Problem: "Network request failed"
**Solution**:
- Ensure CORS is enabled (already configured)
- Check if phone/computer are on same WiFi network
- Verify no firewall blocking port 3000

### Problem: TypeScript errors in mobile app
**Solution**:
```powershell
cd mobile
npx tsc --noEmit
```

### Problem: Expo cache issues
**Solution**:
```powershell
cd mobile
npx expo start --clear
```

### Problem: Empty data in Energy/Health/Security tabs
**Solution**:
- These tabs show user-specific data
- Run backend test script to populate data:
  ```powershell
  cd ANASY/backend
  .\test-all-endpoints.ps1
  ```

---

## ✅ Expected Test Results

After completing all tests, you should have:

- ✅ Successfully logged in and out
- ✅ Created at least 1 device
- ✅ Toggled device status (on/off)
- ✅ Created at least 1 scenario
- ✅ Viewed energy consumption data
- ✅ Viewed security events
- ✅ Viewed health metrics
- ✅ Navigation working smoothly between all 5 tabs

---

## 📊 Coverage Summary

| Feature | Implementation | Integration | UI | Total |
|---------|----------------|-------------|-----|-------|
| **Authentication** | ✅ | ✅ | ✅ | 100% |
| **Devices** | ✅ | ✅ | ✅ | 100% |
| **Scenarios** | ✅ | ✅ | ✅ | 100% |
| **Energy** | ✅ | ✅ | ✅ | 100% |
| **Security** | ✅ | ✅ | ✅ | 100% |
| **Health** | ✅ | ✅ | ✅ | 100% |
| **Token Refresh** | ✅ | ✅ | ✅ | 100% |

---

## 🎯 Next Steps After Testing

1. **Bug Fixes**: Report any issues found during testing
2. **UI Polish**: Improve styling based on user feedback
3. **Performance**: Optimize API calls and caching
4. **Features**: Add edit/delete functionality for devices and scenarios
5. **Charts**: Add visualizations for energy and health data

---

## 📝 Test Checklist

Use this checklist while testing:

- [ ] Login works
- [ ] Register works
- [ ] Logout works
- [ ] Devices tab loads
- [ ] Can create new device
- [ ] Can toggle device status
- [ ] Scenarios tab loads
- [ ] Can create new scenario
- [ ] Energy tab loads and shows data
- [ ] Security tab loads and shows data
- [ ] Health tab loads and shows data
- [ ] Navigation between tabs is smooth
- [ ] No console errors in Expo DevTools
- [ ] App doesn't crash when changing tabs quickly
- [ ] Token refresh works automatically (wait 15min)

---

**Testing Started**: ___ (fill in)  
**Testing Completed**: ___ (fill in)  
**Bugs Found**: ___ (fill in)  
**Status**: ___ (fill in: Pass/Fail)

---

**Good luck with testing! 🚀**
