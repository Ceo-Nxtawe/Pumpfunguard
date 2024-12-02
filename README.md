# PumpFun Guard - AI-Powered Token Analysis

## 🚀 Vue d'ensemble

PumpFun Guard est une application d'analyse en temps réel des tokens Solana utilisant l'intelligence artificielle pour détecter les risques potentiels et protéger les investisseurs.

## 📋 Prérequis

- Node.js 18+
- Python 3.8+
- Docker & Docker Compose
- Compte Railway
- Compte Vercel ou Netlify
- Compte RPC Solana (QuickNode/Alchemy recommandé)

## 🛠️ Stack Technique

### Frontend
- React 18 avec TypeScript
- Vite pour le bundling
- TailwindCSS & shadcn/ui
- WebSocket pour le temps réel

### Backend
- Flask & Gunicorn
- River ML pour l'IA
- MongoDB (Railway)
- WebSocket pour les événements

## 🔧 Installation Locale

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/pumpfun-guard.git
cd pumpfun-guard
```

2. Variables d'environnement :

Frontend (.env) :
```env
VITE_API_URL=http://localhost:5000/api
VITE_PUMPFUN_WS_URL=wss://rpc.api-pump.fun/ws
```

Backend (.env) :
```env
MONGO_URI=mongodb://mongo:${MONGODB_URL}@mongodb.railway.internal:27017
FLASK_ENV=development
FLASK_SECRET_KEY=your-secret-key
PUMPFUN_API_KEY=your-api-key
```

3. Développement local avec Docker :
```bash
docker-compose up --build
```

## 📦 Déploiement

### 1. Railway (Backend + MongoDB)

1. Créer un nouveau projet sur Railway :
```bash
railway login
railway init
```

2. Ajouter MongoDB à votre projet :
```bash
railway add mongodb
```

3. Configurer les variables d'environnement :
```bash
railway variables set FLASK_ENV=production
railway variables set FLASK_SECRET_KEY=$(python generate_key.py)
railway variables set PUMPFUN_API_KEY=your-api-key
```

4. Configurer le service Flask :
```bash
# railway.toml
[build]
builder = "nixpacks"
buildCommand = "pip install -r requirements.txt"

[deploy]
startCommand = "gunicorn app:app --bind 0.0.0.0:$PORT"
healthcheckPath = "/api/health"
healthcheckTimeout = 100
restartPolicyType = "on-failur qe"
restartPolicyMaxRetries = 3

[service]
internal_port = 5000

[database]
type = "mongodb"
plan = "free"
```

5. Déployer :
```bash
railway up
```

### 2. Frontend (Vercel/Netlify)

#### Option 1: Vercel

1. Installer Vercel CLI :
```bash
npm install -g vercel
```

2. Configurer le projet :
```bash
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "environment": {
    "VITE_API_URL": "https://your-railway-app.railway.app/api",
    "VITE_PUMPFUN_WS_URL": "wss://rpc.api-pump.fun/ws"
  }
}
```

3. Déployer :
```bash
vercel --prod
```

#### Option 2: Netlify

1. Installer Netlify CLI :
```bash
npm install -g netlify-cli
```

2. Configurer le projet :
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
  
[build.environment]
  VITE_API_URL = "https://your-railway-app.railway.app/api"
  VITE_PUMPFUN_WS_URL = "wss://rpc.api-pump.fun/ws"
```

3. Déployer :
```bash
netlify deploy --prod
```

## 🐳 Docker

### Structure Docker

```
.
├── docker-compose.yml
├── Dockerfile.frontend
├── Dockerfile.backend
└── nginx/
    └── nginx.conf
```

### Configuration des conteneurs

1. Frontend (Dockerfile.frontend) :
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Backend (Dockerfile.backend) :
```dockerfile
FROM python:3.8-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app", "--workers", "4", "--timeout", "120"]
```

3. Docker Compose (docker-compose.yml) :
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://backend:5000/api
      - VITE_PUMPFUN_WS_URL=wss://rpc.api-pump.fun/ws
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongo:${MONGODB_URL}@mongodb.railway.internal:27017
      - FLASK_ENV=production
      - FLASK_SECRET_KEY=${FLASK_SECRET_KEY}
      - PUMPFUN_API_KEY=${PUMPFUN_API_KEY}
    depends_on:
      - mongodb
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}

volumes:
  mongodb_data:
```

4. Configuration Nginx (nginx/nginx.conf) :
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

## 🔒 Sécurité

1. Secrets et Variables d'environnement :
- Utiliser Railway pour gérer les secrets
- Ne jamais commiter de secrets dans Git
- Utiliser des variables d'environnement pour la configuration

2. CORS et Sécurité :
- Configurer CORS correctement pour l'API
- Utiliser HTTPS en production
- Implémenter le rate limiting
- Valider toutes les entrées utilisateur

3. Monitoring :
- Configurer les logs Railway
- Mettre en place des alertes
- Surveiller les métriques MongoDB

## 📊 Mise à l'échelle

1. Railway :
- Configurer l'auto-scaling
- Augmenter les ressources si nécessaire
- Ajouter des workers Gunicorn

2. Frontend :
- Utiliser un CDN
- Optimiser les assets
- Mettre en cache les requêtes API

## 🔄 CI/CD

1. GitHub Actions :
```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test
        run: |
          npm install
          npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 🔍 Troubleshooting

1. Logs :
```bash
# Railway logs
railway logs

# Container logs
docker-compose logs -f
```

2. Monitoring :
- Vérifier les métriques Railway
- Consulter les logs MongoDB
- Surveiller l'utilisation des ressources

3. Rollback :
```bash
# Railway rollback
railway rollback

# Vercel rollback
vercel rollback
```
