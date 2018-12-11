import { Player } from '../models';
export declare type ModelMapValue<T> = T extends Map<string, infer R> ? R : never;
declare type Constructor<T> = new (...args: any[]) => T;
export declare const modelConstructorMap: {
    player: typeof Player;
};
export declare type GetClassTypeFromConstructor<T> = T extends Constructor<infer R> ? R : never;
export declare type ModelConstructorMap = typeof modelConstructorMap;
export declare type ModelMaps = {
    [K in keyof ModelConstructorMap]: Map<string, GetClassTypeFromConstructor<ModelConstructorMap[K]>>;
};
export declare class ModelService {
    private modelMaps;
    getModelById<T extends keyof ModelMaps>(type: T, id: string): ModelMapValue<ModelMaps[T]> | undefined;
    addModel<T extends keyof ModelMaps>(type: T, model: ModelMapValue<ModelMaps[T]>): void;
    removeModel<T extends keyof ModelMaps>(type: T, id: string): boolean;
    hasModel<T extends keyof ModelMaps>(type: T, id: string): boolean;
}
export interface TransferModel<T extends keyof ModelMaps> {
    id: string;
    data: ModelMapValue<ModelMaps[T]>['data'];
}
export declare function packModel<T extends keyof ModelMaps>(model: ModelMapValue<ModelMaps[T]>): TransferModel<T>;
export declare function unpackModel<T extends keyof ModelMaps>(type: T, transferModel: TransferModel<T>): T;
export {};
