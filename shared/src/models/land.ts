import {Model} from '../core';

enum LandType {
  CONSTRUCTION_LAND = 0,
  START = 1,
  JAIL = 2,
}

enum BuildingType {
  HOUSE = 0,
  HOTEL = 1,
  NOTHING = 2,
}

export interface LandData {
  pos: number; // index
  desceiption: string; // "Empty Land"
  content: any; // None
}

export class Land extends Model {
  data: LandData = {
    pos: 0,
    desceiption: '',
    content: '',
  };

  constructor(pos: number, desceiption: string, content: any) {
    super();
    this.data = {
      pos: pos,
      desceiption: desceiption,
      content: content,
    };
  }
}

export class ConstructionLand extends Model {
  type: LandType = LandType.CONSTRUCTION_LAND;
  price: number = 0;
  properties: BuildingType = BuildingType.NOTHING;
  buildingNum: number = 0;
  owner: string = '';

  constructor(price: number) {
    super();
    this.price = price;
  }
}

export class StartLand extends Model {
  type: LandType = LandType.START;
  reward: number = 200;
}

export class JailLand extends Model {
  type: LandType = LandType.JAIL;
  stops: number = 2;
}
