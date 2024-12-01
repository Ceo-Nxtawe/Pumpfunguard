import { toast } from 'sonner';
import { Token } from '@/types/token';

type MessageHandler = (data: any) => void;

export class PumpFunWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageHandlers: Map<string, MessageHandler> = new Map();
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket('wss://rpc.api-pump.fun/ws');

      this.ws.onopen = () => {
        console.log('Connected to PumpFun WebSocket');
        this.subscribeToFeeds();
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.handleReconnect();
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.handleReconnect();
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.handleReconnect();
    }
  }

  private subscribeToFeeds() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        method: "subscribeNewPools",
        params: []
      }));

      this.ws.send(JSON.stringify({
        method: "subscribeTrades",
        params: []
      }));

      this.ws.send(JSON.stringify({
        method: "subscribePublications",
        params: []
      }));
    }
  }

  public onNewToken(handler: (token: Token) => void) {
    this.messageHandlers.set('newPool', handler);
  }

  public onTrade(handler: MessageHandler) {
    this.messageHandlers.set('trade', handler);
  }

  public onPublication(handler: MessageHandler) {
    this.messageHandlers.set('publication', handler);
  }

  private handleMessage(data: any) {
    try {
      const handler = this.messageHandlers.get(data.type);
      if (handler) {
        handler(data);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  private handleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      this.reconnectTimeout = setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      toast.error('Failed to connect to PumpFun service. Please refresh the page.');
    }
  }

  public disconnect() {
    this.messageHandlers.clear();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const pumpFunWs = new PumpFunWebSocket();