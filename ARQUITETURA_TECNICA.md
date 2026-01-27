================================================================================
                      ANASY - ARQUITETURA TÉCNICA
                       Design & Stack Technology
================================================================================

## 1. VISÃO GERAL DA ARQUITETURA

```
                        ┌─────────────────────────┐
                        │   USUÁRIO (Smartphone)  │
                        │   App React Native      │
                        └────────────┬────────────┘
                                     │ HTTPS/WSS
                                     ▼
                ┌────────────────────────────────────────┐
                │      API GATEWAY / LOAD BALANCER      │
                │  (Nginx / AWS ALB)                    │
                │  - Rate limiting                      │
                │  - CORS                               │
                │  - Caching (Redis)                    │
                └────────────────┬─────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │  API Backend    │  │  Real-time      │  │  WebSocket      │
    │  Node.js/Python │  │  Processing     │  │  Server         │
    │  - Auth         │  │  (Message Queue)│  │  - Push notif   │
    │  - CRUD ops     │  │  RabbitMQ/Kafka │  │  - Live status  │
    │  - Scenarios    │  │                 │  │                 │
    └────────┬────────┘  └─────────────────┘  └────────┬────────┘
             │                                         │
             └──────────────────┬──────────────────────┘
                                │
                   ┌────────────┴───────────┐
                   ▼                       ▼
          ┌─────────────────────┐  ┌─────────────────┐
          │  PostgreSQL         │  │  MongoDB        │
          │  (Structured Data)  │  │  (Logs, Events) │
          │  - Users            │  │  - Telemetry    │
          │  - Devices          │  │  - Analytics    │
          │  - Scenarios        │  │  - Time-series  │
          │  - Subscriptions    │  │                 │
          └─────────────────────┘  └─────────────────┘
                   ▲                       ▲
                   │ Local Sync (WiFi)     │
                   │                       │
          ┌────────┴───────────────────────────────────┐
          │                                            │
          ▼                                            ▼
    ┌───────────────────────┐                ┌────────────────────┐
    │  HUB LOCAL (Casa)     │                │  IA Engine         │
    │  Raspberry Pi / NUC   │                │  (Python/TensorFlow)│
    │  - Zigbee2MQTT       │                │  - Behavioral Learn│
    │  - Z-Wave.js         │                │  - Anomaly Detect  │
    │  - Bluetooth (BLE)   │                │  - Recommendations │
    │  - MQTT Broker       │                │  - Energy Analysis │
    │  - HTTP Server       │                │  - Security AI      │
    │  - Local database    │                └────────────────────┘
    │  (offline fallback)  │                        ▲
    └────────┬────────────┘                        │
             │                              (Async Jobs)
             │
    ┌────────┴──────────────────────────────┐
    ▼                                       ▼
Smart Devices (100+)              Integrations
├─ Lights (Philips Hue)           ├─ Google Home API
├─ Plugs (TP-Link, Sonoff)        ├─ Apple HomeKit
├─ AC (Tuya)                      ├─ Alexa (AWS)
├─ Cameras (Wyze, IMOU)           ├─ Matter Protocol
├─ Sensors (motion, temp)         ├─ Stripe (payments)
├─ Door locks                     ├─ Twilio (SMS)
├─ Thermostats                    └─ Sentry (monitoring)
└─ Water sensors
```

---

## 2. COMPONENTES PRINCIPAIS

### 2.1 APLICATIVO (Frontend)

