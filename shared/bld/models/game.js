"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
class Game extends core_1.Model {
    constructor() {
        super(...arguments);
        this.data = {
            players: [],
            board: undefined,
            currentPlayerIndex: 0,
        };
    }
    setBoard(boardId) {
        this.data.board = boardId;
    }
    getBoard() {
        return this.data.board;
    }
    setPlayers(playerIds) {
        this.data.players = playerIds;
    }
    addPlayer(playerId) {
        if (this.data.players.includes(playerId)) {
            return false;
        }
        this.data.players.push(playerId);
        return true;
    }
    removePlayer(playerId) {
        let { players } = this.data;
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
    getCurrentPlayerId() {
        let { players } = this.data;
        if (this.data.currentPlayerIndex >= players.length) {
            return undefined;
        }
        return this.data.players[this.data.currentPlayerIndex];
    }
    moveOnToNextPlayer() {
        let { players } = this.data;
        this.data.currentPlayerIndex++;
        if (this.data.currentPlayerIndex >= players.length) {
            this.data.currentPlayerIndex = 0;
        }
        return this.getCurrentPlayerId();
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map