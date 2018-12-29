import {
  Board,
  ConstructionLand,
  ConstructionLandArrivalOperation,
  Game,
  GoLand,
  JailLand,
  LUCKY_CARD_COST_POINT,
  LandType,
  LandTypeToModelTypeKey,
  ModelService,
  ParkingLand,
  Player,
  Room,
  TransferModel,
  isConstructionLand,
  isGoLand,
  isJailLand,
  isParkingLand,
  packModel,
  packModels,
} from 'shared';

import {SocketService} from './socket-service';

export class GameService {
  private io = this.socketService.io;

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
    socket.on('game:start', () => {
      if (!socket.room || !socket.player) {
        socket.emit('game:fail', 'game:start', 401, '无权限执行该操作！');
        return;
      }

      if (socket.room.getOwner() !== socket.player.id) {
        socket.emit('game:fail', 'game:start', 402, '只有房主才能开始游戏！');
        return;
      }

      let game = new Game();
      this.modelService.addModel('game', game);

      let room = socket.room;

      room.setGame(game.id);

      game.setPlayers(room.getPlayerIds());

      let board = new Board();

      game.setBoard(board.id);

      // Normal Map
      createNormalBoardLands(this.modelService, board);

      this.modelService.addModel('board', board);

      let goLands = this.modelService.getModelsByIds(
        'goLand',
        board.getLandIdsByType(LandType.go),
      );
      let constructionLands = this.modelService.getModelsByIds(
        'constructionLand',
        board.getLandIdsByType(LandType.construction),
      );
      let jailLands = this.modelService.getModelsByIds(
        'jailLand',
        board.getLandIdsByType(LandType.jail),
      );
      let parkingLands = this.modelService.getModelsByIds(
        'parkingLand',
        board.getLandIdsByType(LandType.parking),
      );

      let roomPlayers = this.modelService.getModelsByIds(
        'player',
        room.data.players,
      );

      for (let roomPlayer of roomPlayers) {
        roomPlayer.setLand(goLands[0].getLandInfo());
      }

      let data = [
        packModel(socket.room),
        packModels(roomPlayers),
        packModel(game),
        packModel(board),
        packModels(goLands),
        packModels(constructionLands),
        packModels(jailLands),
        packModels(parkingLands),
      ];

      this.io.in(room.getRoomURL()).emit('game:game-start', ...data);
    });

    socket.on('game:serve-jail-time', (bail: boolean) => {
      let room = socket.room;

      if (!room) {
        throw new Error('Room not exists');
      }

      let gameId = room.getGame();

      if (!gameId) {
        throw new Error('GameId undefined');
      }

      let game = this.modelService.getModelById('game', gameId);

      if (!game) {
        throw new Error('Game not exists');
      }

      let currentPlayerId = game.getCurrentPlayerId();

      if (!currentPlayerId) {
        throw new Error('currentPlayerId undefined');
      }

      let player = socket.player;

      if (!player) {
        throw new Error('Player not exists');
      }

      if (currentPlayerId !== player.id) {
        return;
      }

      let currentPlayer = this.modelService.getModelById(
        'player',
        currentPlayerId,
      );

      if (!currentPlayer) {
        throw new Error('currentPlayer not exists');
      }

      let landInfo = currentPlayer.getLand();
      let land = this.modelService.getModelById(
        LandTypeToModelTypeKey(landInfo.type),
        landInfo.id,
      )!;

      if (!currentPlayer.isInJail()) {
        return;
      }

      if (!isJailLand(land)) {
        return;
      }

      if (bail) {
        currentPlayer.bail(land.getBailPrice());
        this.io
          .in(room.getRoomURL())
          .emit('game:game-step', 'bail-from-jail', packModel(currentPlayer));
        return; // 保释则不会moveOnToNextPlayer
      } else {
        currentPlayer.serveJailTime();
        this.io
          .in(room.getRoomURL())
          .emit('game:game-step', 'serve-jail-time', packModel(currentPlayer));
      }

      this.moveOnToNextPlayer(socket);
    });

