import {ModelService} from 'shared';

import {SocketService} from './socket-service';

export class PlayerService {
  constructor(
    private socketService: SocketService,
    private modelService: ModelService,
  ) {}
}
