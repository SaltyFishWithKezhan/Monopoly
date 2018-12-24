"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_1 = require("http");
const express_1 = tslib_1.__importDefault(require("express"));
const shared_1 = require("shared");
const socket_io_1 = tslib_1.__importDefault(require("socket.io"));
const services_1 = require("./services");
const config_1 = require("./utils/config");
const app = express_1.default();
const httpServer = http_1.createServer(app);
const io = socket_io_1.default(httpServer);
exports.httpService = new services_1.HTTPService(app, httpServer);
exports.socketService = new services_1.SocketService(io);
exports.modelService = new shared_1.ModelService();
exports.playerService = new services_1.PlayerService(exports.socketService, exports.modelService);
exports.roomService = new services_1.RoomService(exports.socketService, exports.modelService);
exports.gameService = new services_1.GameService(exports.socketService, exports.modelService);
exports.servicesReady = Promise.all([]);
function listen() {
    let port = process.env.PORT || config_1.Config.server.get('port');
    httpServer.listen(port, () => console.info(`Listening on port ${port}...`));
}
exports.listen = listen;
//# sourceMappingURL=service-entrances.js.map