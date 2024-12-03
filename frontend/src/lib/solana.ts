import { Connection, PublicKey, AccountInfo } from '@solana/web3.js';
import { toast } from '@/components/ui/use-toast';

// Solana RPC endpoints
const MAINNET_RPC = 'https://api.mainnet-beta.solana.com';
const MAINNET_WSS = 'wss://api.mainnet-beta.solana.com';

// PumpFun WebSocket endpoint
const PUMPFUN_WSS = 'wss://api.pumpfun.com/v1/ws';

export class SolanaService {
  private connection: Connection;
  private pumpfunWs: WebSocket | null = null;
  private tokenCallback: ((token: any) => void) | null = null;

  constructor() {
    this.connection = new Connection(MAINNET_RPC, {
      wsEndpoint: MAINNET_WSS,
      commitment: 'confirmed'
    });
    this.initializePumpFunWebSocket();
  }

  private initializePumpFunWebSocket() {
    try {
      this.pumpfunWs = new WebSocket(PUMPFUN_WSS);

      this.pumpfunWs.onopen = () => {
        console.log('Connected to PumpFun WebSocket');
        this.subscribeToPumpFun();
      };

      this.pumpfunWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'new_token') {
          this.handleNewToken(data.token);
        }
      };

      this.pumpfunWs.onerror = (error) => {
        console.error('PumpFun WebSocket error:', error);
        toast({
          title: 'WebSocket Error',
          description: 'Failed to connect to PumpFun service',
          variant: 'destructive',
        });
      };
    } catch (error) {
      console.error('Failed to initialize PumpFun WebSocket:', error);
    }
  }

  private subscribeToPumpFun() {
    if (this.pumpfunWs?.readyState === WebSocket.OPEN) {
      this.pumpfunWs.send(JSON.stringify({
        type: 'subscribe',
        channel: 'new_tokens',
        chain: 'solana'
      }));
    }
  }

  private async handleNewToken(tokenData: any) {
    try {
      // Verify token on Solana
      const tokenInfo = await this.connection.getParsedAccountInfo(
        new PublicKey(tokenData.address)
      );

      if (tokenInfo.value) {
        // Notify callback with verified token data
        this.tokenCallback?.({
          ...tokenData,
          onChainData: tokenInfo.value.data,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error handling new token:', error);
    }
  }

  public subscribeToNewTokens(callback: (token: any) => void) {
    this.tokenCallback = callback;
  }

  public unsubscribeFromNewTokens() {
    this.tokenCallback = null;
    if (this.pumpfunWs) {
      this.pumpfunWs.close();
      this.pumpfunWs = null;
    }
  }

  public async getTokenMetadata(address: string) {
    try {
      const accountInfo = await this.connection.getParsedAccountInfo(
        new PublicKey(address)
      );
      return accountInfo.value?.data;
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return null;
    }
  }
}

export const solanaService = new SolanaService();