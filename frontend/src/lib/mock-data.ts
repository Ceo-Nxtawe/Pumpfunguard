import { Token } from '@/types/token';

export const mockTokens: Token[] = [
  {
    id: '1',
    name: 'SafeMoon V2',
    address: '0x42981d0bfbAf196529376EE702F2a9Eb9092fcB5',
    marketCap: 125000000,
    riskScore: 85,
    priceHistory: [10, 12, 9, 11, 15, 14, 13],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Ethereum',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    marketCap: 250000000000,
    riskScore: 15,
    priceHistory: [2800, 2850, 2900, 2875, 2925, 3000, 2950],
    lastUpdated: new Date().toISOString(),
  },
  // Add more mock tokens as needed
];

export const mockAnalytics = {
  totalScanned: 1500,
  highRiskCount: 250,
  mediumRiskCount: 450,
  lowRiskCount: 800,
};