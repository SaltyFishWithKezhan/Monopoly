"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IdManager {
    constructor() {
        this.maxId = 0;
    }
    generate() {
        return `model-${++this.maxId}`;
    }
}
exports.IdManager = IdManager;
exports.idManager = new IdManager();
//# sourceMappingURL=id-manager.js.map