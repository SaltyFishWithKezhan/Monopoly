import {Model} from '../core';

export interface LandInfo {
  type: LandType;
  id: string;
}

export enum LandType {
  go,
  construction,
  jail,
  parking,
}

export interface LandData {
  type: LandType;
}

export abstract class Land extends Model<LandData> {
  data: LandData = {
    type: LandType.go,
  };

  getLandInfo(): LandInfo {
    return {
      id: this.id,
      type: this.data.type,
    };
  }

  getType(): LandType {
    return this.data.type;
  }
}

export interface GoLandData extends LandData {
  salary: number;
}

export class GoLand extends Land {
  data: GoLandData = {
    type: LandType.go,
    salary: 30,
  };
}

export type ConstructionLandLevel = 0 | 1 | 2;

export interface ConstructionLandData extends LandData {
  owner: string | undefined;
  level: ConstructionLandLevel;
  landPrice: number;
  upgradePrice: number;
  rentPrice: number;
}

export class ConstructionLand extends Land {
  data: ConstructionLandData = {
    type: LandType.construction,
    owner: undefined,
    level: 0,
    landPrice: 100,
    upgradePrice: 100,
    rentPrice: 50,
  };

  setOwner(playerId: string): void {
    this.data.owner = playerId;
  }

  getOwner(): string | undefined {
    return this.data.owner;
  }

  getPrice(): number {
    if (this.data.owner) {
      return Math.ceil(this.data.landPrice * 1.1);
    }

    return Math.ceil(this.data.landPrice);
  }

  getRentPrice(): number {
    return Math.ceil(this.data.rentPrice);
  }

  getUpgradePrice(): number {
    return Math.ceil(this.data.upgradePrice);
  }

  setPrice(amount: number): void {
    this.data.landPrice = amount;
  }

  getLevel(): ConstructionLandLevel {
    return this.data.level;
  }

  upgrade(): boolean {
    if (this.data.level > 2) {
      return false;
    }

    this.data.level++;

    switch (this.data.level) {
      case 1:
        this.data.landPrice = 250;
        this.data.upgradePrice = 100;
        this.data.rentPrice = 75;
        break;
      case 2:
        this.data.landPrice = 400;
        this.data.upgradePrice = 150;
        this.data.rentPrice = 100;
        break;
    }

    return true;
  }
}

export interface JailLandData extends LandData {
  bailPrice: number;
}

export class JailLand extends Land {
  data: JailLandData = {
    type: LandType.jail,
    bailPrice: 20,
  };

  getBailPrice(): number {
    return Math.ceil(this.data.bailPrice);
  }
}

export interface ParkingLandData extends LandData {}

export class ParkingLand extends Land {
  data: ParkingLandData = {
    type: LandType.parking,
  };
}

export type LandModelTypeKey =
  | 'goLand'
  | 'constructionLand'
  | 'jailLand'
  | 'parkingLand';

export function LandTypeToModelTypeKey(landType: LandType): LandModelTypeKey {
  switch (landType) {
    case LandType.go:
      return 'goLand';
    case LandType.construction:
      return 'constructionLand';
    case LandType.jail:
      return 'jailLand';
    case LandType.parking:
      return 'parkingLand';
  }
}

export function isGoLand(land: Land): land is GoLand {
  return land.getType() === LandType.go;
}

export function isConstructionLand(land: Land): land is ConstructionLand {
  return land.getType() === LandType.construction;
}

export function isJailLand(land: Land): land is JailLand {
  return land.getType() === LandType.jail;
}

export function isParkingLand(land: Land): land is ParkingLand {
  return land.getType() === LandType.parking;
}

export type ConstructionLandArrivalOperation = 'rent' | 'buy' | 'upgrade';
