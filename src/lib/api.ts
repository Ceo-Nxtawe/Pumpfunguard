import { Token, BannedWallet } from '@/types/token';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchTokens(page = 1, limit = 10, risk?: number) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    chain: 'solana',
    ...(risk && { risk: risk.toString() }),
  });

  const response = await fetch(`${API_URL}/tokens?${params}`);
  if (!response.ok) throw new Error('Failed to fetch tokens');
  return response.json();
}

export async function searchTokens(query: string): Promise<Token[]> {
  const params = new URLSearchParams({
    q: query,
    chain: 'solana',
  });

  const response = await fetch(`${API_URL}/token/search?${params}`);
  if (!response.ok) throw new Error('Failed to search tokens');
  return response.json();
}

export async function getTokenDetails(tokenAddress: string): Promise<Token> {
  const response = await fetch(`${API_URL}/token/${tokenAddress}?chain=solana`);
  if (!response.ok) throw new Error('Failed to fetch token details');
  return response.json();
}

export async function analyzeToken(tokenAddress: string) {
  const response = await fetch(`${API_URL}/admin/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      token_address: tokenAddress,
      chain: 'solana'
    }),
  });
  if (!response.ok) throw new Error('Failed to analyze token');
  return response.json();
}

export async function banWallet(wallet: string): Promise<BannedWallet> {
  const response = await fetch(`${API_URL}/admin/ban_wallet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      wallet,
      chain: 'solana'
    }),
  });
  if (!response.ok) throw new Error('Failed to ban wallet');
  return response.json();
}

export async function unbanWallet(wallet: string) {
  const response = await fetch(`${API_URL}/admin/unban_wallet`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      wallet,
      chain: 'solana'
    }),
  });
  if (!response.ok) throw new Error('Failed to unban wallet');
  return response.json();
}

export async function getBannedWallets(): Promise<BannedWallet[]> {
  const response = await fetch(`${API_URL}/admin/banned_wallets?chain=solana`);
  if (!response.ok) throw new Error('Failed to fetch banned wallets');
  return response.json();
}

export async function updateAISettings(settings: {
  highRiskThreshold: number;
  mediumRiskThreshold: number;
}) {
  const response = await fetch(`${API_URL}/admin/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!response.ok) throw new Error('Failed to update AI settings');
  return response.json();
}

export async function retrainModel() {
  const response = await fetch(`${API_URL}/admin/retrain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to retrain model');
  return response.json();
}