import {ModelService} from 'shared';

import {PlayerService, SocketService, UIService} from './services';

export const uiService = new UIService();

export const socketService = new SocketService(uiService);

export const modelService = new ModelService();

export const playerService = new PlayerService(socketService, modelService);

export const servicesReady = Promise.all([]);
