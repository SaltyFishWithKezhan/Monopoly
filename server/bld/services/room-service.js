"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Shared = tslib_1.__importStar(require("shared"));
const uuid_1 = tslib_1.__importDefault(require("uuid"));
class RoomService {
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
        socket.on('room:create', () => {
            let room = new Shared.Room(uuid_1.default());
            room.setRoomURL(`/room/${room.id}`);
            this.modelService.addModel('room', room);
            socket.emit('room:success', 'room:create', Shared.packModel(room));
        });
        socket.on('room:join', (roomName) => {
            if (!socket.player) {
                socket.emit('room:fail', 'room:join', 401, '用户未登录！');
                return;
            }
            if (!this.modelService.hasModel('room', roomName)) {
                socket.emit('room:fail', 'room:join', 402, '房间不存在！');
                return;
            }
            let room = this.modelService.getModelById('room', roomName);
            if (room.hasPlayer(socket.player.id)) {
                socket.emit('room:fail', 'room:join', 403, '已在该房间中！');
                return;
            }
            if (room.data.players.length >= 4) {
                socket.emit('room:fail', 'room:join', 404, '房间人数已满！');
                return;
            }
            if (room.getGame()) {
                socket.emit('room:fail', 'room:join', 405, '房间内游戏正在进行中！');
                return;
            }
            room.addPlayer(socket.player.id);
            socket.room = room;
            socket.join(room.getRoomURL());
            let ids = room.getPlayerIds();
            let players = this.modelService.getModelsByIds('player', ids);
            this.io
                .in(room.getRoomURL())
                .emit('room:player-join', Shared.packModel(room), Shared.packModels(players));
        });
    }
}
exports.RoomService = RoomService;
//# sourceMappingURL=room-service.js.map