import {createServer} from 'http';

import express from 'express';
import {ModelService} from 'shared';
import socketIO from 'socket.io';

import {
  GameService,
  HTTPService,
  PlayerService,
  RoomService,
  SocketService,
} from './services';
import {Config} from './utils/config';

const app = express();

const httpServer = createServer(app);

const io = socketIO(httpServer);

export const httpService = new HTTPService(app, httpServer);

export const socketService = new SocketService(io);

export const modelService = new ModelService();

export const playerService = new PlayerService(socketService, modelService);

export const roomService = new RoomService(socketService, modelService);

export const gameService = new GameService(socketService, modelService);

export const servicesReady = Promise.all([]);

export function listen(): void {
  let port = process.env.PORT || Config.server.get('port');
  httpServer.listen(port, () => console.info(`Listening on port ${port}...`));
}
