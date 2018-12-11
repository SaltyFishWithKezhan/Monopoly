import {Player} from '../models';

export type ModelMapValue<T> = T extends Map<string, infer R> ? R : never;

export interface ModelMaps {
  player: Map<string, Player>;
}

export class ModelService {
  private modelMaps: ModelMaps = {
    player: new Map<string, Player>(),
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

    map.set(model.id, model);
  }
}