#### MOBILE (React Native / Expo)
```
Screens:
├─ Autenticação
│  ├─ Login
│  ├─ Signup
│  └─ Reset Password
├─ Dashboard
│  ├─ Vista de dispositivos
│  ├─ Controle rápido (on/off)
│  └─ Cenários disponíveis
├─ Detalhes do Dispositivo
│  ├─ Status em tempo real
│  ├─ Histórico de ações
│  └─ Configurações
├─ Criar Cenário
│  ├─ Trigger (tempo, sensor, presença)
│  ├─ Ações (sequência de comandos)
│  └─ Condições (if/then/else)
├─ Interface 3D (MVP3)
│  ├─ Planta baixa renderizada
│  ├─ Dispositivos posicionados em 3D
│  ├─ Controle tátil
│  └─ Modo imersivo
├─ Análise de Energia
│  ├─ Consumo por hora
│  ├─ Consumo por dispositivo
│  └─ Comparação vs mês anterior
├─ Segurança
│  ├─ Alertas de anomalia
│  ├─ Histórico de eventos
│  └─ Câmeras em tempo real
├─ Saúde (Health - MVP3)
│  ├─ Dados do smartwatch
│  ├─ Histórico cardíaco
│  └─ Alertas de emergência
├─ Configurações
│  ├─ Perfil do usuário
│  ├─ Dispositivos (adicionar/remover)
│  ├─ Casa (adicionar cômodos)
│  └─ Integrações
└─ Suporte
   ├─ Chat com bot/agente
   ├─ FAQ
   └─ Tickets

State Management: Redux / Zustand
Networking: Axios / React Query
Real-time: Socket.io (WebSocket)
Maps: Three.js / Babylon.js (3D)
Maps: Google Maps (GPS)
```

#### WEB (React / Next.js)
```
Mesmas telas do mobile, mas:
├─ Versão desktop otimizada
├─ Dashboards analíticos avançados
├─ Relatórios em PDF
├─ Integração com calendários
└─ Suporte para múltiplas casas (no mesmo login)
```

### 2.2 BACKEND (API REST + WebSocket)

#### Stack: Node.js + Express + TypeScript

```
Arquitetura: Clean Architecture + SOLID

src/
├─ controllers/
│  ├─ AuthController
│  ├─ DeviceController
│  ├─ ScenarioController
│  ├─ EnergyController
│  ├─ SecurityController
│  └─ HealthController
├─ services/
│  ├─ AuthService
│  ├─ HubService (comunicação com Hub local)
│  ├─ AnalyticsService
│  ├─ NotificationService
│  ├─ PaymentService (Stripe)
│  └─ AIService (Python call)
├─ repositories/
│  ├─ UserRepository
│  ├─ DeviceRepository
│  ├─ ScenarioRepository
│  └─ EventRepository
├─ middleware/
│  ├─ auth.ts (JWT)
│  ├─ errorHandler.ts
│  ├─ rateLimiter.ts
│  └─ requestLogger.ts
├─ jobs/ (Async)
│  ├─ SyncWithHubJob
│  ├─ AnalyticsJob
│  ├─ NotificationJob
│  └─ HealthCheckJob
├─ websocket/
│  ├─ DeviceStatusHandler
│  ├─ NotificationHandler
│  └─ ChatHandler
├─ utils/
│  ├─ validators.ts
│  ├─ encryption.ts
│  └─ logger.ts
└─ config/
   ├─ database.ts
   ├─ redis.ts
   └─ env.ts

Routes:
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh

GET    /api/v1/devices
POST   /api/v1/devices
PATCH  /api/v1/devices/:id
DELETE /api/v1/devices/:id
POST   /api/v1/devices/:id/command

GET    /api/v1/scenarios
POST   /api/v1/scenarios
PATCH  /api/v1/scenarios/:id
DELETE /api/v1/scenarios/:id

GET    /api/v1/energy/usage
GET    /api/v1/energy/anomalies
GET    /api/v1/energy/recommendations

GET    /api/v1/security/events
POST   /api/v1/security/alerts

GET    /api/v1/health/metrics (smartwatch data)
POST   /api/v1/health/emergency

GET    /api/v1/user/profile
PATCH  /api/v1/user/profile
POST   /api/v1/user/subscription
```

### 2.3 HUB LOCAL (Casa do Usuário)

#### Hardware: Raspberry Pi 4 (8GB RAM) + Zigbee/Z-Wave stick

