import {idManager} from './id-manager';

export class Model<T extends object = {}> {
  readonly id: string;

  data: T | {};

  constructor(id?: string, data?: T) {
    this.id = id ? id : idManager.generate();
    this.data = data ? data : {};
  }
}
