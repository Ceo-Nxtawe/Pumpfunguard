import { createContext, useContext, useState, useEffect } from 'react';
import { Token } from '@/types/token';
import { fetchTokens, searchTokens } from '@/lib/api';

interface TokenContextType {
  tokens: Token[];
  loading: boolean;
  error: string | null;
  searchTokens: (query: string) => void;
  addToken: (token: Token) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      setLoading(true);
      const response = await fetchTokens();
      setTokens(response.tokens);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      const results = await searchTokens(query);
      setTokens(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search tokens');
    } finally {
      setLoading(false);
    }
  };

  const addToken = (token: Token) => {
    setTokens(prev => [token, ...prev]);
  };

  return (
    <TokenContext.Provider value={{ 
      tokens, 
      loading, 
      error, 
      searchTokens: handleSearch,
      addToken 
    }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useTokens() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
}