```
Software Stack: Node.js + MQTT Broker (Mosquitto)

├─ Zigbee Bridge (zigbee2mqtt)
│  ├─ Descoberta automática de dispositivos
│  ├─ Tradução para MQTT
│  └─ Relatório de bateria/sinal
│
├─ Z-Wave Bridge (zwavejs)
│  ├─ Suporte para 100+ marcas
│  ├─ Tradução para MQTT
│  └─ Automação local
│
├─ Bluetooth Handler
│  ├─ BLE scanning
│  ├─ Connection management
│  └─ MQTT publishing
│
├─ Local API Server
│  ├─ REST endpoints (local)
│  ├─ WebSocket para push
│  └─ File upload (configurations)
│
├─ MQTT Broker (Mosquitto)
│  ├─ Central message bus
│  ├─ Topic structure:
│  │  home/living-room/light/state
│  │  home/bedroom/temperature/value
│  │  home/security/motion/detected
│  │  home/energy/power/consumption
│  └─ Retained messages para sync
│
├─ Sync Service
│  ├─ WiFi sync com API Cloud
│  ├─ Offline queue (se internet cair)
│  ├─ Conflict resolution
│  └─ Local database (SQLite)
│
└─ Automation Engine
   ├─ Executa cenários localmente
   ├─ Fallback se cloud cair
   ├─ Latência ultra-baixa (50ms)
   └─ Scheduler (cron jobs)

Docker Setup:
```
docker-compose.yml:
├─ mosquitto (MQTT broker)
├─ zigbee2mqtt (Zigbee bridge)
├─ zwavejs (Z-Wave bridge)
├─ node-app (API local + automações)
└─ sqlite (database local)
```

---

## 3. INTEGRAÇÕES EXTERNAS

### 3.1 Smart Home Protocols

```
THREAD 1: Zigbee
├─ Suporte: 90% dos smart homes no Brasil
├─ Latência: 50-200ms
├─ Software: zigbee2mqtt (open source)
├─ Compatibilidade: Philips Hue, IKEA, Sengled, etc
└─ Implementação: 2 semanas (MVP1)

THREAD 2: Z-Wave
├─ Suporte: 20% do mercado (niche mas premium)
├─ Latência: 100-300ms
├─ Software: zwavejs (open source)
├─ Compatibilidade: Aeotec, Fibaro, Yale, etc
└─ Implementação: 2 semanas (MVP1)

THREAD 3: WiFi (HTTP)
├─ Suporte: Smart plugs (TP-Link, Sonoff, Tuya)
├─ Latência: 200-500ms
├─ Protocolo: HTTP REST
├─ Compatibilidade: Maior mercado em volume
└─ Implementação: 1 semana (MVP0)

THREAD 4: Bluetooth (BLE)
├─ Suporte: Wearables (Apple Watch, Fitbit, Garmin)
├─ Latência: 100-500ms
├─ Software: Noble.js (Node.js)
├─ Compatibilidade: Health wearables (critical)
└─ Implementação: 2 semanas (MVP1)

THREAD 5: Tuya / SmartLife
├─ Suporte: 40% dos smart devices Brasil (cheap)
├─ Latência: 500-1000ms (cloud)
├─ API: REST + WebSocket
├─ Implementação: 3 semanas (MVP2)

THREAD 6: Matter (2026+)
├─ Suporte: Padrão novo (Apple, Google, Amazon, Samsung)
├─ Latência: 100-200ms (via Thread border router)
├─ Software: Matter.js library
├─ Importância: Critical (futuro padrão)
└─ Implementação: MVP3 (late 2026)

THREAD 7: eWeLink (Sonoff)
├─ Suporte: Sonoff (100k+Brazil), IFTTT
├─ Latência: 500ms-2s
├─ API: REST
└─ Implementação: 1 semana (MVP2)
```

### 3.2 Cloud Integrations

```
GOOGLE HOME / ALEXA INTEGRATION
├─ Role: ANASY funciona como hub
├─ Protocolo: Google Home/Alexa APIs
├─ Funcionalidade: Commands via voice
├─ Setup: OAuth2 + Device linking
└─ MVP: MVP3

