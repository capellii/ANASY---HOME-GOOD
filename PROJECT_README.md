# ANASY Smart Home Platform

Plataforma inteligente para automação residencial com IA, integração de dispositivos e análise de energia.

## 🎯 Status do Projeto

### ✅ Backend - PRONTO EM PRODUÇÃO
- API REST funcional em Node.js + Express + TypeScript
- PostgreSQL 15 com schema completo
- Autenticação JWT com refresh tokens
- Hash bcryptjs para senhas
- Docker Compose setup
- Testes manuais aprovados

### 📱 Mobile - EM DESENVOLVIMENTO
- React Native + Expo
- Login/Logout + sessão persistida (AuthContext + AsyncStorage)
- Precisa de: refresh token automático e controle de dispositivos

## 🚀 Quick Start

### Inicializar Backend

```bash
cd ANASY/backend
docker compose up -d
```

Backend disponível em: `http://localhost:3000`

### Dados de Acesso (Desenvolvimento)

```
Email: joao@teste.com
Senha: 123456
```

### Testar API

```powershell
# PowerShell
.\ANASY\backend\test-api.ps1

# Bash
./ANASY/backend/test-api.sh
```

## 📋 Funcionalidades Implementadas

### Auth (✅ Completo)
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login com JWT
- `POST /api/auth/refresh` - Renovar token

### Devices (✅ Completo)
- `GET /api/devices` - Listar dispositivos
- `POST /api/devices` - Criar dispositivo

### Scenarios (✅ Completo)
- `GET /api/scenarios` - Listar cenários
- `POST /api/scenarios` - Criar cenário

### Energia (✅ Pronto)
- `GET /api/energy/device/:device_id` - Consumo por dispositivo
- `POST /api/energy` - Registrar consumo

### Segurança (✅ Pronto)
- `GET /api/security/user/:user_id` - Eventos de segurança
- `POST /api/security` - Criar evento

### Saúde (✅ Pronto)
- `GET /api/health/user/:user_id` - Métricas de saúde
- `POST /api/health` - Registrar métrica

### Eventos (✅ Pronto)
- `GET /api/events/user/:user_id` - Histórico de eventos
- `POST /api/events` - Criar evento

## 🛠 Stack Técnico

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express 4.18
- **Language**: TypeScript 5.2
- **Database**: PostgreSQL 15
- **Auth**: JWT (jsonwebtoken)
- **Security**: bcryptjs para hash
- **Testing**: Jest
- **Containerization**: Docker + Docker Compose

### Mobile
- **Framework**: React Native 0.73
- **Build**: Expo 50
- **State**: AuthContext + AsyncStorage (pronto)
- **HTTP**: Axios
- **Navigation**: React Navigation (Stack)

## 📊 Arquitetura

```
Backend (Clean Architecture)
├── controllers/    - Camada de requisição
├── services/       - Lógica de negócio
├── repositories/   - Acesso a dados
├── models/         - Tipos TypeScript
├── routes/         - Definição de rotas
├── middleware/     - Auth, validação
└── db/             - Conexão PostgreSQL

Mobile (Component-based)
├── screens/        - Páginas
├── services/       - API client
├── context/        - State global
└── components/     - UI reutilizável
```

## 🔐 Segurança

- ✅ Senhas hashadas com bcryptjs (salt: 10)
- ✅ JWT com expiração (15m accessToken, 7d refreshToken)
- ✅ Validação de role-based access control
- ⚠️ CORS ainda não configurado
- ⚠️ Rate limiting não implementado

## 📦 Dependências Principais

### Backend
```json
{
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "pg": "^8.11.1",
  "dotenv": "^17.2.3"
}
```

### Mobile
```json
{
  "react-native": "0.73.7",
  "expo": "~50.0.0",
  "@react-navigation/native": "^6.1.18",
  "axios": "^1.13.4"
}
```

## 🧪 Testes

### Backend Endpoints

```bash
# Health Check
GET http://localhost:3000

# Register
POST http://localhost:3000/api/auth/register
{
  "name": "João",
  "email": "joao@teste.com",
  "password": "123456"
}

# Login
POST http://localhost:3000/api/auth/login
{
  "email": "joao@teste.com",
  "password": "123456"
}
```

## 🐛 Problemas Conhecidos

1. **Mobile**: Refresh token automático ainda não implementado
2. **Mobile**: Controle de dispositivos pendente
3. **Backend**: CORS não configurado (localhost apenas)
4. **Backend**: Validação de payload faltando

## 📅 Roadmap

### MVP 1 (Agora)
- [x] Backend API funcional
- [x] Autenticação JWT
- [x] Mobile Login básico
- [ ] Mobile AuthContext
- [ ] Mobile AsyncStorage

### MVP 2 (Próximo)
- [ ] Dashboard com dispositivos reais
- [ ] Controle de dispositivos
- [ ] Histórico de eventos
- [ ] Notificações push

### MVP 3 (Futuro)
- [ ] IA para automação preditiva
- [ ] Análise de energia
- [ ] Interface 3D
- [ ] Integração com plataformas (Google Home, Alexa)

## 📚 Documentação

- [API Reference](./ANASY/docs/API_REFERENCE.md)
- [Arquitetura Técnica](./ARQUITETURA_TECNICA.md)
- [Roadmap Técnico](./ROADMAP_TECNICO.md)
- [Personas e Usuários](./PERSONAS_USUARIOS.md)

## 🤝 Contribuindo

Ver [CONTRIBUTING.md](./docs/CONTRIBUTING.md)

## 📝 Licença

MIT - Equipe ANASY

---

**Última atualização**: 31 de Janeiro de 2026
