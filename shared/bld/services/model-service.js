"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../utils");
exports.modelConstructorMap = {
    player: models_1.Player,
    room: models_1.Room,
    board: models_1.Board,
    game: models_1.Game,
    goLand: models_1.GoLand,
    constructionLand: models_1.ConstructionLand,
    jailLand: models_1.JailLand,
    parkingLand: models_1.ParkingLand,
};
class ModelService {
    constructor() {
        this.modelMaps = {
            player: new Map(),
            room: new Map(),
            board: new Map(),
            game: new Map(),
            goLand: new Map(),
            constructionLand: new Map(),
            jailLand: new Map(),
            parkingLand: new Map(),
        };
    }
    getModelById(type, id) {
        if (!(type in this.modelMaps)) {
            throw new Error(`Model type '${type}' is unknown`);
        }
        let map = this.modelMaps[type];
        return map.get(id);
    }
    getModelsByIds(type, ids) {
        let result = [];
        for (let id of ids) {
            let model = this.getModelById(type, id);
            if (!model) {
                continue;
            }
            result.push(model);
        }
        return result;
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
    createModelsFromTransfers(type, transferModels) {
        let result = [];
        for (let transfer of transferModels) {
            let model = this.createModelFromTransfer(type, transfer);
            result.push(model);
        }
        return result;
    }
    updateModel(type, model) {
        if (!(type in this.modelMaps)) {
            throw new Error(`Model type '${type}' is unknown`);
        }
        let map = this.modelMaps[type];
        if (!map.has(model.id)) {
            this.addModel(type, model);
        }
        else {
            let origin = map.get(model.id);
            utils_1.updatePlainObject(origin.data, model.data);
        }
    }
    updateModelFromTransfer(type, transferModel) {
        if (!(type in this.modelMaps)) {
            throw new Error(`Model type '${type}' is unknown`);
        }
        let map = this.modelMaps[type];
        let model = unpackModel(type, transferModel);
        this.updateModel(type, model);
        return map.get(model.id);
    }
    updateModelFromTransfers(type, transferModels) {
        let result = [];
        for (let transfer of transferModels) {
            let model = this.updateModelFromTransfer(type, transfer);
            result.push(model);
        }
        return result;
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
function packModels(models) {
    let result = [];
    for (let model of models) {
        let { id, data } = model;
        result.push({ id, data });
    }
    return result;
}
exports.packModels = packModels;
function unpackModel(type, transferModel) {
    if (!(type in exports.modelConstructorMap)) {
        throw new Error(`Model type '${type}' is unknown`);
    }
    let modelConstructor = exports.modelConstructorMap[type];
    let { id, data } = transferModel;
    let model = new modelConstructor(id, data);
    model.data = data;
    return model;
}
exports.unpackModel = unpackModel;
function unpackModels(type, transferModels) {
    let result = [];
    for (let transfer of transferModels) {
        let model = unpackModel(type, transfer);
        result.push(model);
    }
    return result;
}
exports.unpackModels = unpackModels;
//# sourceMappingURL=model-service.js.map