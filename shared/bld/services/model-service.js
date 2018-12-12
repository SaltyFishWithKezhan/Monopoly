"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
exports.modelConstructorMap = {
    player: models_1.Player,
};
class ModelService {
    constructor() {
        this.modelMaps = {
            player: new Map(),
        };
    }
    getModelById(type, id) {
        if (!(type in this.modelMaps)) {
            throw new Error(`Model type '${type}' is unknown`);
        }
        let map = this.modelMaps[type];
        return map.get(id);
    }
    addModel(type, model) {
        if (!(type in this.modelMaps)) {
            throw new Error(`Model type '${type}' is unknown`);
        }
        let map = this.modelMaps[type];
        map.set(model.id, model);
    }
    createModelFromTransfer(type, transferModel) {
        let model = unpackModel(type, transferModel);
        this.addModel(type, model);
        return model;
    }
    removeModel(type, id) {
        if (!(type in this.modelMaps)) {
            throw new Error(`Model type '${type}' is unknown`);
        }
        let map = this.modelMaps[type];
        return map.delete(id);
    }
    hasModel(type, id) {
        if (!(type in this.modelMaps)) {
            throw new Error(`Model type '${type}' is unknown`);
        }
        let map = this.modelMaps[type];
        return map.has(id);
    }
}
exports.ModelService = ModelService;
function packModel(model) {
    let { id, data } = model;
    return { id, data };
}
exports.packModel = packModel;
function unpackModel(type, transferModel) {
    if (!(type in exports.modelConstructorMap)) {
        throw new Error(`Model type '${type}' is unknown`);
    }
    let modelConstructor = exports.modelConstructorMap[type];
    let { id, data } = transferModel;
    return new modelConstructor(id, data);
}
exports.unpackModel = unpackModel;
//# sourceMappingURL=model-service.js.map