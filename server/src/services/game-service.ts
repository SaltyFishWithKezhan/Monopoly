import {
  Game,
  Land,
  Model,
  ModelService,
  Player,
  TransferModel,
  packModel,
} from 'shared';
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

    socket.on('game:get-lands', () => {
      if (!socket.game) {
        socket.emit('game:failed', 'game:get-lands', 401, '还未加入游戏');
        return;
      }

      let boardId = (socket.game.data.board as any) as string;

      let board = this.modelService.getModelById('board', boardId);

      if (!board) {
        socket.emit('game:failed', 'game:get-lands', 402, '找不到游戏的 Board');
        return;
      }

      let landIds = (board.data.lands as any) as string[];

      let landTransfers: TransferModel<'land'>[] = [];

      for (let id of landIds) {
        let land = this.modelService.getModelById('land', id);

        if (!land) {
          continue;
        }

        let transfer = packModel<'land'>(land);

        landTransfers.push(transfer);
      }

      socket.emit('game:success', 'game:get-lands', landTransfers);
    });
  }
}
