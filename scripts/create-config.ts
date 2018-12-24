import {access as _access, mkdir as _mkdir, writeFile as _writeFile} from 'fs';
import * as Path from 'path';
import {promisify} from 'util';

const access = promisify(_access);
const mkdir = promisify(_mkdir);
const writeFile = promisify(_writeFile);

const CONFIG_DIR = Path.join(__dirname, '../.config');
const SERVER_CONFIG_PATH = Path.join(CONFIG_DIR, 'server.json');

main().catch(console.error);

export async function main(): Promise<void> {
  await createConfig();
}

export async function createConfig(): Promise<void> {
  try {
    await access(CONFIG_DIR);
  } catch (error) {
    await mkdir(CONFIG_DIR);
  }

  try {
    await access(SERVER_CONFIG_PATH);
  } catch (error) {
    await writeFile(SERVER_CONFIG_PATH, `{"port": 8090}`);
  }
}
