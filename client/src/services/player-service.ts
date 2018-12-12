import {ModelService, Player, TransferModel} from 'shared';

import {PromisePool} from '../utils/promise-pool';

import {SocketService} from './socket-service';

export class PlayerService extends PromisePool {
  player: Player | undefined;

  private io = this.socketService.io;

  constructor(
    private socketService: SocketService,
    private modelService: ModelService,
  ) {
    super();

    this.initializeSocket();
  }

  async login(name: string): Promise<void> {
    this.io.emit('player:login', name);

    return this.register('player:login');
  }

  private initializeSocket(): void {
    this.io.on('player:success', (event: string, ...args: any[]) => {
      switch (event) {
        case 'player:login':
          this.onPlayerLogin(args[0]);
          break;
      }
    });
  }

  private onPlayerLogin(transferModel: TransferModel<'player'>): void {
    let player = this.modelService.createModelFromTransfer(
      'player',
      transferModel,
    );

    this.player = player;

    this.resolve('player:login');
  }
}
