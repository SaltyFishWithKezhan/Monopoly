"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const paths_1 = require("../paths");
class HTTPService {
    constructor(app, httpServer) {
        this.app = app;
        this.httpServer = httpServer;
        this.initialize();
    }
    listen(port = 8090) {
        this.httpServer.listen(port);
    }
    stop() {
        this.httpServer.close();
    }
    initialize() {
        this.app.use(express_1.default.static(paths_1.CLIENT_BUILD_DIR));
        this.app.use(express_1.default.static(paths_1.CLIENT_PUBLIC_DIR));
    }
}
exports.HTTPService = HTTPService;
//# sourceMappingURL=http-service.js.map