"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const FS = tslib_1.__importStar(require("fs"));
const Path = tslib_1.__importStar(require("path"));
const paths_1 = require("../paths");
const hasOwnProperty = Object.prototype.hasOwnProperty;
const CONFIG_BASE_PATH = Path.join(paths_1.PROJECT_DIR, '.config');
const SERVER_CONFIG_PATH = Path.join(CONFIG_BASE_PATH, 'server.json');
class ConfigService {
    constructor(filePath) {
        this.data = JSON.parse(FS.readFileSync(filePath).toLocaleString());
    }
    get(key, fallback) {
        let data = this.data;
        if (key) {
            if (hasOwnProperty.call(data, key)) {
                return data[key];
            }
            return fallback;
        }
        return data;
    }
}
exports.ConfigService = ConfigService;
class Config {
}
Config.server = new ConfigService(SERVER_CONFIG_PATH);
exports.Config = Config;
//# sourceMappingURL=config.js.map