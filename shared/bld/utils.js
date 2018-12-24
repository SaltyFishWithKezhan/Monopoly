"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function updatePlainObject(origin, source) {
    for (let key in source) {
        if (typeof source[key] === 'object') {
            if (!(key in origin) || typeof origin[key] !== 'object') {
                origin[key] = {};
            }
            updatePlainObject(origin[key], source[key]);
        }
        else {
            origin[key] = source[key];
        }
    }
}
exports.updatePlainObject = updatePlainObject;
//# sourceMappingURL=utils.js.map