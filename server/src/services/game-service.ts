import {Game, ModelService, Player, packModel} from 'shared';
import SocketIO from 'socket.io';

import {SocketService} from './socket-service';

//将类型成员注入到已经定义的 SocketIO.Socket 里面
declare global {
  namespace SocketIO {
    export interface Socket {
      game: Game | undefined;
    }
  }
}

export class GameService {
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
    socket.on('game:roll', (playerName: string, faceValue: number) => {});
    socket.on('game:pay', (playerName: string, land: number) => {});
    socket.on(
      'game:make-decision',
      (playerName: string, decistion: boolean) => {},
    );
  }
}
