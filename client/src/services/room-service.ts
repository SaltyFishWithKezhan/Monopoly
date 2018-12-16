import {ModelService, Player, Room, TransferModel} from 'shared';

import {PromisePool} from '../utils/promise-pool';

import {SocketService} from './socket-service';

export class RoomService extends PromisePool {
  room: Room | undefined;

  private io = this.socketService.io;

  constructor(
    private socketService: SocketService,
    private modelService: ModelService,
  ) {
    super();

    this.initializeSocket();
  }

  async createRoom(player: string): Promise<void> {
    this.io.emit('room:create', player);

    return this.register('room:create');
  }

  async joinRoom(room: string, player: string): Promise<void> {
    this.io.emit('room:join', room, player);

    return this.register('room:join');
  }

  private initializeSocket(): void {
    this.io.on('room:success', (event: string, ...args: any[]) => {
      switch (event) {
        case 'room:create':
          this.onRoomCreate(args[0]);
          break;
        case 'room:join':
          this.onRoomJoin(args[0]);
          break;
      }
    });

    this.io.on('room:fail', (event: string, _code: number, message: string) => {
      let error = new Error(message);
      this.reject(event, error);
    });
  }

  private onRoomCreate(transferModel: TransferModel<'room'>): void {
    let room = this.modelService.createModelFromTransfer('room', transferModel);
    this.room = room;

    this.resolve('room:create');
  }

  private onRoomJoin(transferModel: TransferModel<'room'>): void {
    let room = this.modelService.createModelFromTransfer('room', transferModel);
    this.room = room;
    // 开namepace?????????
    this.resolve('room:join');
  }
}
