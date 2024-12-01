# Guide de Déploiement Détaillé

## 1. Préparation

### Base de données MongoDB Atlas

1. Créer un compte MongoDB Atlas
2. Créer un nouveau projet
3. Créer un cluster (choisir la région la plus proche)
4. Créer un utilisateur de base de données
5. Configurer l'accès réseau
6. Obtenir l'URI de connexion

### Variables d'environnement requises

```env
# Backend
MONGO_URI=mongodb+srv://...
FLASK_ENV=production
FLASK_SECRET_KEY=your-secret-key
PUMPFUN_API_KEY=your-api-key

# Frontend
VITE_API_URL=https://your-api.railway.app/api
VITE_PUMPFUN_WS_URL=wss://rpc.api-pump.fun/ws
```

## 2. Déploiement Backend (Railway)

1. Connexion à Railway :
```bash
railway login
```

2. Initialiser le projet :
```bash
railway init
```

3. Ajouter les variables d'environnement :
```bash
railway vars set MONGO_URI=mongodb+srv://...
railway vars set FLASK_ENV=production
railway vars set FLASK_SECRET_KEY=your-secret-key
```

4. Configurer le service :
```bash
# railway.json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt"
  },
  "run": {
    "command": "gunicorn app:app"
  }
}
```

5. Déployer :
```bash
railway up
```

## 3. Déploiement Frontend (Vercel)

1. Connexion à Vercel :
```bash
vercel login
```

2. Configurer le projet :
```bash
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "environment": {
    "VITE_API_URL": "https://your-api.railway.app/api",
    "VITE_PUMPFUN_WS_URL": "wss://rpc.api-pump.fun/ws"
  }
}
```

3. Déployer :
```bash
vercel --prod
```

## 4. Configuration SSL/TLS

### Backend (Railway)

- SSL géré automatiquement par Railway
- Vérifier le certificat dans les paramètres du projet

### Frontend (Vercel)

- SSL géré automatiquement par Vercel
- Configurer les domaines personnalisés si nécessaire

## 5. Monitoring

### Sentry

1. Créer un projet sur Sentry
2. Ajouter la configuration :

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV
});
```

### Logging

1. Configurer les logs backend :
```python
# app.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

2. Configurer Gunicorn :
```bash
# gunicorn.conf.py
accesslog = '-'
errorlog = '-'
loglevel = 'info'
```

## 6. Mise à l'échelle

### MongoDB Atlas

1. Configurer l'auto-scaling :
   - Définir les seuils de CPU/RAM
   - Configurer les alertes

### Railway

1. Configurer les ressources :
   - Augmenter la RAM si nécessaire
   - Ajouter des instances si besoin

### Vercel

1. Configurer le scaling automatique :
   - Activer les previews
   - Configurer les régions de déploiement

## 7. Sécurité

### Backend

1. Configurer le rate limiting :
```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
```

2. Configurer CORS :
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://your-frontend.vercel.app"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})
```

### Frontend

1. Configurer la CSP :
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self';"
    }
  }
});
```

## 8. Maintenance

### Backups MongoDB

1. Configurer les backups automatiques :
   - Fréquence : quotidienne
   - Rétention : 7 jours

### Mises à jour

1. Backend :
```bash
pip install --upgrade -r requirements.txt
railway up
```

2. Frontend :
```bash
npm update
vercel --prod
```

## 9. Troubleshooting

### Logs

1. Backend (Railway) :
```bash
railway logs
```

2. Frontend (Vercel) :
```bash
vercel logs
```

### Monitoring

1. Vérifier Sentry pour les erreurs
2. Consulter les métriques MongoDB Atlas
3. Vérifier les logs Railway/Vercel

## 10. Rollback

### Backend

1. Railway :
```bash
railway rollback
```

### Frontend

1. Vercel :
```bash
vercel rollback
```