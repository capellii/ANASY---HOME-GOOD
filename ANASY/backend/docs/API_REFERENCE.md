# ANASY API Reference

## Auth Endpoints

### POST /api/auth/register
- Cria um novo usuário.
- Body: `{ "email": string, "password": string, "name": string }`
- Response: `201 Created` com dados do usuário.

### POST /api/auth/login
- Autentica usuário e retorna tokens.
- Body: `{ "email": string, "password": string }`
- Response: `{ user, accessToken, refreshToken }`

### POST /api/auth/refresh
- Gera novo accessToken a partir do refreshToken.
- Body: `{ "refreshToken": string }`
- Response: `{ accessToken }`

## Proteção de Rotas
- Use o header: `Authorization: Bearer <accessToken>`
- Roles: `admin`, `owner`, `member`, `guest`

## Energy
- `GET /api/energy/device/:device_id` (admin, owner, member)
- `POST /api/energy/` (admin, owner)

## Security
- `GET /api/security/user/:user_id` (admin, owner)
- `POST /api/security/` (admin, owner)

## Health
- `GET /api/health/user/:user_id` (admin, owner, member)
- `POST /api/health/` (admin, owner, member)

## Events
- `GET /api/events/user/:user_id` (admin, owner)
- `POST /api/events/` (admin, owner)

---

Consulte a documentação completa para exemplos de payloads e respostas.
