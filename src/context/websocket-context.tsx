import { createContext, useContext, useEffect, ReactNode } from 'react';
import { pumpFunClient } from '@/lib/websocket/pump-fun-client';
import { useTokens } from '@/context/token-context';
import { toast } from 'sonner';

interface WebSocketContextType {
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { addToken } = useTokens();

  useEffect(() => {
    pumpFunClient.connect();

    pumpFunClient.onNewToken((data) => {
      const tokenData = {
        id: data.mint,
        name: data.name || 'Unknown Token',
        address: data.mint,
        marketCap: 0,
        riskScore: 0,
        priceHistory: [],
        lastUpdated: new Date().toISOString(),
        chain: 'solana' as const
      };

      addToken(tokenData);
      toast.success('New Token Detected', {
        description: `${tokenData.name} (${tokenData.address.slice(0, 6)}...${tokenData.address.slice(-4)})`
      });
    });

    pumpFunClient.onTrade((data) => {
      console.log('Trade:', data);
    });

    pumpFunClient.onPublication((data) => {
      console.log('Publication:', data);
    });

    return () => {
      pumpFunClient.disconnect();
    };
  }, [addToken]);

  return (
    <WebSocketContext.Provider value={{ isConnected: true }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}