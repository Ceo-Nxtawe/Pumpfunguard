import { useEffect } from 'react';
import { pumpFunWs } from '@/lib/websocket';
import { useTokens } from '@/context/token-context';
import { toast } from 'sonner';

export function useWebSocket() {
  const { addToken } = useTokens();

  useEffect(() => {
    pumpFunWs.onNewToken((data) => {
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

    pumpFunWs.onTrade((data) => {
      console.log('Trade:', data);
    });

    pumpFunWs.onPublication((data) => {
      console.log('Publication:', data);
    });

    return () => {
      pumpFunWs.disconnect();
    };
  }, [addToken]);
}