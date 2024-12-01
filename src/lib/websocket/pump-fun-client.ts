import { WebSocketConnection } from './connection';
import { WEBSOCKET } from '../constants';
import type { Token } from '@/types/token';

type MessageHandler = (data: any) => void;

export class PumpFunClient {
  private connection: WebSocketConnection;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private subscriptionQueue: Array<{ method: string; params: any[] }> = [];
  private isReady = false;

  constructor() {
    this.connection = new WebSocketConnection(
      WEBSOCKET.ENDPOINT,
      () => this.onConnectionOpen(),
      (data) => this.handleMessage(data),
      (error) => this.handleError(error)
    );
  }

  private onConnectionOpen(): void {
    this.isReady = true;
    this.processSubscriptionQueue();
    this.subscribeToFeeds();
  }

  private processSubscriptionQueue(): void {
    while (this.subscriptionQueue.length > 0) {
      const subscription = this.subscriptionQueue.shift();
      if (subscription) {
        this.connection.send(subscription);
      }
    }
  }

  private subscribeToFeeds(): void {
    Object.values(WEBSOCKET.METHODS).forEach(method => {
      const subscription = {
        method,
        params: []
      };

      if (this.isReady) {
        this.connection.send(subscription);
      } else {
        this.subscriptionQueue.push(subscription);
      }
    });
  }

  private handleError(error: Event): void {
    this.isReady = false;
    console.error('PumpFun WebSocket error:', error);
  }

  public connect(): void {
    this.connection.connect();
  }

  public disconnect(): void {
    this.isReady = false;
    this.messageHandlers.clear();
    this.subscriptionQueue = [];
    this.connection.disconnect();
  }

  public onNewToken(handler: (token: Token) => void): () => void {
    return this.addHandler('newPool', handler);
  }

  public onTrade(handler: MessageHandler): () => void {
    return this.addHandler('trade', handler);
  }

  public onPublication(handler: MessageHandler): () => void {
    return this.addHandler('publication', handler);
  }

  private addHandler(type: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    this.messageHandlers.get(type)?.add(handler);

    return () => {
      this.messageHandlers.get(type)?.delete(handler);
    };
  }

  private handleMessage(data: any): void {
    try {
      const handlers = this.messageHandlers.get(data.type);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(data);
          } catch (error) {
            console.error('Error in message handler:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }
}

export const pumpFunClient = new PumpFunClient();