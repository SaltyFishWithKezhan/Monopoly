"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketService {
    constructor(io) {
        this.io = io;
        this.initialize();
    }
    initialize() {
        this.io.in('lobby');
        this.io.on('connection', () => { });
    }
}
exports.SocketService = SocketService;
//# sourceMappingURL=socket-service.js.map