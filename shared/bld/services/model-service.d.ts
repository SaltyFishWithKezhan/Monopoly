import { Board, ConstructionLand, Game, GoLand, JailLand, ParkingLand, Player, Room } from '../models';
export declare type ModelMapValue<T> = T extends Map<string, infer R> ? R : never;
declare type Constructor<T> = new (...args: any[]) => T;
export declare const modelConstructorMap: {
    player: typeof Player;
    room: typeof Room;
    board: typeof Board;
    game: typeof Game;
    goLand: typeof GoLand;
    constructionLand: typeof ConstructionLand;
    jailLand: typeof JailLand;
    parkingLand: typeof ParkingLand;
};
export declare type GetClassTypeFromConstructor<T> = T extends Constructor<infer R> ? R : never;
export declare type ModelConstructorMap = typeof modelConstructorMap;
export declare type ModelMaps = {
    [K in keyof ModelConstructorMap]: Map<string, GetClassTypeFromConstructor<ModelConstructorMap[K]>>;
};
export declare type ModelByMapKey<T extends keyof ModelConstructorMap> = GetClassTypeFromConstructor<ModelConstructorMap[T]>;
export declare class ModelService {
    private modelMaps;
    getModelById<T extends keyof ModelMaps>(type: T, id: string): ModelMapValue<ModelMaps[T]> | undefined;
    getModelsByIds<T extends keyof ModelMaps>(type: T, ids: string[]): ModelMapValue<ModelMaps[T]>[];
    addModel<T extends keyof ModelMaps>(type: T, model: ModelByMapKey<T>): void;
    createModelFromTransfer<T extends keyof ModelMaps>(type: T, transferModel: TransferModel<T>): ModelByMapKey<T>;
    createModelsFromTransfers<T extends keyof ModelMaps>(type: T, transferModels: TransferModel<T>[]): ModelByMapKey<T>[];
    updateModel<T extends keyof ModelMaps>(type: T, model: ModelByMapKey<T>): void;
    updateModelFromTransfer<T extends keyof ModelMaps>(type: T, transferModel: TransferModel<T>): ModelByMapKey<T>;
    updateModelFromTransfers<T extends keyof ModelMaps>(type: T, transferModels: TransferModel<T>[]): ModelByMapKey<T>[];
    removeModel<T extends keyof ModelMaps>(type: T, id: string): boolean;
    hasModel<T extends keyof ModelMaps>(type: T, id: string): boolean;
}
export interface TransferModel<T extends keyof ModelMaps> {
    id: string;
    data: ModelMapValue<ModelMaps[T]>['data'];
}
export declare function packModel<T extends keyof ModelMaps>(model: ModelMapValue<ModelMaps[T]>): TransferModel<T>;
export declare function packModels<T extends keyof ModelMaps>(models: ModelMapValue<ModelMaps[T]>[]): TransferModel<T>[];
export declare function unpackModel<T extends keyof ModelMaps>(type: T, transferModel: TransferModel<T>): ModelByMapKey<T>;
export declare function unpackModels<T extends keyof ModelMaps>(type: T, transferModels: TransferModel<T>[]): ModelByMapKey<T>[];
export {};
