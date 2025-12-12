import { Injectable, OnDestroy } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {

  private client: Client | null = null;
  private connectionStatus = new BehaviorSubject<boolean>(false);
  
  // Subjects for different topics
  private roomEvents = new Subject<any>();
  private subscriptions: Map<string, any> = new Map();

  constructor() {
    console.log('[WS SERVICE] Initialized');
  }

  // ═══════════════════════════════════════════════════════════
  // CONNECTION MANAGEMENT
  // ═══════════════════════════════════════════════════════════

  connect(): void {
    if (this.client?.connected) {
      console.log('[WS SERVICE] Already connected');
      return;
    }

    console.log('[WS SERVICE] Connecting to WebSocket...');

    this.client = new Client({
      // Use SockJS for browser compatibility
      webSocketFactory: () => new SockJS('http://localhost:9090/ws'),
      
      // Reconnect settings
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // Debug logging
      debug: (str) => {
        console.log('[STOMP] ' + str);
      },

      onConnect: () => {
        console.log('[WS SERVICE] ✅ Connected to WebSocket');
        this.connectionStatus.next(true);
        
        // Subscribe to room events
        this.subscribeToRooms();
      },

      onDisconnect: () => {
        console.log('[WS SERVICE] Disconnected from WebSocket');
        this.connectionStatus.next(false);
      },

      onStompError: (frame) => {
        console.error('[WS SERVICE] STOMP error:', frame.headers['message']);
        console.error('[WS SERVICE] Details:', frame.body);
      },

      onWebSocketError: (event) => {
        console.error('[WS SERVICE] WebSocket error:', event);
      }
    });

    this.client.activate();
  }

  disconnect(): void {
    if (this.client) {
      console.log('[WS SERVICE] Disconnecting...');
      this.client.deactivate();
      this.client = null;
      this.subscriptions.clear();
    }
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  // ═══════════════════════════════════════════════════════════
  // ROOM SUBSCRIPTIONS
  // ═══════════════════════════════════════════════════════════

  private subscribeToRooms(): void {
    if (!this.client?.connected) return;

    // Subscribe to global room events
    const subscription = this.client.subscribe('/topic/rooms', (message: IMessage) => {
      try {
        const event = JSON.parse(message.body);
        console.log('[WS SERVICE] 📩 Room event:', event.type, event);
        this.roomEvents.next(event);
      } catch (e) {
        console.error('[WS SERVICE] Failed to parse room event:', e);
      }
    });

    this.subscriptions.set('/topic/rooms', subscription);
    console.log('[WS SERVICE] Subscribed to /topic/rooms');
  }

  /**
   * Subscribe to a specific room's events
   */
  subscribeToRoom(roomId: string): Observable<any> {
    const topic = `/topic/room/${roomId}`;
    const subject = new Subject<any>();

    if (this.client?.connected) {
      const subscription = this.client.subscribe(topic, (message: IMessage) => {
        try {
          const event = JSON.parse(message.body);
          console.log(`[WS SERVICE] 📩 Room ${roomId} event:`, event.type);
          subject.next(event);
        } catch (e) {
          console.error('[WS SERVICE] Failed to parse room event:', e);
        }
      });

      this.subscriptions.set(topic, subscription);
      console.log(`[WS SERVICE] Subscribed to ${topic}`);
    }

    return subject.asObservable();
  }

  /**
   * Unsubscribe from a specific room
   */
  unsubscribeFromRoom(roomId: string): void {
    const topic = `/topic/room/${roomId}`;
    const subscription = this.subscriptions.get(topic);
    
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
      console.log(`[WS SERVICE] Unsubscribed from ${topic}`);
    }
  }

  /**
   * Get room events observable
   */
  getRoomEvents(): Observable<any> {
    return this.roomEvents.asObservable();
  }

  // ═══════════════════════════════════════════════════════════
  // SEND MESSAGES
  // ═══════════════════════════════════════════════════════════

  /**
   * Send a message to a destination
   */
  send(destination: string, body: any): void {
    if (!this.client?.connected) {
      console.error('[WS SERVICE] Not connected, cannot send message');
      return;
    }

    this.client.publish({
      destination: destination,
      body: JSON.stringify(body)
    });

    console.log('[WS SERVICE] 📤 Sent to', destination, body);
  }

  // ═══════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════

  ngOnDestroy(): void {
    this.disconnect();
  }
}