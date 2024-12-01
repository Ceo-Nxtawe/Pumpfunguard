export interface Token {
  id: string;
  name: string;
  address: string;
  marketCap: number;
  riskScore: number;
  priceHistory: number[];
  lastUpdated: string;
  chain: 'solana';
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface TokenAnalytics {
  totalScanned: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
}

export interface BannedWallet {
  wallet: string;
  banned_at: string;
  chain: 'solana';
}