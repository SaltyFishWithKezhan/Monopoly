import {ModelService} from 'shared';

import {
  GameService,
  PlayerService,
  RoomService,
  SocketService,
  UIService,
} from './services';

export const uiService = new UIService();

export const socketService = new SocketService(uiService);

export const modelService = new ModelService();

export const playerService = new PlayerService(socketService, modelService);

export const roomService = new RoomService(socketService, modelService);

export const gameService = new GameService(socketService, modelService);

export const servicesReady = Promise.all([]);
