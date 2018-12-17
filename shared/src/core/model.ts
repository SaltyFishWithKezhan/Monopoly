import {idManager} from './id-manager';

export class Model<T extends object = {}> {
  readonly id: string;

  data: T | {} = {};

  constructor(id?: string) {
    this.id = id ? id : idManager.generate();
  }
}
