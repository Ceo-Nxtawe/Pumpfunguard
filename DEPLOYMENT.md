# Guide de Déploiement PumpFun Guard

## 1. Configuration Railway

### Variables d'Environnement Railway

1. Variables Backend :
```env
FLASK_ENV=production
FLASK_SECRET_KEY=<généré via generate_key.py>
FLASK_DEBUG=0
PORT=5000
PUMPFUN_API_KEY=<votre clé API PumpFun>

# RPC Solana
SOLANA_RPC_MAINNET=https://api.mainnet-beta.solana.com
SOLANA_RPC_FALLBACK_1=https://solana-api.projectserum.com
SOLANA_RPC_FALLBACK_2=https://rpc.ankr.com/solana
SOLANA_WSS_MAINNET=wss://api.mainnet-beta.solana.com
SOLANA_WSS_FALLBACK=wss://solana-api.projectserum.com

# Rate Limiting
RATE_LIMIT_PER_MINUTE=100
RATE_LIMIT_PER_HOUR=1000
```

2. Variables MongoDB (automatiquement configurées par Railway) :
```env
MONGODB_URL=<généré automatiquement>
MONGO_URI=mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@mongodb.railway.internal:27017
MONGODB_USER=<généré automatiquement>
MONGODB_PASSWORD=<généré automatiquement>
MONGODB_DATABASE=pumpfun_guard
```

### Configuration MongoDB sur Railway

1. Ajouter MongoDB :
```bash
railway add mongodb
```

2. Configuration automatique :
- Railway génère automatiquement les credentials
- La base de données est accessible via mongodb.railway.internal
- Le port par défaut est 27017

3. Vérification de la connexion :
```bash
railway connect mongodb
```

### Configuration des Fallbacks RPC

1. Créer le fichier `config/rpc.py` :
```python
RPC_CONFIG = {
    'mainnet': {
        'primary': {
            'http': 'https://api.mainnet-beta.solana.com',
            'ws': 'wss://api.mainnet-beta.solana.com'
        },
        'fallbacks': [
            {
                'http': 'https://solana-api.projectserum.com',
                'ws': 'wss://solana-api.projectserum.com'
            },
            {
                'http': 'https://rpc.ankr.com/solana',
                'ws': None  # HTTP only
            }
        ]
    }
}

def get_active_rpc():
    """
    Retourne le premier RPC disponible
    """
    # Logique de fallback implémentée dans solana_service.py
    pass
```

2. Configurer la rotation des RPC :
```python
# services/solana_service.py
class SolanaService:
    def __init__(self):
        self.current_rpc_index = 0
        self.rpc_config = RPC_CONFIG['mainnet']
        
    def get_connection(self):
        # Rotation automatique des RPC en cas d'erreur
        pass
```

### Sécurité et Rate Limiting

1. Configuration dans Railway :
```bash
railway variables set RATE_LIMIT_PER_MINUTE=100
railway variables set RATE_LIMIT_PER_HOUR=1000
```

2. Implémentation dans Flask :
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=[
        f"{os.getenv('RATE_LIMIT_PER_MINUTE')} per minute",
        f"{os.getenv('RATE_LIMIT_PER_HOUR')} per hour"
    ]
)
```

### Monitoring et Logs

1. Configuration des logs Railway :
```bash
railway logs --filter mongodb
railway logs --filter web
```

2. Alertes MongoDB :
```bash
# Configurer via l'interface Railway
railway alerts create \
  --name "MongoDB High CPU" \
  --metric cpu \
  --threshold 80 \
  --duration 5m
```

### Scaling

1. Configuration des ressources :
```bash
# Augmenter les ressources MongoDB
railway scale mongodb --memory 1GB --cpu 1

# Augmenter les ressources Backend
railway scale web --memory 512MB --cpu 0.5
```

2. Configuration Gunicorn :
```python
# gunicorn.conf.py
workers = 4
threads = 2
timeout = 120
max_requests = 1000
max_requests_jitter = 50
```

## 2. Vérification du Déploiement

1. Santé de l'application :
```bash
curl https://your-app.railway.app/api/health
```

2. Vérification MongoDB :
```bash
railway run mongosh
```

3. Logs en temps réel :
```bash
railway logs -f
```

## 3. Maintenance

1. Backup MongoDB :
```bash
# Configuration automatique via Railway
railway backup create mongodb
```

2. Restauration :
```bash
railway backup restore mongodb --backup <backup-id>
```

3. Mise à jour de l'application :
```bash
railway up
```
