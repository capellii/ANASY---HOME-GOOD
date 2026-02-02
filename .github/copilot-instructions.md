## ANASY AI agent quick guide

### Big picture architecture
- Monorepo with two apps: backend API in [ANASY/backend](ANASY/backend) and Expo mobile app in [mobile](mobile).
- Backend flow: routes → controllers → services → repositories → Postgres pool. See [ANASY/backend/src/app.ts](ANASY/backend/src/app.ts), [ANASY/backend/src/routes](ANASY/backend/src/routes), [ANASY/backend/src/controllers](ANASY/backend/src/controllers), [ANASY/backend/src/services](ANASY/backend/src/services), and [ANASY/backend/src/repositories](ANASY/backend/src/repositories).
- Database is Postgres with schema defined in [ANASY/backend/db/init.sql](ANASY/backend/db/init.sql); connections via [ANASY/backend/src/db/pgPool.ts](ANASY/backend/src/db/pgPool.ts).

### Auth & data flow
- Auth tokens are issued in `AuthService` with access + refresh tokens. See [ANASY/backend/src/services/AuthService.ts](ANASY/backend/src/services/AuthService.ts).
- JWT verification/roles are in `authenticateJWT` and `authorizeRoles`. See [ANASY/backend/src/middleware/auth.ts](ANASY/backend/src/middleware/auth.ts).
- Mobile stores tokens in AsyncStorage and sets `Authorization` header on the shared axios instance. See [mobile/context/AuthContext.tsx](mobile/context/AuthContext.tsx) and [mobile/services/api.ts](mobile/services/api.ts).

### Mobile app patterns
- Root navigation chooses Login vs Dashboard based on `state.isSignIn`. See [mobile/App.tsx](mobile/App.tsx).
- API base URL is hardcoded for local backend; update when testing on device. See [mobile/services/api.ts](mobile/services/api.ts).

### Local workflows
- Backend scripts (run from [ANASY/backend/package.json](ANASY/backend/package.json)): `dev`, `build`, `start`, `test`, `initdb`, `initdb:local`.
- Docker Compose spins up Postgres + backend with env vars and runs initdb on container start. See [ANASY/backend/docker-compose.yml](ANASY/backend/docker-compose.yml).
- Mobile runs via Expo script `start` in [mobile/package.json](mobile/package.json).

### Conventions to follow
- Controllers bind methods in constructors (e.g., `DeviceController`). See [ANASY/backend/src/controllers/DeviceController.ts](ANASY/backend/src/controllers/DeviceController.ts).
- Repositories use raw SQL via `pool.query` and return `result.rows[0]` for single records. See [ANASY/backend/src/repositories/UserRepository.ts](ANASY/backend/src/repositories/UserRepository.ts).
- Error handling is lightweight and returns JSON with `error` or `message` fields; keep responses consistent with existing controllers.
