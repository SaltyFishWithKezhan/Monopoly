import {idManager} from './id-manager';

export class Model {
  readonly id: string;

  constructor(id?: string) {
    this.id = id ? id : idManager.generate();
  }
}
