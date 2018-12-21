import {Model} from '../core';

import {LandInfo, LandType} from './land';

export interface PlayerData {
  money: number;
  landType: LandType;
  landId: string;
  jailTime: number;
}

export class Player extends Model {
  data: PlayerData = {
    money: 2000,
    landType: LandType.go,
    landId: '',
    jailTime: 0,
  };

  setLand({id, type}: LandInfo): void {
    this.data.landId = id;
    this.data.landType = type;
  }

  getLand(): LandInfo {
    let {landId: id, landType: type} = this.data;

    return {id, type};
  }

  increaseMoney(amount: number): void {
    this.data.money += amount;
  }

  decreaseMoney(amount: number): void {
    this.data.money -= amount;
  }

  getMoney(): number {
    return this.data.money;
  }

  isBroke(): boolean {
    return this.data.money <= 0;
  }

  putIntoJail(): void {
    this.data.jailTime = 1;
  }

  getJailTime(): number {
    return this.data.jailTime;
  }

  serveJailTime(): number {
    return --this.data.jailTime;
  }

  bail(price: number): void {
    this.decreaseMoney(price);

    this.data.jailTime = 0;
  }

  isInJail(): boolean {
    return this.data.jailTime > 0;
  }
}
