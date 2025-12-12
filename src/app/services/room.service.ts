import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RoomDTO, RoomType } from '../model/RoomDTO';
import { RoomEventDTO, RoomEventType } from '../model/RoomEVENTDTO'
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService implements OnDestroy {

  private apiUrl = 'http://localhost:9090/api/rooms';
  
  // Room state
  private publicRooms = new BehaviorSubject<RoomDTO[]>([]);
  private myRooms = new BehaviorSubject<RoomDTO[]>([]);
  private currentRoom = new BehaviorSubject<RoomDTO | null>(null);
  
  // Subscriptions
  private wsSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private wsService: WebSocketService
  ) {
    console.log('[ROOM SERVICE] Initialized');
    
    // Connect to WebSocket and subscribe to events
    this.initializeWebSocket();
  }

  // ═══════════════════════════════════════════════════════════
  // WEBSOCKET INITIALIZATION
  // ═══════════════════════════════════════════════════════════

  private initializeWebSocket(): void {
    // Connect to WebSocket
    this.wsService.connect();

    // Subscribe to room events
    this.wsSubscription = this.wsService.getRoomEvents().subscribe(
      (event: RoomEventDTO) => this.handleRoomEvent(event)
    );
  }

  private handleRoomEvent(event: RoomEventDTO): void {
    console.log('[ROOM SERVICE] 📩 Handling event:', event.type);

    switch (event.type) {
      case RoomEventType.ROOM_CREATED:
        if (event.room) {
          this.addRoomToList(event.room);
        }
        break;

      case RoomEventType.ROOM_DELETED:
        if (event.roomId) {
          this.removeRoomFromList(event.roomId);
        }
        break;

      case RoomEventType.ROOM_UPDATED:
        if (event.room) {
          this.updateRoomInList(event.room);
        }
        break;

      case RoomEventType.USER_JOINED:
      case RoomEventType.USER_LEFT:
        if (event.roomId && event.playerCount !== undefined) {
          this.updateRoomPlayerCount(event.roomId, event.playerCount);
        }
        break;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // STATE UPDATES
  // ═══════════════════════════════════════════════════════════

  private addRoomToList(room: RoomDTO): void {
    const currentPublic = this.publicRooms.value;
    
    // Add to public rooms if it's public
    if (room.roomType === 'PUBLIC') {
      // Check if already exists
      if (!currentPublic.find(r => r.roomId === room.roomId)) {
        this.publicRooms.next([room, ...currentPublic]);
        console.log('[ROOM SERVICE] ✅ Added new room to list:', room.roomName);
      }
    }
  }

  private removeRoomFromList(roomId: string): void {
    const currentPublic = this.publicRooms.value;
    const currentMy = this.myRooms.value;

    this.publicRooms.next(currentPublic.filter(r => r.roomId !== roomId));
    this.myRooms.next(currentMy.filter(r => r.roomId !== roomId));
    
    console.log('[ROOM SERVICE] 🗑️ Removed room from list:', roomId);
  }

  private updateRoomInList(updatedRoom: RoomDTO): void {
    const updateList = (rooms: RoomDTO[]) => 
      rooms.map(r => r.roomId === updatedRoom.roomId ? updatedRoom : r);

    this.publicRooms.next(updateList(this.publicRooms.value));
    this.myRooms.next(updateList(this.myRooms.value));
    
    console.log('[ROOM SERVICE] 🔄 Updated room:', updatedRoom.roomName);
  }

  private updateRoomPlayerCount(roomId: string, playerCount: number): void {
    const updateCount = (rooms: RoomDTO[]) =>
      rooms.map(r => r.roomId === roomId ? { ...r, currentPlayerCount: playerCount } : r);

    this.publicRooms.next(updateCount(this.publicRooms.value));
    this.myRooms.next(updateCount(this.myRooms.value));

    // Update current room if it's the one that changed
    const current = this.currentRoom.value;
    if (current?.roomId === roomId) {
      this.currentRoom.next({ ...current, currentPlayerCount: playerCount });
    }

    console.log('[ROOM SERVICE] 👥 Updated player count for', roomId, ':', playerCount);
  }

  // ═══════════════════════════════════════════════════════════
  // HTTP OPERATIONS
  // ═══════════════════════════════════════════════════════════

  /**
   * Fetch public rooms from server
   */
  fetchPublicRooms(): Observable<RoomDTO[]> {
    return this.http.get<RoomDTO[]>(`${this.apiUrl}/public`, { withCredentials: true })
      .pipe(
        tap(rooms => {
          this.publicRooms.next(rooms);
          console.log('[ROOM SERVICE] Fetched', rooms.length, 'public rooms');
        })
      );
  }

  /**
   * Fetch my rooms from server
   */
  fetchMyRooms(): Observable<RoomDTO[]> {
    return this.http.get<RoomDTO[]>(`${this.apiUrl}/my`, { withCredentials: true })
      .pipe(
        tap(rooms => {
          this.myRooms.next(rooms);
          console.log('[ROOM SERVICE] Fetched', rooms.length, 'my rooms');
        })
      );
  }

  /**
   * Get room by ID
   */
  getRoom(roomId: string): Observable<RoomDTO> {
    return this.http.get<RoomDTO>(`${this.apiUrl}/${roomId}`, { withCredentials: true });
  }

  /**
   * Search rooms
   */
  searchRooms(query: string): Observable<RoomDTO[]> {
    return this.http.get<RoomDTO[]>(`${this.apiUrl}/search`, {
      params: { query },
      withCredentials: true
    });
  }

  /**
   * Create a new room
   */
  createRoom(roomName: string): Observable<RoomDTO> {
    return this.http.post<RoomDTO>(`${this.apiUrl}/create`, { roomName }, { withCredentials: true })
      .pipe(
        tap(room => {
          console.log('[ROOM SERVICE] Created room:', room.roomName);
          // Room will be added via WebSocket event
        })
      );
  }

  /**
   * Delete a room
   */
  deleteRoom(roomId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${roomId}`, { withCredentials: true })
      .pipe(
        tap(() => {
          console.log('[ROOM SERVICE] Deleted room:', roomId);
          // Room will be removed via WebSocket event
        })
      );
  }

  /**
   * Enter a room
   */
  enterRoom(roomId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${roomId}/enter`, {}, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.room) {
            this.currentRoom.next(response.room);
          }
          console.log('[ROOM SERVICE] Entered room:', roomId);
        })
      );
  }

  /**
   * Enter a locked room with password
   */
  enterRoomWithPassword(roomId: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${roomId}/enter-password`, { password }, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.room) {
            this.currentRoom.next(response.room);
          }
          console.log('[ROOM SERVICE] Entered locked room:', roomId);
        })
      );
  }

  /**
   * Leave a room
   */
  leaveRoom(roomId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${roomId}/leave`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentRoom.next(null);
          console.log('[ROOM SERVICE] Left room:', roomId);
        })
      );
  }

  /**
   * Update room settings
   */
  updateRoom(roomId: string, settings: { roomName?: string; roomType?: string; password?: string }): Observable<RoomDTO> {
    return this.http.put<RoomDTO>(`${this.apiUrl}/${roomId}`, settings, { withCredentials: true });
  }

  /**
   * Get users in a room
   */
  getUsersInRoom(roomId: string): Observable<{ users: string[]; count: number }> {
    return this.http.get<{ users: string[]; count: number }>(`${this.apiUrl}/${roomId}/users`, { withCredentials: true });
  }

  // ═══════════════════════════════════════════════════════════
  // OBSERVABLES (for components to subscribe)
  // ═══════════════════════════════════════════════════════════

  getPublicRooms$(): Observable<RoomDTO[]> {
    return this.publicRooms.asObservable();
  }

  getMyRooms$(): Observable<RoomDTO[]> {
    return this.myRooms.asObservable();
  }

  getCurrentRoom$(): Observable<RoomDTO | null> {
    return this.currentRoom.asObservable();
  }

  // ═══════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════

  ngOnDestroy(): void {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    this.wsService.disconnect();
  }
}