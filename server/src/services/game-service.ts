import {
  Board,
  ConstructionLand,
  Game,
  GoLand,
  JailLand,
  LandInfo,
  LandType,
  LandTypeToModelTypeKey,
  ModelService,
  ParkingLand,
  Player,
  Room,
  packModel,
  packModels,
} from 'shared';

import {SocketService} from './socket-service';

export class GameService {
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

      socket.room.setGame(game.id);

      let board = new Board();
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
        socket.room.data.players,
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

      socket.emit('game:success', 'game:start', ...data);
      socket.to(socket.room.getRoomURL()).emit('game:game-start', ...data);

      this.triggerNextStep(socket);
    });
  }

  private triggerNextStep(socket: SocketIO.Socket): void {
    if (!socket.player || !socket.room) {
      return;
    }

    let room = socket.room;
    let gameId = room.getGame();

    if (!gameId) {
      return;
    }

    let game = this.modelService.getModelById('game', gameId);

    if (!game) {
      return;
    }

    let currentPlayerId = game.getCurrentPlayerId();

    if (!currentPlayerId) {
      return;
    }

    let currentPlayer = this.modelService.getModelById(
      'player',
      currentPlayerId,
    );

    if (!currentPlayer) {
      return;
    }

    let landInfo = currentPlayer.getLand();

    let landModel = this.modelService.getModelById(
      LandTypeToModelTypeKey(landInfo.type),
      landInfo.id,
    );

    game.moveOnToNextPlayer();
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

  let jailLand = new JailLand();

  modelService.addModel('jailLand', jailLand);

  board.addLand(jailLand.getLandInfo());

  createConstructionLands(4);

  let parkingLand2 = new ParkingLand();

  modelService.addModel('parkingLand', parkingLand2);

  board.addLand(parkingLand2.getLandInfo());

  createConstructionLands(4);

  function createConstructionLands(count: number): void {
    for (let i = 0; i < count; i++) {
      let land = new ConstructionLand();

      modelService.addModel('constructionLand', land);

      board.addLand(land.getLandInfo());
    }
  }
}
