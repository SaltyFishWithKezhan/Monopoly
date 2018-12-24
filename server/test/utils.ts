import {existsSync, mkdirSync, writeFileSync} from 'fs';
import * as Path from 'path';

import {httpService, listen, servicesReady} from '../bld/service-entrances';

const CONFIG_DIR = Path.join(__dirname, '../../.config');
const SERVER_CONFIG_PATH = Path.join(CONFIG_DIR, 'server.json');

export function createConfig(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR);
  }

  if (!existsSync(SERVER_CONFIG_PATH)) {
    writeFileSync(SERVER_CONFIG_PATH, `{"port": 8090}`);
  }
}

export async function runServer(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    servicesReady
      .then(() => {
        listen();
        resolve();
      })
      .catch(error => reject(error));
  });
}

export function stopServer(): void {
  httpService.stop();
}
