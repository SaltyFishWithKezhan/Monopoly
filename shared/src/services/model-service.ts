import {Player, Room} from '../models';

export type ModelMapValue<T> = T extends Map<string, infer R> ? R : never;

type Constructor<T> = new (...args: any[]) => T;

export const modelConstructorMap = {
  player: Player,
  room: Room,
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

  addModel<T extends keyof ModelMaps>(
    type: T,
    model: ModelMapValue<ModelMaps[T]>,
  ): void {
    if (!(type in this.modelMaps)) {
      throw new Error(`Model type '${type}' is unknown`);
    }

    let map = this.modelMaps[type];

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

export function unpackModel<T extends keyof ModelMaps>(
  type: T,
  transferModel: TransferModel<T>,
): ModelByMapKey<T> {
  if (!(type in modelConstructorMap)) {
    throw new Error(`Model type '${type}' is unknown`);
  }

  let modelConstructor = modelConstructorMap[type];

  let {id, data} = transferModel;

  return new modelConstructor(id, data) as ModelByMapKey<T>;
}
