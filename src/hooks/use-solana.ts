import { useEffect, useCallback } from 'react';
import { solanaService } from '@/lib/solana';
import { useTokens } from '@/context/token-context';
import { useToast } from '@/hooks/use-toast';

export function useSolana() {
  const { addToken } = useTokens();
  const { toast } = useToast();

  const handleNewToken = useCallback((tokenData: any) => {
    toast({
      title: 'New Token Detected',
      description: `${tokenData.name} (${tokenData.address.slice(0, 6)}...${tokenData.address.slice(-4)})`,
    });
    
    addToken(tokenData);
  }, [addToken, toast]);

  useEffect(() => {
    solanaService.subscribeToNewTokens(handleNewToken);

    return () => {
      solanaService.unsubscribeFromNewTokens();
    };
  }, [handleNewToken]);

  return {
    getTokenMetadata: solanaService.getTokenMetadata,
  };
}