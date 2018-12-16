import {Model} from '../core';

import {ConstructionLand, JailLand, Land, StartLand} from './land';

export interface BoardData {
  lands: Land[];
}

export class Board extends Model {
  data: BoardData = {
    lands: [],
  };

  constructor() {
    super();
    this.generateLands();
  }

  generateLands() {
    this.data.lands.push(new Land(0, 'Start', new StartLand()));
    this.data.lands.push(new Land(1, 'ECNU', new ConstructionLand(80)));
    this.data.lands.push(new Land(2, 'SJTU', new ConstructionLand(60)));
    this.data.lands.push(new Land(3, 'UCB', new ConstructionLand(150)));
    this.data.lands.push(new Land(4, 'NTU', new ConstructionLand(34)));
    this.data.lands.push(new Land(5, 'JailLand', new JailLand()));
    this.data.lands.push(new Land(6, 'CMU', new ConstructionLand(70)));
    this.data.lands.push(new Land(7, 'PKU', new ConstructionLand(20)));
    this.data.lands.push(new Land(8, 'FDU', new ConstructionLand(90)));
    this.data.lands.push(new Land(9, 'STU', new ConstructionLand(40)));
    this.data.lands.push(new Land(10, 'UUU', new ConstructionLand(75)));
    this.data.lands.push(new Land(11, 'AAA', new ConstructionLand(75)));
    this.data.lands.push(new Land(12, 'BBB', new ConstructionLand(75)));
  }

  getLands() {
    return this.data.lands;
  }

  getLand(index: number) {
    return this.data.lands[index];
  }
}