APPLE HOMEKIT INTEGRATION
├─ Role: ANASY como HomeKit hub
├─ Protocolo: HomeKit Accessory Protocol (HAP)
├─ Setup: QR code pairing
├─ Data: Criptografia end-to-end
└─ MVP: MVP3

STRIPE (Payment Processing)
├─ Pagamento de assinatura
├─ Webhooks para sync de status
├─ Dunning (retry falhado)
├─ Implementation: 1 semana

TWILIO (SMS/Whatsapp Alerts)
├─ Alertas críticos via SMS
├─ Confirmação de login
├─ Implementation: 2 dias

SENDGRID (Email Service)
├─ Confirmação de email
├─ Relatórios mensais
├─ Password reset
├─ Implementation: 2 dias

SENTRY / DATADOG (Monitoring)
├─ Error tracking
├─ Performance monitoring
├─ Alertas de uptime
└─ Implementation: 3 dias

FIREBASE ANALYTICS / MIXPANEL
├─ User behavior tracking
├─ Funnels
├─ Retention analysis
└─ Implementation: 3 dias
```

---

## 4. BANCO DE DADOS

### 4.1 PostgreSQL (Dados Estruturados)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  subscription_plan VARCHAR(50), -- 'basic', 'premium', 'health'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Devices
CREATE TABLE devices (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  home_id UUID REFERENCES homes(id),
  name VARCHAR(255),
  type VARCHAR(50), -- 'light', 'plug', 'ac', 'lock'
  protocol VARCHAR(50), -- 'zigbee', 'zwave', 'wifi'
  device_id VARCHAR(255), -- ID do dispositivo no protocolo
  status JSON, -- { "state": "on", "brightness": 80 }
  energy_consumption FLOAT, -- Watts
  last_seen TIMESTAMP,
  battery_level INT, -- 0-100
  created_at TIMESTAMP
);

-- Homes
CREATE TABLE homes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255),
  address TEXT,
  timezone VARCHAR(50),
  hub_id VARCHAR(255), -- ID do Raspberry Pi
  created_at TIMESTAMP
);

-- Scenarios
CREATE TABLE scenarios (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  home_id UUID REFERENCES homes(id),
  name VARCHAR(255),
  description TEXT,
  trigger JSON, -- { "type": "time", "value": "07:00" }
  conditions JSON, -- [ { "type": "temperature", "operator": ">", "value": 25 } ]
  actions JSON, -- [ { "device_id": "xxx", "command": "on", "delay": 0 } ]
  enabled BOOLEAN,
  created_at TIMESTAMP
);

-- Events / Audit Log
CREATE TABLE events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(50), -- 'device_on', 'scenario_triggered', 'anomaly_detected'
  device_id UUID REFERENCES devices(id),
  data JSON,
  created_at TIMESTAMP
);

-- Energy Consumption (Time Series)
CREATE TABLE energy_consumption (
  id UUID PRIMARY KEY,
  device_id UUID REFERENCES devices(id),
  timestamp TIMESTAMP,
  power_watts FLOAT,
  CONSTRAINT energy_timestamp_idx UNIQUE (device_id, timestamp)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan VARCHAR(50),
  stripe_customer_id VARCHAR(255),
  status VARCHAR(50), -- 'active', 'canceled', 'past_due'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  canceled_at TIMESTAMP
);

-- Health Data (MVP3)
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  metric_type VARCHAR(50), -- 'heart_rate', 'blood_pressure', 'fall'
  value FLOAT,
  timestamp TIMESTAMP,
  device_id VARCHAR(255) -- smartwatch ID
);
```

### 4.2 MongoDB (Logs + Time Series)

