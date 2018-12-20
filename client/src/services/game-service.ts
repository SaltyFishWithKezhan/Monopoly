import EventEmitter from 'eventemitter3';
import {Board, Game, ModelService, TransferModel} from 'shared';

import {SocketService} from './socket-service';

export class GameService {
  private io = this.socketService.io;

  private ee: EventEmitter;

  private game: Game | undefined;

  private board: Board | undefined;

  constructor(
    private socketService: SocketService,
    private modelService: ModelService,
  ) {
    this.ee = new EventEmitter();
    this.initialize();
  }

  startGame(cb: (game: Game, board: Board) => void): void {
    this.io.emit('game:start');

    this.ee.on('game-start', cb);
  }

  serveJailTime(bail: boolean): void {
    this.io.emit('game:serve-jail-time', bail);
  }

  private initialize(): void {
    this.io.on(
      'game:game-start',
      (
        roomTransfer: TransferModel<'room'>,
        playerTransfers: TransferModel<'player'>[],
        gameTransfer: TransferModel<'game'>,
        boardTransfer: TransferModel<'board'>,
        goLandTransfers: TransferModel<'goLand'>[],
        constructionLandTransfers: TransferModel<'constructionLand'>[],
        jailLandTransfers: TransferModel<'jailLand'>[],
        parkingLandTransfers: TransferModel<'parkingLand'>[],
      ) => {
        this.modelService.updateModelFromTransfer('room', roomTransfer);
        this.modelService.updateModelFromTransfers('player', playerTransfers);
        let game = this.modelService.updateModelFromTransfer(
          'game',
          gameTransfer,
        );

        this.game = game;

        let board = this.modelService.updateModelFromTransfer(
          'board',
          boardTransfer,
        );

        this.board = board;

        this.modelService.updateModelFromTransfers('goLand', goLandTransfers);
        this.modelService.updateModelFromTransfers(
          'constructionLand',
          constructionLandTransfers,
        );
        this.modelService.updateModelFromTransfers(
          'jailLand',
          jailLandTransfers,
        );
        this.modelService.updateModelFromTransfers(
          'parkingLand',
          parkingLandTransfers,
        );

        this.ee.emit('game-start', game, board);
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
