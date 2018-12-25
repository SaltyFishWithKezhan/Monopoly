import { Model } from '../core';
import { LandInfo, LandType } from './land';
export declare const LUCKY_CARD_COST_POINT = 100;
export interface PlayerData {
    money: number;
    landType: LandType;
    landId: string;
    jailTime: number;
    luckyCardCount: number;
    point: 0;
}
export declare class Player extends Model {
    data: PlayerData;
    setLand({ id, type }: LandInfo): void;
    getLand(): LandInfo;
    increaseMoney(amount: number): void;
    decreaseMoney(amount: number): void;
    getMoney(): number;
    isBroke(): boolean;
    getPoint(): number;
    increasePoint(amount: number): void;
    decreasePoint(amount: number): void;
    buyLuckyCard(num: number): void;
    getLuckyCardCount(): number;
    hasLuckyCard(): boolean;
    useLuckyCard(): void;
    putIntoJail(): void;
    getJailTime(): number;
    serveJailTime(): number;
    bail(price: number): void;
    isInJail(): boolean;
}
