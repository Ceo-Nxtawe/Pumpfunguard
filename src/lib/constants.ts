export const WEBSOCKET = {
  ENDPOINT: 'wss://rpc.api-pump.fun/ws',
  RECONNECT: {
    MAX_ATTEMPTS: 5,
    BASE_DELAY: 1000,
    MAX_DELAY: 30000,
  },
  METHODS: {
    NEW_POOLS: 'subscribeNewPools',
    TRADES: 'subscribeTrades',
    PUBLICATIONS: 'subscribePublications',
  },
  RETRY_DELAY: 2000,
} as const;

export const SOLANA = {
  RPC_ENDPOINTS: [
    'https://api.mainnet-beta.solana.com',
    'https://solana-api.projectserum.com',
    'https://rpc.ankr.com/solana',
  ],
  WSS_ENDPOINTS: [
    'wss://api.mainnet-beta.solana.com',
    'wss://solana-api.projectserum.com',
  ],
} as const;