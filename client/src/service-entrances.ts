import {ModelService} from 'shared';

import {SocketService, UIService} from './services';

export const uiService = new UIService();

export const socketService = new SocketService(uiService);

export const modelService = new ModelService();

export const servicesReady = Promise.all([]);
