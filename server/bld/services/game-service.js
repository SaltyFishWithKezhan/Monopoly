"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("shared");
class GameService {
    constructor(socketService, modelService) {
        this.socketService = socketService;
        this.modelService = modelService;
        this.io = this.socketService.io;
        this.initialize();
    }
    initialize() {
        this.socketService.io.on('connect', socket => {
            this.initializeSocket(socket);
        });
    }
    initializeSocket(socket) {
        socket.on('game:start', () => {
            if (!socket.room || !socket.player) {
                socket.emit('game:fail', 'game:start', 401, '无权限执行该操作！');
                return;
            }
            if (socket.room.getOwner() !== socket.player.id) {
                socket.emit('game:fail', 'game:start', 402, '只有房主才能开始游戏！');
                return;
            }
            let game = new shared_1.Game();
            this.modelService.addModel('game', game);
            let room = socket.room;
            room.setGame(game.id);
            game.setPlayers(room.getPlayerIds());
            let board = new shared_1.Board();
            game.setBoard(board.id);
            // Normal Map
            createNormalBoardLands(this.modelService, board);
            this.modelService.addModel('board', board);
            let goLands = this.modelService.getModelsByIds('goLand', board.getLandIdsByType(shared_1.LandType.go));
            let constructionLands = this.modelService.getModelsByIds('constructionLand', board.getLandIdsByType(shared_1.LandType.construction));
            let jailLands = this.modelService.getModelsByIds('jailLand', board.getLandIdsByType(shared_1.LandType.jail));
            let parkingLands = this.modelService.getModelsByIds('parkingLand', board.getLandIdsByType(shared_1.LandType.parking));
            let roomPlayers = this.modelService.getModelsByIds('player', room.data.players);
            for (let roomPlayer of roomPlayers) {
                roomPlayer.setLand(goLands[0].getLandInfo());
            }
            let data = [
                shared_1.packModel(socket.room),
                shared_1.packModels(roomPlayers),
                shared_1.packModel(game),
                shared_1.packModel(board),
                shared_1.packModels(goLands),
                shared_1.packModels(constructionLands),
                shared_1.packModels(jailLands),
                shared_1.packModels(parkingLands),
            ];
            this.io.in(room.getRoomURL()).emit('game:game-start', ...data);
        });
        socket.on('game:serve-jail-time', (bail) => {
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
            let currentPlayer = this.modelService.getModelById('player', currentPlayerId);
            if (!currentPlayer) {
                throw new Error('currentPlayer not exists');
            }
            let landInfo = currentPlayer.getLand();
            let land = this.modelService.getModelById(shared_1.LandTypeToModelTypeKey(landInfo.type), landInfo.id);
            if (!currentPlayer.isInJail()) {
                return;
            }
            if (!shared_1.isJailLand(land)) {
                return;
            }
            if (bail) {
                currentPlayer.bail(land.getBailPrice());
                this.io
                    .in(room.getRoomURL())
                    .emit('game:game-step', 'bail-from-jail', shared_1.packModel(currentPlayer));
            }
            else {
                currentPlayer.serveJailTime();
                this.io
                    .in(room.getRoomURL())
                    .emit('game:game-step', 'serve-jail-time', shared_1.packModel(currentPlayer));
            }
            this.moveOnToNextPlayer(socket);
        });
        socket.on('game:dice-and-decide', (diceValue, ...args) => {
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
            let board = this.modelService.getModelById('board', boardId);
            let currentPlayerId = game.getCurrentPlayerId();
            if (!currentPlayerId) {
                throw new Error('currentPlayerId undefined');
            }
            let currentPlayer = this.modelService.getModelById('player', currentPlayerId);
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
            let landModel = this.modelService.getModelById(shared_1.LandTypeToModelTypeKey(landInfo.type), landInfo.id);
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
                .emit('game:roll-the-dice', shared_1.packModel(currentPlayer));
            if (shared_1.isGoLand(landModel)) {
                this.playerMoveOnGoLand(socket, room, currentPlayer, landModel);
            }
            else if (shared_1.isConstructionLand(landModel)) {
                this.playerMoveOnConstructionLand(socket, room, currentPlayer, landModel, args[0]);
            }
            else if (shared_1.isJailLand(landModel)) {
                this.playerMoveOnJailLand(socket, room, currentPlayer);
            }
            else if (shared_1.isParkingLand(landModel)) {
                this.playerMoveOnParkingLand(socket, room, currentPlayer, args[0]);
            }
            this.moveOnToNextPlayer(socket);
        });
        socket.on('game:use-lucky-card', (playerTransfer) => {
            let room = socket.room;
            if (!room) {
                throw new Error('Room not exists');
            }
            let player = this.modelService.updateModelFromTransfer('player', playerTransfer);
            this.io
                .in(room.getRoomURL())
                .emit('game:player-use-lucky-card', shared_1.packModel(player));
        });
    }
    playerMoveOnGoLand(_socket, room, player, _land) {
        let points = [20, 30, 50];
        player.increasePoint(points[Math.floor(Math.random() * points.length)]);
        this.io
            .in(room.getRoomURL())
            .emit('game:game-step', 'move-on-go-land', shared_1.packModel(player));
    }
    playerMoveOnConstructionLand(_socket, room, player, land, operation) {
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
                    .emit('game:game-step', 'move-on-construction-land-and-rent', shared_1.packModel(player), shared_1.packModel(owner));
                break;
            case 'buy':
                if (land.getLevel() === 2 || land.data.owner === player.id) {
                    return;
                }
                let landOwner;
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
                    .emit('game:game-step', 'move-on-construction-land-and-buy', shared_1.packModel(player), shared_1.packModel(land), landOwner ? shared_1.packModel(landOwner) : undefined);
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
                    .emit('game:game-step', 'move-on-construction-land-and-upgrade', shared_1.packModel(player), shared_1.packModel(land));
                break;
        }
    }
    playerMoveOnJailLand(_socket, room, player) {
        player.putIntoJail();
        this.io
            .in(room.getRoomURL())
            .emit('game:game-step', 'move-on-jail-land', shared_1.packModel(player));
    }
    playerMoveOnParkingLand(_socket, room, player, buyLuckyCardCount) {
        if (!buyLuckyCardCount) {
            return;
        }
        if (player.getPoint() < buyLuckyCardCount * shared_1.LUCKY_CARD_COST_POINT) {
            return;
        }
        player.buyLuckyCard(buyLuckyCardCount);
        this.io
            .in(room.getRoomURL())
            .emit('game:game-step', 'move-on-parking-land', shared_1.packModel(player));
    }
    moveOnToNextPlayer(socket) {
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
        let winnerId;
        let winnerMoney = 0;
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
            this.io
                .in(room.getRoomURL())
                .emit('game:game-step', 'move-on-next-player', shared_1.packModel(game));
        }
        else {
            this.io.in(room.getRoomURL()).emit('game:game-over', winnerId);
        }
    }
}
exports.GameService = GameService;
function createNormalBoardLands(modelService, board) {
    let goLand = new shared_1.GoLand();
    modelService.addModel('goLand', goLand);
    board.addLand(goLand.getLandInfo());
    createConstructionLands(3);
    let parkingLand1 = new shared_1.ParkingLand();
    modelService.addModel('parkingLand', parkingLand1);
    board.addLand(parkingLand1.getLandInfo());
    createConstructionLands(3);
    let jailLand = new shared_1.JailLand();
    modelService.addModel('jailLand', jailLand);
    board.addLand(jailLand.getLandInfo());
    createConstructionLands(3);
    let parkingLand3 = new shared_1.ParkingLand();
    modelService.addModel('parkingLand', parkingLand3);
    board.addLand(parkingLand3.getLandInfo());
    createConstructionLands(3);
    function createConstructionLands(count) {
        for (let i = 0; i < count; i++) {
            let land = new shared_1.ConstructionLand();
            modelService.addModel('constructionLand', land);
            board.addLand(land.getLandInfo());
        }
    }
}
//# sourceMappingURL=game-service.js.map