import {Model} from '../core';

export interface RoomData {
  url: string;
  players: string[];
  owner: string | undefined;
  game: string | undefined;
}

export class Room extends Model {
  data: RoomData = {
    url: '/',
    players: [],
    owner: undefined,
    game: undefined,
  };

  setRoomURL(url: string): void {
    this.data.url = url;
  }

  getRoomURL(): string {
    return this.data.url;
  }

  setGame(gameId: string): void {
    this.data.game = gameId;
  }

  getGame(): string | undefined {
    return this.data.game;
  }

  getOwner(): string | undefined {
    return this.data.owner;
  }

  setOwner(playerId: string): void {
    this.data.owner = playerId;
  }

  addPlayer(playerId: string): void {
    let {players} = this.data;

    if (players.length === 0) {
      this.data.owner = playerId;
    }

    this.data.players.push(playerId);
  }

  removePlayer(playerId: string): boolean {
    let index = this.data.players.indexOf(playerId);

    if (index < 0) {
      return false;
    }

    let {players} = this.data;

    players.splice(index, 1);

    if (this.data.owner === playerId) {
      this.data.owner = players.length > 0 ? players[0] : undefined;
    }

    return true;
  }

  getPlayerIds(): string[] {
    return this.data.players;
  }
}
