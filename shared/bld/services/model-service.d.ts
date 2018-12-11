import { Player } from '../models';
export declare type ModelMapValue<T> = T extends Map<string, infer R> ? R : never;
export interface ModelMaps {
    player: Map<string, Player>;
}
export declare class ModelService {
    private modelMaps;
    getModelById<T extends keyof ModelMaps>(type: T, id: string): ModelMapValue<ModelMaps[T]> | undefined;
    addModel<T extends keyof ModelMaps>(type: T, model: ModelMapValue<ModelMaps[T]>): void;
}
