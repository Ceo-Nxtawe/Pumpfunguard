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
