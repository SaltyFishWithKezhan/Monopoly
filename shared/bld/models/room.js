"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
class Room extends core_1.Model {
    constructor() {
        super(...arguments);
        this.data = {
            players: [],
        };
    }
    addPlayer(playerId) {
        this.data.players.push(playerId);
    }
    removePlayer(playerId) {
        let index = this.data.players.indexOf(playerId);
        if (index < 0) {
            return false;
        }
        this.data.players.splice(index, 1);
        return true;
    }
    getPlayerIds() {
        return this.data.players;
    }
}
exports.Room = Room;
//# sourceMappingURL=room.js.map