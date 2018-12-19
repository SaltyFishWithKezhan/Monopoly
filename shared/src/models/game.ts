import {Model} from '../core';

export interface GameData {
  players: string[];
  board: string | undefined;
  currentPlayerIndex: number;
}

export class Game extends Model {
  data: GameData = {
    players: [],
    board: undefined,
    currentPlayerIndex: 0,
  };

  setBoard(boardId: string): void {
    this.data.board = boardId;
  }

  getBoard(): string | undefined {
    return this.data.board;
  }

  setPlayers(playerIds: string[]): void {
    this.data.players = playerIds;
  }

  addPlayer(playerId: string): boolean {
    if (this.data.players.includes(playerId)) {
      return false;
    }

    this.data.players.push(playerId);
    return true;
  }

  removePlayer(playerId: string): boolean {
    let {players} = this.data;

    if (!players.includes(playerId)) {
      return false;
    }

    let currentPlayerId = this.getCurrentPlayerId();

    if (currentPlayerId && currentPlayerId === playerId) {
    }

    let index = players.indexOf(playerId);

    players.splice(index, 1);

    return true;
  }

  getCurrentPlayerId(): string | undefined {
    let {players} = this.data;

    if (this.data.currentPlayerIndex >= players.length) {
      return undefined;
    }

    return this.data.players[this.data.currentPlayerIndex];
  }

  moveOnToNextPlayer(): string | undefined {
    let {players} = this.data;

    this.data.currentPlayerIndex++;

    if (this.data.currentPlayerIndex >= players.length) {
      this.data.currentPlayerIndex = 0;
    }

    return this.getCurrentPlayerId();
  }
}
