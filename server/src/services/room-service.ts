import {ModelService, Room, RoomData, packModel} from 'shared';
import SocketIO from 'socket.io';

import {SocketService} from './socket-service';

declare global {
  namespace SocketIO {
    export interface Socket {
      room: RoomData | undefined;
    }
  }
}

export class RoomService {
  constructor(
    private socketService: SocketService,
    private modelService: ModelService,
  ) {
    this.initialize();
  }

  uuidGen = require('uuid/v1');

  private initialize(): void {
    this.socketService.io.on('connect', socket => {
      this.initializeSocket(socket);
    });
  }

  private initializeSocket(socket: SocketIO.Socket): void {
    socket.on('room:create', () => {
      let room = new Room(this.uuidGen());
      this.modelService.addModel('room', room);

      socket.emit('room:success', 'room:create', packModel(room));
    });

    socket.on('room:join', (roomName: string, playerName: string) => {
      if (!this.modelService.hasModel('room', roomName)) {
        socket.emit('room:fail', 'room:join', 201, '房间不存在！');
        return;
      }

      let room = this.modelService.getModelById('room', roomName)!;
      room.addPlayer(playerName);

      socket.emit('room:success', 'room:update', packModel(room));
    });
  }
}
