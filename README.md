# PumpFun Guard - AI-Powered Token Analysis

Une application de surveillance et d'analyse des tokens Solana en temps réel, utilisant l'intelligence artificielle pour détecter les risques potentiels.

## 🚀 Fonctionnalités

- Surveillance en temps réel des nouveaux tokens sur Solana
- Analyse IA des tokens avec River ML
- Interface admin pour la gestion des tokens suspects
- Système de bannissement des wallets
- Notifications en temps réel
- Filtrage et recherche avancée

## 🛠 Stack Technique

### Frontend
- React 18 avec TypeScript
- Vite pour le bundling
- TailwindCSS et shadcn/ui pour l'interface
- WebSocket pour les mises à jour en temps réel

### Backend
- Flask pour l'API REST
- River ML pour l'analyse IA
- MongoDB pour le stockage
- WebSocket pour les événements temps réel

## 📦 Installation

### Prérequis
- Node.js 18+
- Python 3.8+
- MongoDB 6+

### Configuration Locale

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/pumpfun-guard.git
cd pumpfun-guard
```

2. Installer les dépendances frontend :
```bash
npm install
```

3. Créer un environnement virtuel Python :
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows
```

4. Installer les dépendances backend :
```bash
pip install -r requirements.txt
```

5. Configurer les variables d'environnement :

Créer un fichier `.env` :
```env
# Frontend (.env)
VITE_API_URL=http://localhost:5000/api
VITE_PUMPFUN_WS_URL=wss://rpc.api-pump.fun/ws

# Backend (.env)
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=1
MONGO_URI=mongodb://localhost:27017/pumpfun_data
```

## 🚀 Déploiement

### Backend (Railway)

1. Créer un compte sur [Railway](https://railway.app)

2. Créer un nouveau projet :
```bash
railway init
```

3. Ajouter les variables d'environnement :
```bash
railway vars set MONGO_URI=votre_uri_mongodb_atlas
railway vars set FLASK_ENV=production
```

4. Déployer :
```bash
railway up
```

### Frontend (Vercel)

1. Créer un compte sur [Vercel](https://vercel.com)

2. Installer Vercel CLI :
```bash
npm i -g vercel
```

3. Déployer :
```bash
vercel
```

### MongoDB Atlas

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Créer un nouveau cluster

3. Configurer l'accès réseau :
   - Ajouter les IPs des serveurs Railway
   - Ajouter 0.0.0.0/0 pour le développement

4. Créer un utilisateur de base de données

5. Récupérer l'URI de connexion et l'ajouter aux variables d'environnement

## 📝 Configuration des WebSockets

### PumpFun WebSocket

1. Obtenir les credentials d'API sur [PumpFun](https://pump.fun)

2. Configurer dans le frontend :
```typescript
// src/lib/constants.ts
export const WEBSOCKET = {
  ENDPOINT: 'wss://rpc.api-pump.fun/ws',
  // ... autres configurations
};
```

### Solana RPC

1. Configurer les endpoints RPC :
```typescript
// src/lib/constants.ts
export const SOLANA = {
  RPC_ENDPOINTS: [
    'https://api.mainnet-beta.solana.com',
    // Ajouter vos RPC privés ici
  ],
};
```

## 🔍 Monitoring

### Sentry

1. Créer un compte sur [Sentry](https://sentry.io)

2. Ajouter Sentry au frontend :
```bash
npm install @sentry/react
```

3. Configurer dans le code :
```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "votre-dsn-sentry"
});
```

### Logging

Les logs sont gérés via :
- Frontend : Console + Sentry
- Backend : Gunicorn + Custom Logger

## 📊 Métriques

Métriques importantes à surveiller :
- Latence des WebSockets
- Temps de réponse de l'API
- Utilisation mémoire MongoDB
- Taux d'erreur IA
- Nombre de connexions simultanées

## 🔒 Sécurité

- Rate limiting sur l'API
- Validation des données WebSocket
- Sanitization des entrées MongoDB
- Rotation des clés API
- CORS configuré
- Protection CSRF

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.