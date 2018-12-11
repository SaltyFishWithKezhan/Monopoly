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
            socket.emit('play:success', 'player:login', shared_1.packModel(player));
        });
    }
}
exports.PlayerService = PlayerService;
//# sourceMappingURL=player-service.js.map