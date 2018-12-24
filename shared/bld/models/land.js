"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
var LandType;
(function (LandType) {
    LandType[LandType["go"] = 0] = "go";
    LandType[LandType["construction"] = 1] = "construction";
    LandType[LandType["jail"] = 2] = "jail";
    LandType[LandType["parking"] = 3] = "parking";
})(LandType = exports.LandType || (exports.LandType = {}));
class Land extends core_1.Model {
    constructor() {
        super(...arguments);
        this.data = {
            type: LandType.go,
        };
    }
    getLandInfo() {
        return {
            id: this.id,
            type: this.data.type,
        };
    }
    getType() {
        return this.data.type;
    }
}
exports.Land = Land;
class GoLand extends Land {
    constructor() {
        super(...arguments);
        this.data = {
            type: LandType.go,
            salary: 30,
        };
    }
}
exports.GoLand = GoLand;
class ConstructionLand extends Land {
    constructor() {
        super(...arguments);
        this.data = {
            type: LandType.construction,
            owner: undefined,
            level: 0,
            landPrice: 100,
            upgradePrice: 100,
            rentPrice: 50,
        };
    }
    setOwner(playerId) {
        this.data.owner = playerId;
    }
    getOwner() {
        return this.data.owner;
    }
    getPrice() {
        if (this.data.owner) {
            return Math.ceil(this.data.landPrice * 1.1);
        }
        return Math.ceil(this.data.landPrice);
    }
    getRentPrice() {
        return Math.ceil(this.data.rentPrice);
    }
    getUpgradePrice() {
        return Math.ceil(this.data.upgradePrice);
    }
    setPrice(amount) {
        this.data.landPrice = amount;
    }
    getLevel() {
        return this.data.level;
    }
    upgrade() {
        if (this.data.level > 2) {
            return false;
        }
        this.data.level++;
        switch (this.data.level) {
            case 1:
                this.data.landPrice = 250;
                this.data.upgradePrice = 100;
                this.data.rentPrice = 75;
                break;
            case 2:
                this.data.landPrice = 400;
                this.data.upgradePrice = 150;
                this.data.rentPrice = 100;
                break;
        }
        return true;
    }
}
exports.ConstructionLand = ConstructionLand;
class JailLand extends Land {
    constructor() {
        super(...arguments);
        this.data = {
            type: LandType.jail,
            bailPrice: 20,
        };
    }
    getBailPrice() {
        return Math.ceil(this.data.bailPrice);
    }
}
exports.JailLand = JailLand;
class ParkingLand extends Land {
    constructor() {
        super(...arguments);
        this.data = {
            type: LandType.parking,
        };
    }
}
exports.ParkingLand = ParkingLand;
function LandTypeToModelTypeKey(landType) {
    switch (landType) {
        case LandType.go:
            return 'goLand';
        case LandType.construction:
            return 'constructionLand';
        case LandType.jail:
            return 'jailLand';
        case LandType.parking:
            return 'parkingLand';
    }
}
exports.LandTypeToModelTypeKey = LandTypeToModelTypeKey;
function isGoLand(land) {
    return land.getType() === LandType.go;
}
exports.isGoLand = isGoLand;
function isConstructionLand(land) {
    return land.getType() === LandType.construction;
}
exports.isConstructionLand = isConstructionLand;
function isJailLand(land) {
    return land.getType() === LandType.jail;
}
exports.isJailLand = isJailLand;
function isParkingLand(land) {
    return land.getType() === LandType.parking;
}
exports.isParkingLand = isParkingLand;
//# sourceMappingURL=land.js.map