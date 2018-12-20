import EventEmitter from 'eventemitter3';
import {ModelService, Player, Room, TransferModel} from 'shared';

import {PromisePool} from '../utils/promise-pool';

import {SocketService} from './socket-service';

export class RoomService extends PromisePool {
  room: Room | undefined;

  private io = this.socketService.io;

  private ee = new EventEmitter();

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

  joinRoom(room: string, cb: (room: Room, players: Player[]) => void): void {
    this.ee.on('join-room', cb);

    this.io.emit('room:join', room);
  }

  private initializeSocket(): void {
    this.io.on('room:success', (event: string, ...args: any[]) => {
      switch (event) {
        case 'room:create':
          this._onRoomCreate(args[0]);
          break;
      }
    });

    this.io.on('room:fail', (event: string, _code: number, message: string) => {
      let error = new Error(message);
      console.error(error);
      this.reject(event, error);
    });

    this.io.on('room:player-join', this._onRoomJoin);
  }

  private _onRoomCreate(transferModel: TransferModel<'room'>): void {
    let room = this.modelService.createModelFromTransfer('room', transferModel);
    this.room = room;

    this.resolve('room:create');
  }

  private _onRoomJoin = (
    roomTransfer: TransferModel<'room'>,
    playerTransfers: TransferModel<'player'>[],
  ): void => {
    let room = this.modelService.updateModelFromTransfer('room', roomTransfer);
    this.room = room;

    let players = this.modelService.updateModelFromTransfers(
      'player',
      playerTransfers,
    );

    this.ee.emit('join-room', room, players);
  };
}
