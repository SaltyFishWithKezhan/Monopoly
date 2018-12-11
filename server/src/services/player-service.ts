import {ModelService, Player} from 'shared';

import {SocketService} from './socket-service';

export class PlayerService {
  constructor(
    private socketService: SocketService,
    private modelService: ModelService,
  ) {}

  private initialize(): void {
    this.socketService.io.on('connect', socket => {
      this.initializeSocket(socket);
    });
  }

  private initializeSocket(socket: SocketIO.Socket): void {
    socket.on('player:join', (name: string) => {
      let player = new Player(name);
    });
  }
}
