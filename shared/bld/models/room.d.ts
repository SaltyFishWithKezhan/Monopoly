import { Model } from '../core';
export interface RoomData {
    url: string;
    players: string[];
    owner: string | undefined;
    game: string | undefined;
}
export declare class Room extends Model {
    data: RoomData;
    setRoomURL(url: string): void;
    getRoomURL(): string;
    setGame(gameId: string): void;
    getGame(): string | undefined;
    getOwner(): string | undefined;
    setOwner(playerId: string): void;
    addPlayer(playerId: string): void;
    hasPlayer(playerId: string): boolean;
    isEmpty(): boolean;
    removePlayer(playerId: string): boolean;
    getPlayerIds(): string[];
}
