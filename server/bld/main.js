"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_entrances_1 = require("./service-entrances");
service_entrances_1.servicesReady
    .then(() => {
    service_entrances_1.listen();
})
    .catch(error => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map