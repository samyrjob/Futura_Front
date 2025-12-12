export interface RoomDTO {
  id?: number;
  roomId: string;
  roomName: string;
  ownerUsername: string;
  ownerId?: number;
  roomType: RoomType;
  description?: string;
  maxPlayers: number;
  currentPlayerCount: number;
  password?: string;
  width?: number;
  height?: number;
  createdAt?: string;
  lastVisited?: string;
}

export enum RoomType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  LOCKED = 'LOCKED'
}