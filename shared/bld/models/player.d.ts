import { Model } from '../core';
import { LandInfo, LandType } from './land';
export interface PlayerData {
    money: number;
    landType: LandType;
    landId: string;
    jailTime: number;
}
export declare class Player extends Model {
    data: PlayerData;
    setLand({ id, type }: LandInfo): void;
    getLand(): LandInfo;
    increaseMoney(amount: number): void;
    decreaseMoney(amount: number): void;
    getMoney(): number;
    isBroke(): boolean;
    putIntoJail(): void;
    getJailTime(): number;
    serveJailTime(): number;
    bail(price: number): void;
    isInJail(): boolean;
}
