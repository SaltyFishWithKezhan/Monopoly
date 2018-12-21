import * as Shared from 'shared';
import SocketIO from 'socket.io';
import uuid from 'uuid';

import {SocketService} from './socket-service';

declare global {
  namespace SocketIO {
    export interface Socket {
      room: Shared.Room | undefined;
    }
  }
}

export class RoomService {
  private io = this.socketService.io;

  constructor(
    private socketService: SocketService,
    private modelService: Shared.ModelService,
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.socketService.io.on('connect', socket => {
      this.initializeSocket(socket);
    });
  }

  private initializeSocket(socket: SocketIO.Socket): void {
    socket.on('room:create', () => {
      let room = new Shared.Room(uuid());
      room.setRoomURL(`/room/${room.id}`);

      this.modelService.addModel('room', room);

      socket.emit('room:success', 'room:create', Shared.packModel(room));
    });

    socket.on('room:join', (roomName: string) => {
      if (!socket.player) {
        socket.emit('room:fail', 'room:join', 401, '用户未登录！');
        return;
      }

      if (!this.modelService.hasModel('room', roomName)) {
        socket.emit('room:fail', 'room:join', 402, '房间不存在！');
        return;
      }

      let room = this.modelService.getModelById('room', roomName)!;

      if (room.hasPlayer(socket.player.id)) {
        socket.emit('room:fail', 'room:join', 403, '已在该房间中！');
        return;
      }

      if (room.data.players.length >= 4) {
        socket.emit('room:fail', 'room:join', 404, '房间人数已满！');
        return;
      }

      if (room.getGame()) {
        socket.emit('room:fail', 'room:join', 405, '房间内游戏正在进行中！');
        return;
      }

      room.addPlayer(socket.player.id);

      socket.room = room;

      socket.join(room.getRoomURL());

      let ids = room.getPlayerIds();

      let players = this.modelService.getModelsByIds('player', ids);

      this.io
        .in(room.getRoomURL())
        .emit(
          'room:player-join',
          Shared.packModel(room),
          Shared.packModels(players),
        );
    });
  }
}
