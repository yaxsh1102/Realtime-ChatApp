"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const database_1 = __importDefault(require("./config/database"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const socket_1 = __importDefault(require("./socket"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    pingTimeout: 60000,
    transports: ['websocket', 'polling']
});
(0, socket_1.default)(io);
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/chat', chat_routes_1.default);
app.use('/api/v1/message', message_routes_1.default);
(0, database_1.default)();
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
