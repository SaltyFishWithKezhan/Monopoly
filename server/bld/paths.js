"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Path = tslib_1.__importStar(require("path"));
exports.PROJECT_DIR = Path.join(__dirname, '../../');
exports.SERVER_DIR = Path.join(exports.PROJECT_DIR, 'server');
exports.CLIENT_DIR = Path.join(exports.PROJECT_DIR, 'client');
exports.CLIENT_BUILD_DIR = Path.join(exports.CLIENT_DIR, 'bld');
exports.CLIENT_PUBLIC_DIR = Path.join(exports.CLIENT_DIR, 'public');
//# sourceMappingURL=paths.js.map