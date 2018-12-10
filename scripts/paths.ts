import * as Path from 'path';

export const PROJECT_DIR = Path.join(__dirname, '../');

export const SHARED_DIR = Path.join(PROJECT_DIR, 'shared');

export const SHARED_BLD_DIR = Path.join(SHARED_DIR, 'bld');
export const SHARED_PACKAGE_PATH = Path.join(SHARED_DIR, 'package.json');

export const SERVER_DIR = Path.join(PROJECT_DIR, 'server');

export const SERVER_BLD_DIR = Path.join(SERVER_DIR, 'bld');
export const SERVER_PACKAGE_PATH = Path.join(SERVER_DIR, 'package.json');

export const CLIENT_DIR = Path.join(PROJECT_DIR, 'client');

export const CLIENT_BUILD_DIR = Path.join(CLIENT_DIR, 'bld');
export const CLIENT_PUBLIC_DIR = Path.join(CLIENT_DIR, 'public');
export const CLIENT_PACKAGE_PATH = Path.join(CLIENT_DIR, 'package.json');
