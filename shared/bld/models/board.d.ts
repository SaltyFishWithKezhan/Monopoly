import { Model } from '../core';
import { LandInfo, LandType } from './land';
export interface BoardData {
    lands: LandInfo[];
}
export declare class Board extends Model {
    data: BoardData;
    indexOfLand({ type: landType, id: landId }: LandInfo): number;
    addLand({ type, id }: LandInfo): boolean;
    getLands(): LandInfo[];
    getLand(index: number): LandInfo | undefined;
    getLandsByType(landType: LandType): LandInfo[];
    getLandIdsByType(landType: LandType): string[];
    getNextLand(info: LandInfo, step?: number): LandInfo | undefined;
    findAJailLand(): LandInfo | undefined;
}