    socket.on('game:dice-and-decide', (diceValue: number, ...args: any[]) => {
      let room = socket.room;

      if (!room) {
        throw new Error('Room not exists');
      }

      let gameId = room.getGame();

      if (!gameId) {
        throw new Error('GameId undefined');
      }

      let game = this.modelService.getModelById('game', gameId);

      if (!game) {
        throw new Error('Game not exists');
      }

      let boardId = game.getBoard();

      if (!boardId) {
        throw new Error('boardId undefined');
      }

      let board = this.modelService.getModelById('board', boardId)!;
      let currentPlayerId = game.getCurrentPlayerId();

      if (!currentPlayerId) {
        throw new Error('currentPlayerId undefined');
      }

      let currentPlayer = this.modelService.getModelById(
        'player',
        currentPlayerId,
      );

      if (!currentPlayer) {
        throw new Error('currentPlayer not exists');
      }

      let oldLandInfo = currentPlayer.getLand();

      if (currentPlayer.isInJail()) {
        return;
      }

      if (!board) {
        throw new Error(`BoardId ${boardId} not found!`);
      }

      let landInfo = board.getNextLand(oldLandInfo, diceValue);

      if (!landInfo) {
        throw new Error("Next land's landInfo not exists");
      }

      let landModel = this.modelService.getModelById(
        LandTypeToModelTypeKey(landInfo.type),
        landInfo.id,
      );

      if (!landModel) {
        throw new Error("Next land's model not exists");
      }

      let oldLandIndex = board.indexOfLand(oldLandInfo);
      let newLandIndex = board.indexOfLand(landInfo);

      if (newLandIndex < oldLandIndex) {
        currentPlayer.increaseMoney(30);
      }

      currentPlayer.setLand(landModel.getLandInfo());

      this.io
        .in(room.getRoomURL())
        .emit('game:roll-the-dice', packModel(currentPlayer));

      if (isGoLand(landModel)) {
        this.playerMoveOnGoLand(socket, room, currentPlayer, landModel);
      } else if (isConstructionLand(landModel)) {
        this.playerMoveOnConstructionLand(
          socket,
          room,
          currentPlayer,
          landModel,
          args[0],
        );
      } else if (isJailLand(landModel)) {
        this.playerMoveOnJailLand(socket, room, currentPlayer);
      } else if (isParkingLand(landModel)) {
        this.playerMoveOnParkingLand(socket, room, currentPlayer, args[0]);
      }

      this.moveOnToNextPlayer(socket);
    });

