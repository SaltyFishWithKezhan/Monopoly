"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
class Room extends core_1.Model {
    constructor() {
        super(...arguments);
        this.data = {
            url: '/',
            players: [],
            owner: undefined,
            game: undefined,
        };
    }
    setRoomURL(url) {
        this.data.url = url;
    }
    getRoomURL() {
        return this.data.url;
    }
    setGame(gameId) {
        this.data.game = gameId;
    }
    getGame() {
        return this.data.game;
    }
    getOwner() {
        return this.data.owner;
    }
    setOwner(playerId) {
        this.data.owner = playerId;
    }
    addPlayer(playerId) {
        let { players } = this.data;
        if (players.length === 0) {
            this.data.owner = playerId;
        }
        if (players.includes(playerId)) {
            return;
        }
        this.data.players.push(playerId);
    }
    hasPlayer(playerId) {
        let { players } = this.data;
        return players.includes(playerId);
    }
    isEmpty() {
        return this.data.players.length === 0;
    }
    removePlayer(playerId) {
        let index = this.data.players.indexOf(playerId);
        if (index < 0) {
            return false;
        }
        let { players } = this.data;
        players.splice(index, 1);
        if (this.data.owner === playerId) {
            this.data.owner = players.length > 0 ? players[0] : undefined;
        }
        return true;
    }
    getPlayerIds() {
        return this.data.players;
    }
}
exports.Room = Room;
//# sourceMappingURL=room.js.map