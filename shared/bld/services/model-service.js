"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
}
exports.ModelService = ModelService;
//# sourceMappingURL=model-service.js.map