```javascript
// Telemetry Collection
db.telemetry.insertOne({
  _id: ObjectId(),
  user_id: "uuid",
  timestamp: ISODate("2026-01-27T10:30:00Z"),
  event_type: "device_status_change",
  device_id: "uuid",
  old_state: { "on": true },
  new_state: { "on": false },
  triggered_by: "user_command" // ou "scenario" ou "automation"
});

// Anomalies Collection
db.anomalies.insertOne({
  _id: ObjectId(),
  user_id: "uuid",
  timestamp: ISODate(),
  anomaly_type: "energy_spike",
  device_id: "uuid",
  details: {
    normal_consumption: 50,
    anomaly_consumption: 120,
    percentage_increase: 140
  },
  severity: "medium", // low, medium, high, critical
  processed: false
});

// AI Logs Collection (para treinar modelos)
db.ai_logs.insertMany([
  {
    timestamp: ISODate(),
    user_id: "uuid",
    action: "light_on",
    context: { time: "07:00", day: "monday", temp: 22 },
    model_version: "1.2.3"
  }
]);
```

### 4.3 Redis (Cache + Sessions)

```
Cache Strategy:
├─ Session tokens: TTL 24h
├─ Device status: TTL 5min (atualiza em tempo real)
├─ User profile: TTL 1h
├─ API responses: TTL 10min
│  ├─ GET /api/v1/energy/usage
│  ├─ GET /api/v1/devices
│  └─ GET /api/v1/scenarios
└─ Rate limiter: TTL conforme plan

Pub/Sub (Real-time):
├─ home:123:devices:update → notifica clients
├─ home:123:scenarios:trigger → broadcast
└─ user:uuid:alerts → notificações pessoais
```

---

## 5. MACHINE LEARNING / IA

### 5.1 Behavioral Learning Engine

```python
# Python + FastAPI (rode em servidor separado)

from fastapi import FastAPI
from tensorflow import keras
import pandas as pd
from sklearn.preprocessing import StandardScaler

app = FastAPI()

class BehavioralLearning:
    def __init__(self):
        self.model = keras.models.Sequential()  # LSTM
        self.scaler = StandardScaler()
    
    def train_pattern(self, user_id: str, history: List[Dict]):
        """
        Input:
        [
          { "time": "07:00", "day": "monday", "action": "light_on", "device": "bedroom" },
          { "time": "07:15", "day": "monday", "action": "ac_on", "device": "bedroom" },
          ...
        ]
        
        Output:
        Modelo treinado que prevê: 
        - "Próximo action provavelmente será..."
        - "Padrão detectado em..."
        """
        
        # Preparar dados
        X = self._prepare_features(history)
        y = self._prepare_labels(history)
        
        # Treinar LSTM
        self.model.fit(X, y, epochs=10, batch_size=32)
        
        # Salvar modelo
        self.model.save(f"models/user_{user_id}.h5")
    
    def predict_next_action(self, user_id: str, context: Dict):
        """
        Input: { "time": "07:00", "day": "monday", "temperature": 18 }
        Output: { "action": "light_on", "confidence": 0.92, "reason": "toda segunda às 7h" }
        """
        model = keras.models.load_model(f"models/user_{user_id}.h5")
        X = self._prepare_features([context])
        prediction = model.predict(X)
        return {"action": prediction[0], "confidence": prediction[1]}

@app.post("/api/train")
async def train_model(user_id: str, history: List[Dict]):
    learning = BehavioralLearning()
    learning.train_pattern(user_id, history)
    return {"status": "trained"}

@app.post("/api/predict")
async def predict_action(user_id: str, context: Dict):
    learning = BehavioralLearning()
    prediction = learning.predict_next_action(user_id, context)
    return prediction
```

### 5.2 Anomaly Detection

