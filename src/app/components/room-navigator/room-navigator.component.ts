import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RoomDTO, RoomType } from '../../model/RoomDTO';
import { RoomService } from '../../services/room.service';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-room-navigator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-navigator.component.html',
  styleUrls: ['./room-navigator.component.css']
})
export class RoomNavigatorComponent implements OnInit, OnDestroy {

  // UI State
  isVisible = false;
  currentTab: 'public' | 'my' | 'favorites' = 'public';
  isLoading = false;
  isConnected = false;

  // Room data
  publicRooms: RoomDTO[] = [];
  myRooms: RoomDTO[] = [];

  // Create room
  showCreateModal = false;
  newRoomName = '';

  // Password entry
  showPasswordModal = false;
  passwordRoomId = '';
  passwordInput = '';

  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private roomService: RoomService,
    private wsService: WebSocketService
  ) {}

  ngOnInit(): void {
    // Subscribe to room lists
    this.subscriptions.push(
      this.roomService.getPublicRooms$().subscribe(rooms => {
        this.publicRooms = rooms;
      })
    );

    this.subscriptions.push(
      this.roomService.getMyRooms$().subscribe(rooms => {
        this.myRooms = rooms;
      })
    );

    // Subscribe to WebSocket connection status
    this.subscriptions.push(
      this.wsService.getConnectionStatus().subscribe(connected => {
        this.isConnected = connected;
        console.log('[ROOM NAV] WebSocket connected:', connected);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // ═══════════════════════════════════════════════════════════
  // VISIBILITY
  // ═══════════════════════════════════════════════════════════

  toggle(): void {
    this.isVisible = !this.isVisible;
    if (this.isVisible) {
      this.loadRooms();
    }
  }

  open(): void {
    this.isVisible = true;
    this.loadRooms();
  }

  close(): void {
    this.isVisible = false;
  }

  // ═══════════════════════════════════════════════════════════
  // TAB NAVIGATION
  // ═══════════════════════════════════════════════════════════

  setTab(tab: 'public' | 'my' | 'favorites'): void {
    this.currentTab = tab;
    this.loadRooms();
  }

  // ═══════════════════════════════════════════════════════════
  // LOAD ROOMS
  // ═══════════════════════════════════════════════════════════

  loadRooms(): void {
    this.isLoading = true;

    if (this.currentTab === 'public') {
      this.roomService.fetchPublicRooms().subscribe({
        next: () => this.isLoading = false,
        error: (err) => {
          console.error('[ROOM NAV] Failed to load public rooms:', err);
          this.isLoading = false;
        }
      });
    } else if (this.currentTab === 'my') {
      this.roomService.fetchMyRooms().subscribe({
        next: () => this.isLoading = false,
        error: (err) => {
          console.error('[ROOM NAV] Failed to load my rooms:', err);
          this.isLoading = false;
        }
      });
    }
  }

  get currentRooms(): RoomDTO[] {
    switch (this.currentTab) {
      case 'public':
        return this.publicRooms;
      case 'my':
        return this.myRooms;
      case 'favorites':
        return []; // TODO: Implement favorites
      default:
        return this.publicRooms;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // CREATE ROOM
  // ═══════════════════════════════════════════════════════════

  openCreateModal(): void {
    this.showCreateModal = true;
    this.newRoomName = '';
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newRoomName = '';
  }

  createRoom(): void {
    if (!this.newRoomName.trim()) {
      alert('Please enter a room name');
      return;
    }

    this.roomService.createRoom(this.newRoomName.trim()).subscribe({
      next: (room) => {
        console.log('[ROOM NAV] Room created:', room.roomName);
        this.closeCreateModal();
        this.setTab('my'); // Switch to My Rooms tab
      },
      error: (err) => {
        console.error('[ROOM NAV] Failed to create room:', err);
        alert('Failed to create room. Please try again.');
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // ENTER ROOM
  // ═══════════════════════════════════════════════════════════

  enterRoom(room: RoomDTO): void {
    if (room.roomType === 'LOCKED') {
      this.passwordRoomId = room.roomId;
      this.passwordInput = '';
      this.showPasswordModal = true;
      return;
    }

    this.roomService.enterRoom(room.roomId).subscribe({
      next: (response) => {
        console.log('[ROOM NAV] Entered room:', room.roomName);
        this.close();
        // TODO: Navigate to game view or emit event
      },
      error: (err) => {
        console.error('[ROOM NAV] Failed to enter room:', err);
        alert('Cannot enter this room');
      }
    });
  }

  submitPassword(): void {
    if (!this.passwordInput) {
      alert('Please enter the password');
      return;
    }

    this.roomService.enterRoomWithPassword(this.passwordRoomId, this.passwordInput).subscribe({
      next: (response) => {
        console.log('[ROOM NAV] Entered locked room');
        this.showPasswordModal = false;
        this.close();
      },
      error: (err) => {
        console.error('[ROOM NAV] Wrong password:', err);
        alert('Wrong password!');
        this.passwordInput = '';
      }
    });
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.passwordInput = '';
    this.passwordRoomId = '';
  }

  // ═══════════════════════════════════════════════════════════
  // DELETE ROOM
  // ═══════════════════════════════════════════════════════════

  deleteRoom(room: RoomDTO, event: Event): void {
    event.stopPropagation();

    if (!confirm(`Delete room "${room.roomName}"?`)) {
      return;
    }

    this.roomService.deleteRoom(room.roomId).subscribe({
      next: () => {
        console.log('[ROOM NAV] Room deleted:', room.roomName);
      },
      error: (err) => {
        console.error('[ROOM NAV] Failed to delete room:', err);
        alert('Failed to delete room');
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════

  getRoomTypeIcon(type: string): string {
    switch (type) {
      case 'PUBLIC':
        return '🌐';
      case 'PRIVATE':
        return '🔒';
      case 'LOCKED':
        return '🔑';
      default:
        return '🏠';
    }
  }
}