    socket.on(
      'game:use-lucky-card',
      (playerTransfer: TransferModel<'player'>) => {
        let room = socket.room;

        if (!room) {
          throw new Error('Room not exists');
        }

        let player = this.modelService.updateModelFromTransfer(
          'player',
          playerTransfer,
        );

        this.io
          .in(room.getRoomURL())
          .emit('game:player-use-lucky-card', packModel(player));
      },
    );
  }

  private playerMoveOnGoLand(
    _socket: SocketIO.Socket,
    room: Room,
    player: Player,
    _land: GoLand,
  ): void {
    let points = [20, 30, 50];

    player.increasePoint(points[Math.floor(Math.random() * points.length)]);

    this.io
      .in(room.getRoomURL())
      .emit('game:game-step', 'move-on-go-land', packModel(player));
  }

  private playerMoveOnConstructionLand(
    _socket: SocketIO.Socket,
    room: Room,
    player: Player,
    land: ConstructionLand,
    operation: ConstructionLandArrivalOperation,
  ): void {
    switch (operation) {
      case 'rent':
        if (!land.data.owner || land.data.owner === player.id) {
          return;
        }

        let rentPrice = land.getRentPrice();

        player.decreaseMoney(rentPrice);

        let owner = this.modelService.getModelById('player', land.data.owner);

        if (!owner) {
          throw new Error('owner player model not exists');
        }

        owner.increaseMoney(rentPrice);

        this.io
          .in(room.getRoomURL())
          .emit(
            'game:game-step',
            'move-on-construction-land-and-rent',
            packModel(player),
            packModel(owner),
          );
        break;
      case 'buy':
        if (land.getLevel() === 2 || land.data.owner === player.id) {
          return;
        }

        let landOwner: Player | undefined;

        if (land.data.owner) {
          let rentPrice = land.getRentPrice();

          player.decreaseMoney(rentPrice);

          landOwner = this.modelService.getModelById('player', land.data.owner);

          if (!landOwner) {
            throw new Error('landOwner player model not exists');
          }

          landOwner.increaseMoney(rentPrice);
        }

        let price = land.getPrice();

        player.decreaseMoney(price);

        if (landOwner) {
          landOwner.increaseMoney(price);
        }

        land.setOwner(player.id);
        this.io
          .in(room.getRoomURL())
          .emit(
            'game:game-step',
            'move-on-construction-land-and-buy',
            packModel(player),
            packModel(land),
            landOwner ? packModel(landOwner) : undefined,
          );
        break;
      case 'upgrade':
        if (land.getLevel() === 2 || land.data.owner !== player.id) {
          return;
        }

        let upgradePrice = land.getUpgradePrice();

        player.decreaseMoney(upgradePrice);
        land.upgrade();

        this.io
          .in(room.getRoomURL())
          .emit(
            'game:game-step',
            'move-on-construction-land-and-upgrade',
            packModel(player),
            packModel(land),
          );
        break;
    }
  }

  private playerMoveOnJailLand(
    _socket: SocketIO.Socket,
    room: Room,
    player: Player,
  ): void {
    player.putIntoJail();

    this.io
      .in(room.getRoomURL())
      .emit('game:game-step', 'move-on-jail-land', packModel(player));
  }

  private playerMoveOnParkingLand(
    _socket: SocketIO.Socket,
    room: Room,
    player: Player,
    buyLuckyCardCount: number | undefined,
  ): void {
    if (!buyLuckyCardCount) {
      return;
    }

    console.info(player.getPoint(), buyLuckyCardCount, LUCKY_CARD_COST_POINT);

    if (player.getPoint() < buyLuckyCardCount * LUCKY_CARD_COST_POINT) {
      return;
    }

    player.buyLuckyCard(buyLuckyCardCount);

    this.io
      .in(room.getRoomURL())
      .emit('game:game-step', 'move-on-parking-land', packModel(player));
  }

  private moveOnToNextPlayer(socket: SocketIO.Socket): void {
    let room = socket.room;

    if (!room) {
      throw new Error('Room not exists');
    }

    let gameId = room.getGame();

    if (!gameId) {
      throw new Error('gameId undefined');
    }

    let game = this.modelService.getModelById('game', gameId);

    if (!game) {
      throw new Error('game not exists');
    }

    let playerIds = room.getPlayerIds();

    let players = this.modelService.getModelsByIds('player', playerIds);

    let gameOver = false;

    let winnerId: string | undefined;
    let winnerMoney: number = 0;

    for (let player of players) {
      let money = player.getMoney();

      if (money <= 0) {
        gameOver = true;

        if (money > winnerMoney) {
          winnerId = player.id;
          winnerMoney = money;
        }
      }
    }

    if (!gameOver) {
      game.moveOnToNextPlayer();

      this.randomEvents(room, game);
      this.io
        .in(room.getRoomURL())
        .emit('game:game-step', 'move-on-next-player', packModel(game));
    } else {
      this.io.in(room.getRoomURL()).emit('game:game-over', winnerId);
    }
  }

  private randomEvents(room: Room, game: Game): boolean {
    let chance = Math.random();

    // if (chance > 0.1) {
    //   return false;
    // }

    let chances = ['prison', 'bonus', 'tax'];

    let event = chances[Math.floor(Math.random() * chances.length)];

    switch (event) {
      case 'prison':
        let playerId = game.getCurrentPlayerId();

        if (!playerId) {
          throw new Error(`PlayerId ${playerId} not exists`);
        }

        let player = this.modelService.getModelById('player', playerId);

        if (!player) {
          throw new Error(`Player ${player} not exists`);
        }

        let boardId = game.getBoard();

        if (!boardId) {
          throw new Error(`BoardId ${boardId} not exists`);
        }

        let board = this.modelService.getModelById('board', boardId);

        if (!board) {
          throw new Error(`Board ${boardId} not exists`);
        }

        let jailLandInfo = board.findAJailLand();

        if (!jailLandInfo) {
          throw new Error(`There is no jail land`);
        }

        player.setLand(jailLandInfo);
        player.putIntoJail();

        this.io
          .in(room.getRoomURL())
          .emit('game:random-event-put-into-jail', packModel(player));
        break;
      case 'bonus':
        let {players: playerIds} = game.data;

        let players = this.modelService.getModelsByIds('player', playerIds);

        for (let player of players) {
          player.increaseMoney(player.getMoney() * 0.1);
        }

        this.io
          .in(room.getRoomURL())
          .emit('game:random-event-bonus', packModels(players));

        break;
      case 'tax':
        let {players: playerIds2} = game.data;

        let players2 = this.modelService.getModelsByIds('player', playerIds2);

        for (let player of players2) {
          player.decreaseMoney(player.getMoney() * 0.1);
        }

        this.io
          .in(room.getRoomURL())
          .emit('game:random-event-tax', packModels(players2));

        break;
    }

    return true;
  }
}

function createNormalBoardLands(
  modelService: ModelService,
  board: Board,
): void {
  let goLand = new GoLand();

  modelService.addModel('goLand', goLand);

  board.addLand(goLand.getLandInfo());

  createConstructionLands(3);

  let parkingLand1 = new ParkingLand();

  modelService.addModel('parkingLand', parkingLand1);

  board.addLand(parkingLand1.getLandInfo());

  createConstructionLands(3);

  let jailLand = new JailLand();

  modelService.addModel('jailLand', jailLand);

  board.addLand(jailLand.getLandInfo());

  createConstructionLands(3);

  let parkingLand3 = new ParkingLand();

  modelService.addModel('parkingLand', parkingLand3);

  board.addLand(parkingLand3.getLandInfo());

  createConstructionLands(3);

  function createConstructionLands(count: number): void {
    for (let i = 0; i < count; i++) {
      let land = new ConstructionLand();

      modelService.addModel('constructionLand', land);

      board.addLand(land.getLandInfo());
    }
  }
}
