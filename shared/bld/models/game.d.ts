import { Model } from '../core';
export interface GameData {
    players: string[];
    board: string | undefined;
    currentPlayerIndex: number;
}
export declare class Game extends Model {
    data: GameData;
    setBoard(boardId: string): void;
    getBoard(): string | undefined;
    setPlayers(playerIds: string[]): void;
    addPlayer(playerId: string): boolean;
    removePlayer(playerId: string): boolean;
    getCurrentPlayerId(): string | undefined;
    moveOnToNextPlayer(): string | undefined;
}
