"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const land_1 = require("./land");
exports.LUCKY_CARD_COST_POINT = 100;
class Player extends core_1.Model {
    constructor() {
        super(...arguments);
        this.data = {
            money: 2000,
            landType: land_1.LandType.go,
            landId: '',
            jailTime: 0,
            luckyCardCount: 0,
            point: 0,
        };
    }
    setLand({ id, type }) {
        this.data.landId = id;
        this.data.landType = type;
    }
    getLand() {
        let { landId: id, landType: type } = this.data;
        return { id, type };
    }
    increaseMoney(amount) {
        this.data.money += amount;
    }
    decreaseMoney(amount) {
        this.data.money -= amount;
    }
    getMoney() {
        return this.data.money;
    }
    isBroke() {
        return this.data.money <= 0;
    }
    getPoint() {
        return this.data.point;
    }
    increasePoint(amount) {
        this.data.point += amount;
    }
    decreasePoint(amount) {
        this.data.point -= amount;
    }
    buyLuckyCard(num) {
        let cost = num * exports.LUCKY_CARD_COST_POINT;
        if (this.getPoint() < cost) {
            return;
        }
        this.decreasePoint(cost);
        this.data.luckyCardCount++;
    }
    getLuckyCardCount() {
        return this.data.luckyCardCount;
    }
    hasLuckyCard() {
        return this.data.luckyCardCount > 0;
    }
    useLuckyCard() {
        this.data.luckyCardCount--;
    }
    putIntoJail() {
        this.data.jailTime = 1;
    }
    getJailTime() {
        return this.data.jailTime;
    }
    serveJailTime() {
        return --this.data.jailTime;
    }
    bail(price) {
        this.decreaseMoney(price);
        this.data.jailTime = 0;
    }
    isInJail() {
        return this.data.jailTime > 0;
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map