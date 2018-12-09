import * as FS from 'fs';
import * as Path from 'path';

import {PROJECT_DIR} from '../paths';

const hasOwnProperty = Object.prototype.hasOwnProperty;

const CONFIG_BASE_PATH = Path.join(PROJECT_DIR, '.config');
const SERVER_CONFIG_PATH = Path.join(CONFIG_BASE_PATH, 'server.json');

export type keys<T> = T extends object ? keyof T : never;

export class ConfigService<T extends object> {
  private readonly data: T;

  constructor(filePath: string) {
    this.data = JSON.parse(FS.readFileSync(filePath).toLocaleString());
  }

  get(): T;
  get<K extends keys<T>>(key: K): T[K] | undefined;
  get<K extends keys<T>>(key: K, fallback: T[K]): T[K];
  get<K extends keys<T>>(key?: K, fallback?: T[K]): T[K] | T | undefined {
    let data = this.data;

    if (key) {
      if (hasOwnProperty.call(data, key)) {
        return data[key];
      }

      return fallback;
    }

    return data;
  }
}

export interface ServerConfig {
  port: number;
}

export class Config {
  static server = new ConfigService<ServerConfig>(SERVER_CONFIG_PATH);
}
