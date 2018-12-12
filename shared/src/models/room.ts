import {Model} from '../core';

export interface RoomData {
  players: string[];
}

export class Room extends Model {
  data: RoomData = {
    players: [],
  };

  addPlayer(playerId: string): void {
    this.data.players.push(playerId);
  }

  removePlayer(playerId: string): boolean {
    let index = this.data.players.indexOf(playerId);

    if (index < 0) {
      return false;
    }

    this.data.players.splice(index, 1);

    return true;
  }

  getPlayerIds(): string[] {
    return this.data.players;
  }
}
