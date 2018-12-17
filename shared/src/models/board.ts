import {Model} from '../core';

import {LandInfo, LandType} from './land';

export interface BoardData {
  lands: LandInfo[];
}

export class Board extends Model {
  data: BoardData = {
    lands: [],
  };

  indexOfLand({type: landType, id: landId}: LandInfo): number {
    let index = -1;

    let candidate = 0;

    for (let info of this.data.lands) {
      let {type, id} = info;

      if (type === landType && id === landId) {
        index = candidate;
        break;
      }

      candidate++;
    }

    return index;
  }

  addLand({type, id}: LandInfo): boolean {
    let {lands} = this.data;

    if (this.indexOfLand({type, id}) < 0) {
      return false;
    }

    lands.push({type, id});
    return true;
  }

  getLands(): LandInfo[] {
    return this.data.lands;
  }

  getLand(index: number): LandInfo | undefined {
    let {lands} = this.data;

    if (index >= lands.length) {
      if (lands.length > 0) {
        return lands[index % lands.length];
      } else {
        return undefined;
      }
    }

    return lands[index];
  }

  getLandIdsByType(landType: LandType): string[] {
    let result: string[] = [];

    for (let {type, id} of this.data.lands) {
      if (type === landType) {
        result.push(id);
      }
    }

    return result;
  }

  getNextLand(info: LandInfo, step: number = 1): LandInfo | undefined {
    let index = this.indexOfLand(info);

    if (index < 0) {
      return undefined;
    }

    return this.getLand(index + step);
  }
}
