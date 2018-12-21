import {
  LandTypeToModelTypeKey,
  ModelService,
  Player,
  Room,
  packModel,
} from 'shared';
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

    socket.on('disconnect', () => {
      if (!socket.player || !socket.room) {
        return;
      }

      let player = socket.player;
      let room = socket.room;

      room.removePlayer(player.id);

      this.modelService.removeModel('player', player.id);

      if (room.isEmpty()) {
        this.modelService.removeModel('room', room.id);
        this.cleanUpRoom(room);
      } else {
        socket
          .to(room.getRoomURL())
          .emit('room:player-leave', player.id, packModel(room));
      }
    });
  }

  private cleanUpRoom(room: Room): void {
    let gameId = room.getGame();

    if (!gameId) {
      return;
    }

    let game = this.modelService.getModelById('game', gameId);

    if (!game) {
      return;
    }

    this.modelService.removeModel('game', game.id);

    let boardId = game.getBoard();

    if (!boardId) {
      return;
    }

    let board = this.modelService.getModelById('board', boardId);

    if (!board) {
      return;
    }

    let landInfos = board.getLands();

    for (let {id, type} of landInfos) {
      let key = LandTypeToModelTypeKey(type);

      this.modelService.removeModel(key, id);
    }
  }
}
