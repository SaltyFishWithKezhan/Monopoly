import {createServer} from 'http';

import express from 'express';
import {ModelService} from 'shared/bld';
import socketIO from 'socket.io';

import {HTTPService, SocketService} from './services';
import {Config} from './utils/config';

const app = express();

const httpServer = createServer(app);

const io = socketIO(httpServer);

export const httpService = new HTTPService(app, httpServer);

export const socketService = new SocketService(io);

export const modelService = new ModelService();

export const servicesReady = Promise.all([]);

export function listen(): void {
  let port = process.env.PORT || Config.server.get('port');
  httpServer.listen(port, () => console.info(`Listening on port ${port}...`));
}
