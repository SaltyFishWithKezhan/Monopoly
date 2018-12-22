import {
  Board,
  ConstructionLand,
  ConstructionLandArrivalOperation,
  Game,
  GoLand,
  // JailLand,
  LandType,
  LandTypeToModelTypeKey,
  ModelService,
  ParkingLand,
  Player,
  Room,
  isConstructionLand,
  isGoLand,
  isJailLand,
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
      let room = socket.room!;
      let gameId = room.getGame()!;
      let game = this.modelService.getModelById('game', gameId)!;
      let currentPlayerId = game.getCurrentPlayerId()!;

      if (currentPlayerId !== socket.player!.id) {
        return;
      }

      let currentPlayer = this.modelService.getModelById(
        'player',
        currentPlayerId,
      )!;
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
      } else {
        currentPlayer.serveJailTime();
        this.io
          .in(room.getRoomURL())
          .emit('game:game-step', 'serve-jail-time', packModel(currentPlayer));
      }

      this.moveOnToNextPlayer(socket);
    });

    socket.on('game:dice-and-decide', (diceValue: number, ...args: any[]) => {
      let room = socket.room!;
      let gameId = room.getGame()!;
      let game = this.modelService.getModelById('game', gameId)!;
      let boardId = game.getBoard()!;
      let board = this.modelService.getModelById('board', boardId)!;
      let currentPlayerId = game.getCurrentPlayerId()!;
      let currentPlayer = this.modelService.getModelById(
        'player',
        currentPlayerId,
      )!;
      let oldLandInfo = currentPlayer.getLand();

      if (currentPlayer.isInJail()) {
        return;
      }

      if (!board) {
        throw new Error(`BoardId ${boardId} not found!`);
      }

      let landInfo = board.getNextLand(oldLandInfo, diceValue)!;

      let landModel = this.modelService.getModelById(
        LandTypeToModelTypeKey(landInfo.type),
        landInfo.id,
      )!;

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
      }

      this.moveOnToNextPlayer(socket);
    });
  }

  private playerMoveOnGoLand(
    _socket: SocketIO.Socket,
    room: Room,
    player: Player,
    land: GoLand,
  ): void {
    player.increaseMoney(land.data.salary);

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

        let owner = this.modelService.getModelById('player', land.data.owner)!;

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

        if (land.data.owner) {
          let rentPrice = land.getRentPrice();

          player.decreaseMoney(rentPrice);
        }

        let price = land.getPrice();

        player.decreaseMoney(price);
        land.setOwner(player.id);
        this.io
          .in(room.getRoomURL())
          .emit(
            'game:game-step',
            'move-on-construction-land-and-buy',
            packModel(player),
            packModel(land),
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

  private moveOnToNextPlayer(socket: SocketIO.Socket): void {
    let room = socket.room!;
    let gameId = room.getGame()!;
    let game = this.modelService.getModelById('game', gameId)!;

    game.moveOnToNextPlayer();

    this.io
      .in(room.getRoomURL())
      .emit('game:game-step', 'move-on-next-player', packModel(game));
  }
}

function createNormalBoardLands(
  modelService: ModelService,
  board: Board,
): void {
  let goLand = new GoLand();

  modelService.addModel('goLand', goLand);

  board.addLand(goLand.getLandInfo());

  createConstructionLands(4);

  let parkingLand1 = new ParkingLand();

  modelService.addModel('parkingLand', parkingLand1);

  board.addLand(parkingLand1.getLandInfo());

  createConstructionLands(4);

  // let jailLand = new JailLand();

  // modelService.addModel('jailLand', jailLand);

  // board.addLand(jailLand.getLandInfo());

  let parkingLand2 = new ParkingLand();

  modelService.addModel('parkingLand', parkingLand1);

  board.addLand(parkingLand2.getLandInfo());

  createConstructionLands(4);

  let parkingLand3 = new ParkingLand();

  modelService.addModel('parkingLand', parkingLand2);

  board.addLand(parkingLand3.getLandInfo());

  createConstructionLands(4);

  function createConstructionLands(count: number): void {
    for (let i = 0; i < count; i++) {
      let land = new ConstructionLand();

      modelService.addModel('constructionLand', land);

      board.addLand(land.getLandInfo());
    }
  }
}
