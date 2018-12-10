import * as FS from 'fs';
import * as Path from 'path';
import {promisify} from 'util';

import {ncp as _ncp} from 'ncp';
import _rimraf from 'rimraf';

import {
  CLIENT_BUILD_DIR,
  CLIENT_PACKAGE_PATH,
  CLIENT_PUBLIC_DIR,
  PACKAGE_PATH,
  PROJECT_DIR,
  SERVER_BLD_DIR,
  SERVER_PACKAGE_PATH,
  SHARED_BLD_DIR,
  SHARED_PACKAGE_PATH,
} from './paths';

const ncp = promisify(_ncp);
const rimraf = promisify(_rimraf);

const DEPLOY_BLD_DIR = Path.join(PROJECT_DIR, 'bld');
const DEPLOY_PACKAGE_PATH = Path.join(DEPLOY_BLD_DIR, 'package.json');

const DEPLOY_SHARED_DIR = Path.join(DEPLOY_BLD_DIR, 'shared');

const DEPLOY_SHARED_BLD_DIR = Path.join(DEPLOY_SHARED_DIR, 'bld');
const DEPLOY_SHARED_PACKAGE_PATH = Path.join(DEPLOY_SHARED_DIR, 'package.json');

const DEPLOY_SERVER_DIR = Path.join(DEPLOY_BLD_DIR, 'server');

const DEPLOY_SERVER_BLD_DIR = Path.join(DEPLOY_SERVER_DIR, 'bld');
const DEPLOY_SERVER_PACKAGE_PATH = Path.join(DEPLOY_SERVER_DIR, 'package.json');

const DEPLOY_CLIENT_DIR = Path.join(DEPLOY_BLD_DIR, 'client');

const DEPLOY_CLIENT_BLD_DIR = Path.join(DEPLOY_CLIENT_DIR, 'bld');
const DEPLOY_CLIENT_PUBLIC_DIR = Path.join(DEPLOY_CLIENT_DIR, 'public');
const DEPLOY_CLIENT_PACKAGE_PATH = Path.join(DEPLOY_CLIENT_DIR, 'package.json');

main().catch(console.error);

async function main(): Promise<void> {
  console.info('Cleaning previous bld...');
  await rimraf(DEPLOY_BLD_DIR);

  console.info('Creating new directory...');
  FS.mkdirSync(DEPLOY_BLD_DIR);

  console.info('Copying main package...');
  await ncp(PACKAGE_PATH, DEPLOY_PACKAGE_PATH);

  console.info('Creating new shared dir...');
  FS.mkdirSync(DEPLOY_SHARED_DIR);

  console.info('Copying shared...');
  await ncp(SHARED_BLD_DIR, DEPLOY_SHARED_BLD_DIR);
  await ncp(SHARED_PACKAGE_PATH, DEPLOY_SHARED_PACKAGE_PATH);

  console.info('Creating new client dir...');
  FS.mkdirSync(DEPLOY_CLIENT_DIR);

  console.info('Copying client...');
  await ncp(CLIENT_BUILD_DIR, DEPLOY_CLIENT_BLD_DIR);
  await ncp(CLIENT_PUBLIC_DIR, DEPLOY_CLIENT_PUBLIC_DIR);
  await ncp(CLIENT_PACKAGE_PATH, DEPLOY_CLIENT_PACKAGE_PATH);

  console.info('Creating new server dir...');
  FS.mkdirSync(DEPLOY_SERVER_DIR);

  console.info('Copying server...');
  await ncp(SERVER_BLD_DIR, DEPLOY_SERVER_BLD_DIR);
  await ncp(SERVER_PACKAGE_PATH, DEPLOY_SERVER_PACKAGE_PATH);
}
