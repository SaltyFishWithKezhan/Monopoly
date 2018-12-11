"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const id_manager_1 = require("./id-manager");
class Model {
    constructor(id) {
        this.id = id ? id : id_manager_1.idManager.generate();
    }
}
exports.Model = Model;
//# sourceMappingURL=model.js.map