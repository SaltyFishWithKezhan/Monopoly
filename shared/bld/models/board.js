"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const land_1 = require("./land");
class Board extends core_1.Model {
    constructor() {
        super(...arguments);
        this.data = {
            lands: [],
        };
    }
    indexOfLand({ type: landType, id: landId }) {
        let index = -1;
        let candidate = 0;
        for (let info of this.data.lands) {
            let { type, id } = info;
            if (type === landType && id === landId) {
                index = candidate;
                break;
            }
            candidate++;
        }
        return index;
    }
    addLand({ type, id }) {
        let { lands } = this.data;
        if (this.indexOfLand({ type, id }) >= 0) {
            return false;
        }
        lands.push({ type, id });
        return true;
    }
    getLands() {
        return this.data.lands;
    }
    getLand(index) {
        let { lands } = this.data;
        if (index >= lands.length) {
            if (lands.length > 0) {
                return lands[index % lands.length];
            }
            else {
                return undefined;
            }
        }
        return lands[index];
    }
    getLandsByType(landType) {
        let result = [];
        let { lands } = this.data;
        for (let land of lands) {
            if (land.type === landType) {
                result.push(land);
            }
        }
        return result;
    }
    getLandIdsByType(landType) {
        let result = [];
        for (let { type, id } of this.data.lands) {
            if (type === landType) {
                result.push(id);
            }
        }
        return result;
    }
    getNextLand(info, step = 1) {
        let index = this.indexOfLand(info);
        if (index < 0) {
            return undefined;
        }
        return this.getLand(index + step);
    }
    findAJailLand() {
        let jailLands = this.getLandsByType(land_1.LandType.jail);
        if (!jailLands.length) {
            return undefined;
        }
        return jailLands[Math.floor(Math.random() * jailLands.length)];
    }
}
exports.Board = Board;
//# sourceMappingURL=board.js.map