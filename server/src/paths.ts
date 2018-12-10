import * as Path from 'path';

export const PROJECT_DIR = Path.join(__dirname, '../../');

export const SERVER_DIR = Path.join(PROJECT_DIR, 'server');

export const CLIENT_DIR = Path.join(PROJECT_DIR, 'client');

export const CLIENT_BUILD_DIR = Path.join(CLIENT_DIR, 'bld');
export const CLIENT_PUBLIC_DIR = Path.join(CLIENT_DIR, 'public');
