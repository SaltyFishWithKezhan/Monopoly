import EventEmitter from 'eventemitter3';
import {ModelService, TransferModel} from 'shared';

import {SocketService} from './socket-service';

export class GameService {
  private io = this.socketService.io;

  private ee: EventEmitter;

  constructor(
    private socketService: SocketService,
    private modelService: ModelService,
  ) {
    this.ee = new EventEmitter();
    this.initialize();
  }

  startGame(): void {
    this.io.emit('game:start');
  }

  serveJailTime(bail: boolean): void {
    this.io.emit('game:serve-jail-time', bail);
  }

  onGameStart(cb: () => void): void {
    this.ee.on('game-start', cb);
  }

  private initialize(): void {
    this.io.on(
      'game:game-start',
      (
        roomTransfer: TransferModel<'room'>,
        playerTransfers: TransferModel<'player'>[],
        gameTransfer: TransferModel<'player'>,
        boardTransfer: TransferModel<'board'>,
        goLandTransfers: TransferModel<'goLand'>[],
        constructionLandTransfers: TransferModel<'constructionLand'>[],
        jailLandTransfers: TransferModel<'jailLand'>[],
        parkingLandTransfers: TransferModel<'parkingLand'>[],
      ) => {
        this.ee.emit('game-start');
      },
    );

    this.io.on('game:step', (event: string, ...args: any[]) => {
      switch (event) {
        case 'bail-from-jail':
          this._onBailFromJail(args[0]);
          break;
        case 'serve-jail-time':
          this._onServeJailTime(args[0]);
          break;
        case 'move-on-go-land':
          this._onMoveOnGoLand(args[0]);
          break;
        case 'move-on-construction-land-and-rent':
          this._onMoveOnConstructionLandAndRent(args[0]);
          break;
        case 'move-on-construction-land-and-buy':
          this._onMoveOnConstructionLandAndBuy(args[0], args[1]);
          break;
        case 'move-on-construction-land-and-upgrade':
          this._onMoveOnConstructionLandAndUpgrade(args[0], args[1]);
          break;
        case 'move-on-next-player':
          this._onMoveOnNextPlayer(args[0]);
          break;
      }
    });
  }

  private _onBailFromJail(playerTransfer: TransferModel<'player'>): void {}

  private _onServeJailTime(playerTransfer: TransferModel<'player'>): void {}

  private _onMoveOnGoLand(playerTransfer: TransferModel<'player'>): void {}

  private _onMoveOnConstructionLandAndRent(
    playerTransfer: TransferModel<'player'>,
  ): void {}

  private _onMoveOnConstructionLandAndBuy(
    playerTransfer: TransferModel<'player'>,
    landTransfer: TransferModel<'constructionLand'>,
  ): void {}

  private _onMoveOnConstructionLandAndUpgrade(
    playerTransfer: TransferModel<'player'>,
    landTransfer: TransferModel<'constructionLand'>,
  ): void {}

  private _onMoveOnNextPlayer(gameTransfer: TransferModel<'game'>): void {}
}
