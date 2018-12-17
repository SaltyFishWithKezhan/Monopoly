import {Model} from '../core';

import {LandInfo, LandType} from './land';

export interface PlayerData {
  money: number;
  landType: LandType;
  landId: string;
}

export class Player extends Model {
  data: PlayerData = {
    money: 2000,
    landType: LandType.go,
    landId: '',
  };

  setLand({id, type}: LandInfo): void {
    this.data.landId = id;
    this.data.landType = type;
  }

  getLand(): LandInfo {
    let {landId: id, landType: type} = this.data;

    return {id, type};
  }
}
