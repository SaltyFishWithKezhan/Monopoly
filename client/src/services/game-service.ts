import EventEmitter from 'eventemitter3';
import {
  Board,
  ConstructionLand,
  Game,
  ModelService,
  Player,
  TransferModel,
  packModel,
} from 'shared';

import {PlayerService} from './player-service';
import {SocketService} from './socket-service';

export class GameService {
  private io = this.socketService.io;

  private ee: EventEmitter;

  game: Game | undefined;

  board: Board | undefined;

  constructor(
    private socketService: SocketService,
    private modelService: ModelService,
    private playerService: PlayerService,
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

  diceAndDecide(diceValue: number, ...args: any[]): void {
    this.io.emit('game:dice-and-decide', diceValue, ...args);
  }

  useLuckyCard(): void {
    let player = this.playerService.player;

    if (!player) {
      throw new Error('Player not exists');
    }

    this.io.emit('game:use-lucky-card', packModel(player));
  }

  onGameStart(cb: (game: Game, board: Game) => void): void {
    this.ee.on('game-start', cb);
  }

  onDiceRolled(cb: (oldLandId: string, player: Player) => void): void {
    this.ee.on('dice-rolled', cb);
  }

  // onMoveOnJailLand(cb: (player: Player) => void): void {
  //   this.ee.on('game-on-jail-land', cb);
  // }

  onMoveOnGoLand(cb: (player: Player, point: number) => void): void {
    this.ee.on('game-on-go-land', cb);
  }

  onMoveOnParkingLand(cb: (player: Player) => void): void {
    this.ee.on('game-parking-land', cb);
  }

  onMoveOnNextPlayer(cb: (game: Game) => void): void {
    this.ee.on('game-next-player', cb);
  }

  // onServeJail(cb: (player: Player) => void): void {
  //   this.ee.on('game-server-jail', cb);
  // }

  onBailJail(cb: (player: Player) => void): void {
    this.ee.on('game-bail-jail', cb);
  }

  onMoveConRent(cb: (player: Player, owner: Player) => void): void {
    this.ee.on('game-cons-land-rent', cb);
  }

  onMoveConBuy(
    cb: (
      player: Player,
      land: ConstructionLand,
      owner: Player | undefined,
    ) => void,
  ): void {
    this.ee.on('game-cons-land-buy', cb);
  }

  onMoveConUpgrade(cb: (player: Player, land: ConstructionLand) => void): void {
    this.ee.on('game-cons-land-upgrade', cb);
  }

  onGameOver(cb: (player: Player) => void): void {
    this.ee.on('game-over', cb);
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
      let oldPlayer = this.modelService.getModelById('player', playerTrans.id)!;

      let oldLandId = oldPlayer.getLand().id;

      let player = this.modelService.updateModelFromTransfer(
        'player',
        playerTrans,
      );

      this.ee.emit('dice-rolled', oldLandId, player);
    });

    this.io.on('game:game-step', (event: string, ...args: any[]) => {
      switch (event) {
        case 'bail-from-jail':
          this._onBailFromJail(args[0]);
          break;
        case 'serve-jail-time':
          this._onServeJailTime(args[0]);
          break;
        case 'move-on-jail-land':
          this._onMoveOnJailLand(args[0]);
          break;
        case 'move-on-go-land':
          this._onMoveOnGoLand(args[0]);
          break;
        case 'move-on-construction-land-and-rent':
          this._onMoveOnConstructionLandAndRent(args[0], args[1]);
          break;
        case 'move-on-construction-land-and-buy':
          this._onMoveOnConstructionLandAndBuy(args[0], args[1], args[2]);
          break;
        case 'move-on-construction-land-and-upgrade':
          this._onMoveOnConstructionLandAndUpgrade(args[0], args[1]);
          break;
        case 'move-on-parking-land':
          this._onMoveOnParkingLand(args[0]);
          break;
        case 'move-on-next-player':
          this._onMoveOnNextPlayer(args[0]);
          break;
      }
    });

    this.io.on('game:game-over', (winnerId: string) => {
      let player = this.modelService.getModelById('player', winnerId)!;

      this.ee.emit('game-over', player);
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

  private _onMoveOnJailLand(playerTransfer: TransferModel<'player'>): void {
    this.modelService.updateModelFromTransfer('player', playerTransfer);
    // this.ee.emit('game-on-jail-land', data);
  }

  private _onMoveOnGoLand(playerTransfer: TransferModel<'player'>): void {
    let oldPlayer = this.modelService.getModelById(
      'player',
      playerTransfer.id,
    )!;

    let oldPoint = oldPlayer.getPoint();

    let data = this.modelService.updateModelFromTransfer(
      'player',
      playerTransfer,
    );

    let point = data.data.point - oldPoint;
    console.info(point);

    this.ee.emit('game-on-go-land', data, point);
  }

  private _onMoveOnConstructionLandAndRent(
    playerTransfer: TransferModel<'player'>,
    ownerTransfer: TransferModel<'player'>,
  ): void {
    let player = this.modelService.updateModelFromTransfer(
      'player',
      playerTransfer,
    );

    let owner = this.modelService.updateModelFromTransfer(
      'player',
      ownerTransfer,
    );
    this.ee.emit('game-cons-land-rent', player, owner);
  }

  private _onMoveOnConstructionLandAndBuy(
    playerTransfer: TransferModel<'player'>,
    landTransfer: TransferModel<'constructionLand'>,
    ownerTransfer: TransferModel<'player'> | undefined,
  ): void {
    let data = this.modelService.updateModelFromTransfer(
      'player',
      playerTransfer,
    );
    let data1 = this.modelService.updateModelFromTransfer(
      'constructionLand',
      landTransfer,
    );
    let data2: Player | undefined;

    if (ownerTransfer) {
      data2 = this.modelService.updateModelFromTransfer(
        'player',
        ownerTransfer,
      );
    }

    this.ee.emit('game-cons-land-buy', data, data1, data2);
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

  private _onMoveOnParkingLand(
    playerTransfer: TransferModel<'parkingLand'>,
  ): void {
    let data = this.modelService.updateModelFromTransfer(
      'player',
      playerTransfer,
    );

    this.ee.emit('game-parking-land', data);
  }

  private _onMoveOnNextPlayer(gameTransfer: TransferModel<'game'>): void {
    let data = this.modelService.updateModelFromTransfer('game', gameTransfer);
    this.ee.emit('game-next-player', data);
  }
}
