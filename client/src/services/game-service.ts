import EventEmitter from 'eventemitter3';
import {
  Board,
  ConstructionLand,
  ConstructionLandArrivalOperation,
  Game,
  ModelService,
  Player,
  TransferModel,
} from 'shared';

import {SocketService} from './socket-service';

export class GameService {
  private io = this.socketService.io;

  private ee: EventEmitter;

  game: Game | undefined;

  board: Board | undefined;

  constructor(
    private socketService: SocketService,
    private modelService: ModelService,
  ) {
    this.ee = new EventEmitter();
    this.initialize();
  }

  startGame(cb: (game: Game, board: Board) => void): void {
    this.io.emit('game:start');
  }

  serveJailTime(bail: true): void {
    this.io.emit('game:serve-jail-time', bail);
  }

  diceAndDecide(diceValue: number, ...args: any[]): void {
    this.io.emit('game:dice-and-decide', diceValue, ...args);
  }

  onDiceRolled(cb: (player: Player) => void): void {
    this.ee.on('dice-rolled', cb);
  }

  onMoveOnGoLand(cb: (player: Player) => void): void {
    this.ee.on('game-on-go-land', cb);
  }

  onMoveOnNextPlayer(cb: (game: Game) => void): void {
    this.ee.on('game-next-player', cb);
  }

  onServeJail(cb: (player: Player) => void): void {
    this.ee.on('game-bail-jail', cb);
  }

  onBailJail(cb: (player: Player) => void): void {
    this.ee.on('game-serve-jail', cb);
  }

  onMoveConRent(cb: (player: Player) => void): void {
    this.ee.on('game-cons-land-rent', cb);
  }

  onMoveConBuy(cb: (player: Player, land: ConstructionLand) => void): void {
    this.ee.on('game-cons-land-buy', cb);
  }

  onMoveConUpgrade(cb: (player: Player, land: ConstructionLand) => void): void {
    this.ee.on('game-cons-land-upgrade', cb);
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

        console.info(game, board);

        this.ee.emit('game-start', game, board);
      },
    );

    this.io.on('game:roll-the-dice', (playerTrans: TransferModel<'player'>) => {
      let player = this.modelService.updateModelFromTransfer(
        'player',
        playerTrans,
      );
      this.ee.emit('dice-rolled', player);
    });

    this.io.on('game:game-step', (event: string, ...args: any[]) => {
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

  private _onBailFromJail(playerTransfer: TransferModel<'player'>): void {
    let data = this.modelService.updateModelFromTransfer(
      'player',
      playerTransfer,
    );
    this.ee.emit('game-bail-jail', data);
  }

  private _onServeJailTime(playerTransfer: TransferModel<'player'>): void {
    let data = this.modelService.updateModelFromTransfer(
      'player',
      playerTransfer,
    );
    this.ee.emit('game-serve-jail', data);
  }

  private _onMoveOnGoLand(playerTransfer: TransferModel<'player'>): void {
    let data = this.modelService.updateModelFromTransfer(
      'player',
      playerTransfer,
    );
    this.ee.emit('game-on-go-land', data);
  }

  private _onMoveOnConstructionLandAndRent(
    playerTransfer: TransferModel<'player'>,
  ): void {
    let data = this.modelService.updateModelFromTransfer(
      'player',
      playerTransfer,
    );
    this.ee.emit('game-cons-land-rent', data);
  }

  private _onMoveOnConstructionLandAndBuy(
    playerTransfer: TransferModel<'player'>,
    landTransfer: TransferModel<'constructionLand'>,
  ): void {
    let data = this.modelService.updateModelFromTransfer(
      'player',
      playerTransfer,
    );
    let data1 = this.modelService.updateModelFromTransfer(
      'constructionLand',
      landTransfer,
    );
    this.ee.emit('game-cons-land-buy', data, data1);
  }

  private _onMoveOnConstructionLandAndUpgrade(
    playerTransfer: TransferModel<'player'>,
    landTransfer: TransferModel<'constructionLand'>,
  ): void {
    let data = this.modelService.updateModelFromTransfer(
      'player',
      playerTransfer,
    );
    let data1 = this.modelService.updateModelFromTransfer(
      'constructionLand',
      landTransfer,
    );
    this.ee.emit('game-cons-land-upgrade', data, data1);
  }

  private _onMoveOnNextPlayer(gameTransfer: TransferModel<'game'>): void {
    let data = this.modelService.updateModelFromTransfer('game', gameTransfer);
    this.ee.emit('game-next-player', data);
  }
}
