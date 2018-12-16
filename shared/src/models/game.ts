import {Model} from '../core';

import {Board} from './board';

enum GameState {
  WAIT_FOR_ROLL = 0,
  WAIT_FOR_DECISION = 1,
  GAME_ENDED = 2,
}

export interface GameData {
  gameId: number;
  playerNum: number;
  players: string[];
  gameState: GameState;
  board: Board;
  currentPlayerIndex: number;
}

export class Game extends Model {
  data: GameData = {
    gameId: 0,
    playerNum: 0,
    players: [],
    gameState: GameState.WAIT_FOR_ROLL,
    board: new Board(),
    currentPlayerIndex: 0,
  };

  constructor() {
    super();
  }

  setPlayer(players: string[]): void {
    this.data.players = players;
  }

  getCurrentPlayer(): string {
    return this.data.players[this.data.currentPlayerIndex];
  }
}
