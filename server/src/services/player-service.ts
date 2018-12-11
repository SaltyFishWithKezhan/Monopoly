import {ModelService, Player, packModel} from 'shared';

import {SocketService} from './socket-service';

export class PlayerService {
  constructor(
    private socketService: SocketService,
    private modelService: ModelService,
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.socketService.io.on('connect', socket => {
      this.initializeSocket(socket);
    });
  }

  private initializeSocket(socket: SocketIO.Socket): void {
    socket.on('player:join', (name: string) => {
      if (this.modelService.hasModel('player', name)) {
        socket.emit('player:fail', 'player:join', 201, '玩家名字已经存在啦！');
        return;
      }

      let player = new Player(name);

      this.modelService.addModel('player', player);

      socket.emit('play:success', 'player:join', packModel(player));
    });
  }
}
