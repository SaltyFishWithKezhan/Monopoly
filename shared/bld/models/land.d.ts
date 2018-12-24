import { Model } from '../core';
export interface LandInfo {
    type: LandType;
    id: string;
}
export declare enum LandType {
    go = 0,
    construction = 1,
    jail = 2,
    parking = 3
}
export interface LandData {
    type: LandType;
}
export declare abstract class Land extends Model<LandData> {
    data: LandData;
    getLandInfo(): LandInfo;
    getType(): LandType;
}
export interface GoLandData extends LandData {
    salary: number;
}
export declare class GoLand extends Land {
    data: GoLandData;
}
export declare type ConstructionLandLevel = 0 | 1 | 2;
export interface ConstructionLandData extends LandData {
    owner: string | undefined;
    level: ConstructionLandLevel;
    landPrice: number;
    upgradePrice: number;
    rentPrice: number;
}
export declare class ConstructionLand extends Land {
    data: ConstructionLandData;
    setOwner(playerId: string): void;
    getOwner(): string | undefined;
    getPrice(): number;
    getRentPrice(): number;
    getUpgradePrice(): number;
    setPrice(amount: number): void;
    getLevel(): ConstructionLandLevel;
    upgrade(): boolean;
}
export interface JailLandData extends LandData {
    bailPrice: number;
}
export declare class JailLand extends Land {
    data: JailLandData;
    getBailPrice(): number;
}
export interface ParkingLandData extends LandData {
}
export declare class ParkingLand extends Land {
    data: ParkingLandData;
}
export declare type LandModelTypeKey = 'goLand' | 'constructionLand' | 'jailLand' | 'parkingLand';
export declare function LandTypeToModelTypeKey(landType: LandType): LandModelTypeKey;
export declare function isGoLand(land: Land): land is GoLand;
export declare function isConstructionLand(land: Land): land is ConstructionLand;
export declare function isJailLand(land: Land): land is JailLand;
export declare function isParkingLand(land: Land): land is ParkingLand;
export declare type ConstructionLandArrivalOperation = 'rent' | 'buy' | 'upgrade';
