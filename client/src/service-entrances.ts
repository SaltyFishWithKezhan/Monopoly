import {ModelService} from 'shared';

import {SocketService} from './services';

export const socketService = new SocketService();

export const modelService = new ModelService();

export const servicesReady = Promise.all([]);
