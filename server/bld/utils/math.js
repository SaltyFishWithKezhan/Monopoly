"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}
exports.getRandomInt = getRandomInt;
//# sourceMappingURL=math.js.map