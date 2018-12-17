import {Model} from '../core';
import {
  Board,
  ConstructionLand,
  Game,
  GoLand,
  JailLand,
  ParkingLand,
  Player,
  Room,
} from '../models';

export type ModelMapValue<T> = T extends Map<string, infer R> ? R : never;

type Constructor<T> = new (...args: any[]) => T;

export const modelConstructorMap = {
  player: Player,
  room: Room,
  board: Board,
  game: Game,
  goLand: GoLand,
  constructionLand: ConstructionLand,
  jailLand: JailLand,
  parkingLand: ParkingLand,
};

export type GetClassTypeFromConstructor<T> = T extends Constructor<infer R>
  ? R
  : never;

export type ModelConstructorMap = typeof modelConstructorMap;

export type ModelMaps = {
  [K in keyof ModelConstructorMap]: Map<
    string,
    GetClassTypeFromConstructor<ModelConstructorMap[K]>
  >
};

export type ModelByMapKey<
  T extends keyof ModelConstructorMap
> = GetClassTypeFromConstructor<ModelConstructorMap[T]>;

export class ModelService {
  private modelMaps: ModelMaps = {
    player: new Map<string, Player>(),
    room: new Map<string, Room>(),
    board: new Map<string, Board>(),
    game: new Map<string, Game>(),
    goLand: new Map<string, GoLand>(),
    constructionLand: new Map<string, ConstructionLand>(),
    jailLand: new Map<string, JailLand>(),
    parkingLand: new Map<string, ParkingLand>(),
  };

  getModelById<T extends keyof ModelMaps>(
    type: T,
    id: string,
  ): ModelMapValue<ModelMaps[T]> | undefined {
    if (!(type in this.modelMaps)) {
      throw new Error(`Model type '${type}' is unknown`);
    }

    let map = this.modelMaps[type];

    return map.get(id) as ModelMapValue<ModelMaps[T]> | undefined;
  }

  getModelsByIds<T extends keyof ModelMaps>(
    type: T,
    ids: string[],
  ): ModelMapValue<ModelMaps[T]>[] {
    let result: ModelMapValue<ModelMaps[T]>[] = [];

    for (let id of ids) {
      let model = this.getModelById(type, id);

      if (!model) {
        continue;
      }

      result.push(model);
    }

    return result;
  }

  addModel<T extends keyof ModelMaps>(type: T, model: ModelByMapKey<T>): void {
    if (!(type in this.modelMaps)) {
      throw new Error(`Model type '${type}' is unknown`);
    }

    let map = this.modelMaps[type] as Map<string, Model>;

    map.set(model.id, model as any);
  }

  createModelFromTransfer<T extends keyof ModelMaps>(
    type: T,
    transferModel: TransferModel<T>,
  ): ModelByMapKey<T> {
    let model = unpackModel(type, transferModel);
    this.addModel(type, model as any);

    return model;
  }

  createModelsFromTransfers<T extends keyof ModelMaps>(
    type: T,
    transferModels: TransferModel<T>[],
  ): ModelByMapKey<T>[] {
    let result: ModelByMapKey<T>[] = [];

    for (let transfer of transferModels) {
      let model = this.createModelFromTransfer(type, transfer);

      result.push(model);
    }

    return result;
  }

  updateModel<T extends keyof ModelMaps>(
    type: T,
    model: ModelByMapKey<T>,
  ): void {
    this.addModel(type, model);
  }

  updateModelFromTransfer<T extends keyof ModelMaps>(
    type: T,
    transferModel: TransferModel<T>,
  ): ModelByMapKey<T> {
    let model = unpackModel(type, transferModel);

    this.updateModel<T>(type, model);

    return model;
  }

  removeModel<T extends keyof ModelMaps>(type: T, id: string): boolean {
    if (!(type in this.modelMaps)) {
      throw new Error(`Model type '${type}' is unknown`);
    }

    let map = this.modelMaps[type];

    return map.delete(id);
  }

  hasModel<T extends keyof ModelMaps>(type: T, id: string): boolean {
    if (!(type in this.modelMaps)) {
      throw new Error(`Model type '${type}' is unknown`);
    }

    let map = this.modelMaps[type];

    return map.has(id);
  }
}

export interface TransferModel<T extends keyof ModelMaps> {
  id: string;
  data: ModelMapValue<ModelMaps[T]>['data'];
}

export function packModel<T extends keyof ModelMaps>(
  model: ModelMapValue<ModelMaps[T]>,
): TransferModel<T> {
  let {id, data} = model;

  return {id, data};
}

export function packModels<T extends keyof ModelMaps>(
  models: ModelMapValue<ModelMaps[T]>[],
): TransferModel<T>[] {
  let result: TransferModel<T>[] = [];

  for (let model of models) {
    let {id, data} = model;

    result.push({id, data});
  }

  return result;
}

export function unpackModel<T extends keyof ModelMaps>(
  type: T,
  transferModel: TransferModel<T>,
): ModelByMapKey<T> {
  if (!(type in modelConstructorMap)) {
    throw new Error(`Model type '${type}' is unknown`);
  }

  let modelConstructor = modelConstructorMap[type] as Constructor<
    ModelByMapKey<T>
  >;

  let {id, data} = transferModel;

  let model = new modelConstructor(id, data);

  model.data = data;
  return model;
}

export function unpackModels<T extends keyof ModelMaps>(
  type: T,
  transferModels: TransferModel<T>[],
): ModelByMapKey<T>[] {
  let result: ModelByMapKey<T>[] = [];

  for (let transfer of transferModels) {
    let model = unpackModel(type, transfer);

    result.push(model);
  }

  return result;
}
