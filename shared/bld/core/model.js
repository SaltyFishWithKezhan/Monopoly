"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const id_manager_1 = require("./id-manager");
class Model {
    constructor(id, data) {
        this.id = id ? id : id_manager_1.idManager.generate();
        this.data = data ? data : {};
    }
}
exports.Model = Model;
//# sourceMappingURL=model.js.map