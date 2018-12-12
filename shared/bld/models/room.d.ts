import { Model } from '../core';
export interface RoomData {
    players: string[];
}
export declare class Room extends Model {
    data: RoomData;
    addPlayer(playerId: string): void;
    removePlayer(playerId: string): boolean;
    getPlayerIds(): string[];
}
