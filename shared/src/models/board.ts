import {Model} from '../core';

export interface BoardData {
  lands: any[];
}

export class Board extends Model {
  data: BoardData = {
    lands: [],
  };

  constructor() {
    super();
    // this.generateLands();
  }

  getLands(): any {
    return this.data.lands;
  }

  getLand(index: number): any {
    return this.data.lands[index];
  }
}