```python
# Detecção de comportamentos anômalos (via Isolation Forest)

from sklearn.ensemble import IsolationForest
import numpy as np

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1)
    
    def detect_energy_anomaly(self, device_id: str, current_power: float, historical_avg: float):
        """
        Detecta se consumo está fora do padrão
        """
        if current_power > historical_avg * 1.2:  # 20% acima
            return {"anomaly": True, "type": "energy_spike", "severity": "high"}
        
        return {"anomaly": False}
    
    def detect_security_anomaly(self, motion_detected: bool, expected: bool, time: str, occupancy: bool):
        """
        Detecta movimento anômalo (3h da manhã com moradores na cama = suspeito)
        """
        is_night = int(time.split(":")[0]) >= 23 or int(time.split(":")[0]) <= 5
        
        if is_night and not occupancy and motion_detected:
            return {"anomaly": True, "type": "intrusion_risk", "severity": "critical"}
        
        if is_night and occupancy and motion_detected:
            return {"anomaly": False, "reason": "moradores acordados"}
        
        return {"anomaly": False}
```

---

## 6. SEGURANÇA

### 6.1 Autenticação & Autorização

```javascript
// JWT Auth Flow
├─ Login → issueTokens(access_token: 15min, refresh_token: 7 dias)
├─ Cada requisição inclui: Authorization: Bearer <access_token>
├─ Se expirar: POST /api/auth/refresh com refresh_token
├─ Logout: Blacklist refresh_token no Redis
└─ MFA: (opcional) TOTP via Google Authenticator

// Role-Based Access Control
├─ Admin: Acesso total ao sistema
├─ Owner: Dono da casa (full access)
├─ Member: Família (read-only ou limited write)
└─ Guest: Visitante (específicas automações apenas)
```

### 6.2 Criptografia

```
Data in Transit:
├─ HTTPS/TLS 1.3 para toda API
├─ WSS (WebSocket Secure) para real-time
└─ Certificados Let's Encrypt (auto-renew)

Data at Rest:
├─ Senhas: bcrypt (12 rounds)
├─ API Keys: AES-256 (para integrações)
├─ Health Data: AES-256 (PII compliance)
└─ Backups: Encrypted snapshots

End-to-End:
├─ HomeKit: Apple's encryption (não vemos dados)
├─ Health critical alerts: Envio criptografado apenas
└─ Video feeds: Separate key per user (não temos acesso)
```

### 6.3 Compliance

```
LGPD (Lei Geral de Proteção de Dados):
├─ Privacy policy clara
├─ Direito ao esquecimento (deletar conta)
├─ Consentimento explícito para coleta
├─ Data residency: Servidores BR ou AWS SA
└─ Criptografia de PII

SOC 2 (Security):
├─ Monitorie de acesso (audit logs)
├─ Backup automático (3 cópias)
├─ Disaster recovery plan
├─ Incident response process
└─ Regular security audits
```

---

## 7. DEPLOYMENT & INFRAESTRUTURA

### 7.1 Cloud Architecture (AWS Recomendado)

```
Production Setup:
├─ Load Balancer (AWS ALB)
│  ├─ SSL/TLS termination
│  ├─ Health checks
│  └─ Auto-scaling rules
│
├─ API Servers (EC2 Auto Scaling)
│  ├─ Node.js app (3 instances minimum)
│  ├─ Auto-scale 3-10 conforme load
│  ├─ Logs → CloudWatch
│  └─ Health monitoring via Prometheus
│
├─ RDS PostgreSQL
│  ├─ Multi-AZ (high availability)
│  ├─ Automatic backups (7 days retention)
│  ├─ Read replicas para queries heavy
│  └─ SSL connections
│
├─ DocumentDB (MongoDB)
│  ├─ Managed MongoDB (AWS)
│  ├─ Auto-scaling storage
│  ├─ Automated backups
│  └─ PIOPS for performance
│
├─ ElastiCache (Redis)
│  ├─ Cluster mode (high availability)
│  ├─ Multi-AZ replication
│  └─ Encryption at rest/transit
│
├─ SQS + Lambda
│  ├─ Async jobs (email, analytics)
│  ├─ Serverless scale
│  └─ Cost-efficient
│
├─ S3 + CloudFront
│  ├─ Static assets (app builds)
│  ├─ Global CDN
│  └─ Automatic compression
│
└─ Route 53
   ├─ DNS management
   ├─ Failover routing
   └─ Health checks

Cost Estimate (Mês 1):
├─ Compute: R$ 1.500
├─ Database: R$ 800
├─ Cache: R$ 300
├─ Storage + CDN: R$ 200
├─ Lambda: R$ 100
└─ Total: ~R$ 2.900/mês
```

