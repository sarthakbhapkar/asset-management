"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const users_1 = __importDefault(require("./Routes/users"));
const login_1 = __importDefault(require("./Routes/login"));
const assets_1 = __importDefault(require("./Routes/assets"));
const request_1 = __importDefault(require("./Routes/request"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/users', users_1.default);
app.use('/login', login_1.default);
app.use('/assets', assets_1.default);
app.use('/request', request_1.default);
http_1.default.createServer(app).listen(PORT, () => {
    console.log(`Express is listening at http://localhost:${PORT}`);
});
