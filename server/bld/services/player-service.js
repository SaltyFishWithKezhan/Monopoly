"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("shared");
class PlayerService {
    constructor(socketService, modelService) {
        this.socketService = socketService;
        this.modelService = modelService;
        this.initialize();
    }
    initialize() {
        this.socketService.io.on('connect', socket => {
            this.initializeSocket(socket);
        });
    }
    initializeSocket(socket) {
        socket.on('player:login', (name) => {
            if (this.modelService.hasModel('player', name)) {
                socket.emit('player:fail', 'player:login', 201, '玩家名字已经存在啦！');
                return;
            }
            let player = new shared_1.Player(name);
            this.modelService.addModel('player', player);
            socket.player = player;
            socket.emit('player:success', 'player:login', shared_1.packModel(player));
        });
        socket.on('disconnect', () => {
            if (!socket.player || !socket.room) {
                return;
            }
            let player = socket.player;
            let room = socket.room;
            room.removePlayer(player.id);
            this.modelService.removeModel('player', player.id);
            if (room.isEmpty()) {
                this.modelService.removeModel('room', room.id);
                this.cleanUpRoom(room);
            }
            else {
                socket
                    .to(room.getRoomURL())
                    .emit('room:player-leave', player.id, shared_1.packModel(room));
            }
        });
    }
    cleanUpRoom(room) {
        let gameId = room.getGame();
        if (!gameId) {
            return;
        }
        let game = this.modelService.getModelById('game', gameId);
        if (!game) {
            return;
        }
        this.modelService.removeModel('game', game.id);
        let boardId = game.getBoard();
        if (!boardId) {
            return;
        }
        let board = this.modelService.getModelById('board', boardId);
        if (!board) {
            return;
        }
        let landInfos = board.getLands();
        for (let { id, type } of landInfos) {
            let key = shared_1.LandTypeToModelTypeKey(type);
            this.modelService.removeModel(key, id);
        }
    }
}
exports.PlayerService = PlayerService;
//# sourceMappingURL=player-service.js.map