# ANASY - Guia Rápido de Testes

## 🚀 Pré-requisitos
- Docker & Docker Compose instalados
- Node.js 20+ e npm
- Expo CLI (`npm install -g expo-cli`)
- Emulador Android/iOS ou celular com Expo App

---

## 1️⃣ Iniciar Backend (Docker)

### Terminal 1 - Backend
```bash
cd ANASY/backend

# Parar containers antigos (se houver)
docker compose down -v

# Iniciar backend + banco de dados
docker compose up -d

# Verificar logs
docker compose logs backend -f
```

**Esperado:**
```
backend-backend-1  | Server is running on port 3000
backend-db-1       | database system is ready to accept connections
```

### Verificar saúde do backend
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000" | Select-Object StatusCode

# Bash
curl http://localhost:3000
```

**Esperado:** Status `200` e mensagem "ANASY Backend API is running!"

---

## 2️⃣ Iniciar Mobile (Expo)

### Terminal 2 - Mobile
```bash
cd mobile

# Instalar dependências (se primeira vez)
npm install

# Iniciar Expo
npm start
```

**Esperado:** Metro bundler starts e exibe opções de teste.

### Opções de Teste
- **Web Preview**: Pressione `w` no terminal
- **Android Emulador**: Pressione `a` (precisa de Android Studio)
- **iOS Emulador**: Pressione `i` (apenas macOS)
- **Celular físico**: Escaneie QR code com Expo App

---

## 3️⃣ Fluxo de Teste Completo

### ✅ Teste 1: Login
1. Abra o app mobile
2. Veja a tela de login (pré-preenchida com demo)
3. Clique em "Entrar"
4. **Esperado:** Vai para Dashboard (sem erro)

**Credenciais de Teste:**
```
Email: joao@teste.com
Senha: 123456
```

### ✅ Teste 2: Listar Dispositivos
1. Estando no Dashboard
2. Veja a lista de dispositivos (inicialmente vazia ou com devices do banco)
3. Clique em "Atualizar"
4. **Esperado:** Lista se atualiza sem erro

### ✅ Teste 3: Criar Dispositivo
1. No Dashboard, clique em "+ Novo Dispositivo"
2. Preencha:
   - Nome: `Luz Sala`
   - Tipo: `light`
   - Protocolo: `wifi`
3. Clique em "Criar Dispositivo"
4. **Esperado:**
   - Modal fecha
   - Novo device aparece na lista
   - Status inicial: "off"

### ✅ Teste 4: Controlar Dispositivo (Toggle On/Off)
1. No device criado, veja o botão "Ligar"
2. Clique em "Ligar"
3. **Esperado:**
   - Status muda para "on"
   - Botão muda para "Desligar" (vermelho)
4. Clique em "Desligar"
5. **Esperado:**
   - Status volta para "off"
   - Botão volta para "Ligar" (verde)

### ✅ Teste 5: Refresh Token
1. Faça login normalmente
2. Aguarde ~15 minutos (accessToken expira em 15m)
3. Tente qualquer ação (ex: criar device)
4. **Esperado:**
   - App faz refresh automático
   - Ação completa sem fazer logout

**Para testar rapidamente (dev):**
- Modifique expiração do token em [ANASY/backend/src/services/AuthService.ts](ANASY/backend/src/services/AuthService.ts) para `1m`
- Rebuild: `docker compose down && docker compose up -d`

### ✅ Teste 6: Logout
1. No Dashboard, clique em "Sair"
2. **Esperado:**
   - Volta para tela de login
   - AsyncStorage limpa
   - Tokens removidos

---

## 4️⃣ Troubleshooting

### ❌ "Network error: Failed to connect"
**Solução:**
- Verifique se backend está rodando: `docker ps`
- Verifique IP da máquina: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
- Se testar em celular físico, atualize [mobile/services/api.ts](mobile/services/api.ts):
  ```typescript
  baseURL: 'http://SEU_IP:3000/api'  // Ex: 192.168.1.100:3000
  ```

### ❌ "Module not found: @react-native-async-storage/async-storage"
**Solução:**
```bash
cd mobile
npm install @react-native-async-storage/async-storage
npm start
```

### ❌ Metro bundler errors
**Solução:**
```bash
cd mobile
npm start -- --reset-cache
```

### ❌ Docker backend fails to start
**Solução:**
```bash
cd ANASY/backend
docker compose down -v
docker compose up -d --build
docker compose logs backend
```

### ❌ Database connection refused
**Solução:**
```bash
# Aguarde 5-10 segundos e tente novamente
docker compose logs db | tail -20
```

---

## 5️⃣ Testes Manuais via cURL/Postman

### Registrar novo usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao2@teste.com","password":"123456"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@teste.com","password":"123456"}'
```

**Resposta esperada:**
```json
{
  "user": {...},
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Listar dispositivos (com auth)
```bash
curl -X GET http://localhost:3000/api/devices \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

### Criar dispositivo
```bash
curl -X POST http://localhost:3000/api/devices \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Tomada Cozinha","type":"plug","protocol":"wifi","status":{"power":"off"}}'
```

### Atualizar status do device
```bash
curl -X PATCH http://localhost:3000/api/devices/1/status \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":{"power":"on"}}'
```

### Refresh token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"SEU_REFRESH_TOKEN"}'
```

---

## 6️⃣ Verificar Banco de Dados

### Acessar PostgreSQL
```bash
docker exec -it backend-db-1 psql -U postgres -d anasy_db
```

### Comandos úteis no psql
```sql
-- Ver tabelas
\dt

-- Ver users
SELECT * FROM users;

-- Ver devices
SELECT * FROM devices;

-- Ver estrutura de device
\d devices

-- Sair
\q
```

---

## 7️⃣ Performance & Segurança (Checklist)

- [ ] Backend responde em < 200ms
- [ ] Mobile faz login sem erro
- [ ] Refresh token funciona automaticamente
- [ ] Logout limpa tokens de AsyncStorage
- [ ] Device control atualiza status em tempo real
- [ ] Modal de criar device funciona
- [ ] Erro 401 retorna ao login
- [ ] Banco de dados persiste dados

---

## 📊 Status esperado ao final
```
✅ Backend rodando (http://localhost:3000)
✅ Database conectado (postgres://localhost:5432/anasy_db)
✅ Mobile autenticado e com device control ativo
✅ Refresh token automático funcionando
✅ Toggle on/off sincronizando com backend
✅ Novo device persistindo no banco
```

---

## 🔄 Reiniciar tudo do zero
```bash
# Parar tudo
docker compose -C ANASY/backend down -v
cd mobile && npm start --reset-cache

# Ou manual
docker ps -a
docker kill <container_id>
docker volume rm backend_db_data
```

---

## 📚 Documentos relacionados
- [API_REFERENCE.md](ANASY/docs/API_REFERENCE.md) - Endpoints disponíveis
- [DEVELOPMENT_CONTEXT.md](DEVELOPMENT_CONTEXT.md) - Estado do projeto
- [MOBILE_SETUP.md](MOBILE_SETUP.md) - Configuração Expo

---

**Data:** 01 de Fevereiro de 2026  
**Última atualização:** Com refresh token e device control
