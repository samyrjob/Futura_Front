import { RoomDTO } from './RoomDTO';

export interface RoomEventDTO {
  type: RoomEventType;
  room?: RoomDTO;
  roomId?: string;
  roomName?: string;
  username?: string;
  playerCount?: number;
  timestamp: number;
}

export enum RoomEventType {
  ROOM_CREATED = 'ROOM_CREATED',
  ROOM_UPDATED = 'ROOM_UPDATED',
  ROOM_DELETED = 'ROOM_DELETED',
  USER_JOINED = 'USER_JOINED',
  USER_LEFT = 'USER_LEFT'
}