### 7.2 CI/CD Pipeline

```yaml
# GitHub Actions / GitLab CI

stages:
  - build
  - test
  - deploy-staging
  - deploy-production

Build:
  ├─ npm install
  ├─ npm run build
  ├─ Docker build -t anasy:latest
  └─ Push to ECR

Test:
  ├─ npm run test (unit)
  ├─ npm run test:e2e (integration)
  ├─ Security scan (Snyk)
  └─ Code quality (SonarQube)

Deploy Staging:
  ├─ Deploy to staging env
  ├─ Run smoke tests
  └─ Notify team

Deploy Production:
  ├─ Blue-green deployment
  ├─ Gradual rollout (5% → 100%)
  ├─ Health checks
  ├─ Rollback automation se falhar
  └─ Slack notification
```

---

## 8. PERFORMANCE & SCALABILITY

### 8.1 Targets

```
Latência:
├─ API response: < 200ms (p95)
├─ WebSocket push: < 100ms
├─ Hub local command: < 50ms
└─ Cloud device command: < 500ms

Throughput:
├─ 10,000 concurrent users
├─ 100 commands/second
├─ 1,000 events/second (analytics)
└─ 100,000 devices managed

Uptime:
├─ SLA: 99.95% (4h downtime/year)
├─ Monitoring: Datadog/New Relic
└─ Alerting: Slack + PagerDuty
```

### 8.2 Caching Strategy

```
Cache Hierarchy:
1. Client-side (React Query):
   - Device list: 5 min
   - User profile: 1 hour
   - Energy data: 10 min

2. Redis (API cache):
   - Hot data: 5 min
   - API responses: 10 min
   - Rate limits: real-time

3. CDN (CloudFront):
   - Static assets: 1 day
   - Images: 1 week
   - API responses: no cache

Invalidation:
├─ On write: Limpar Redis key relevante
├─ On error: Fallback para DB direto
└─ Background jobs: Re-populate cache
```

---

## 9. MONITORING & OBSERVABILITY

### 9.1 Metrics to Track

```
Business Metrics:
├─ DAU (Daily Active Users)
├─ MRR (Monthly Recurring Revenue)
├─ Churn rate
├─ NPS (Net Promoter Score)
└─ Feature usage per persona

Technical Metrics:
├─ API latency (p50, p95, p99)
├─ Error rate (5xx, 4xx)
├─ Database query time
├─ Cache hit ratio
├─ Hub connectivity (% online)
├─ Webhook delivery rate
└─ Device discovery time

Infrastructure:
├─ CPU usage
├─ Memory usage
├─ Network I/O
├─ Disk I/O
├─ Cost per transaction
└─ Cost per user
```

### 9.2 Alerting

```
Critical (PagerDuty):
├─ > 1% error rate (5min)
├─ API response > 1s (p95)
├─ Database latency > 500ms
├─ > 500 devices offline simultaneously
└─ Payment processing failure

High (Slack):
├─ Cache hit ratio < 70%
├─ MRR down vs forecast
├─ Deployment failure
└─ Security alert

Medium (Email):
├─ Disk usage > 80%
├─ Traffic spike > 50%
└─ New user signups trend
```

================================================================================
                      FIM - ARQUITETURA TÉCNICA
================================================================================
