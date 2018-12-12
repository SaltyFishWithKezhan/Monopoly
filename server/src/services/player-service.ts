import {ModelService, Player, packModel} from 'shared';
import SocketIO from 'socket.io';

import {SocketService} from './socket-service';

declare global {
  namespace SocketIO {
    export interface Socket {
      player: Player | undefined;
    }
  }
}

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
    socket.on('player:login', (name: string) => {
      if (this.modelService.hasModel('player', name)) {
        socket.emit('player:fail', 'player:login', 201, '玩家名字已经存在啦！');
        return;
      }

      let player = new Player(name);

      this.modelService.addModel('player', player);

      socket.player = player;

      socket.emit('player:success', 'player:login', packModel(player));
    });
  }
}
