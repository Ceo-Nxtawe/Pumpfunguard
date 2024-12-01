import { WEBSOCKET } from '../constants';
import { toast } from 'sonner';

export class WebSocketConnection {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private lastPongTime = 0;

  constructor(
    private readonly url: string,
    private readonly onOpen?: () => void,
    private readonly onMessage?: (data: any) => void,
    private readonly onError?: (error: Event) => void
  ) {}

  public connect(): void {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    this.cleanup();

    try {
      this.ws = new WebSocket(this.url);
      this.setupEventHandlers();
      this.setupPingPong();
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.handleReconnect();
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.lastPongTime = Date.now();
      this.onOpen?.();
    };

    this.ws.onmessage = (event) => {
      this.lastPongTime = Date.now();
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'pong') return;
        this.onMessage?.(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.onError?.(error);
      this.handleReconnect();
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
      this.handleReconnect();
    };
  }

  private setupPingPong(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        // Check if we haven't received a pong in a while
        if (Date.now() - this.lastPongTime > 30000) {
          console.warn('No pong received, reconnecting...');
          this.reconnect();
          return;
        }

        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 15000);
  }

  private handleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts < WEBSOCKET.RECONNECT.MAX_ATTEMPTS) {
      this.reconnectAttempts++;
      const delay = Math.min(
        WEBSOCKET.RECONNECT.BASE_DELAY * Math.pow(2, this.reconnectAttempts),
        WEBSOCKET.RECONNECT.MAX_DELAY
      );

      this.reconnectTimeout = setTimeout(() => {
        console.log(`Reconnecting (${this.reconnectAttempts}/${WEBSOCKET.RECONNECT.MAX_ATTEMPTS})`);
        this.reconnect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      toast.error('Connection lost. Please refresh the page.');
    }
  }

  private reconnect(): void {
    this.cleanup();
    this.isConnecting = false;
    this.connect();
  }

  private cleanup(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
  }

  public send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', data);
    }
  }

  public disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.cleanup();
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }
}