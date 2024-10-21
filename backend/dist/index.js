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
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    pingTimeout: 60000,
    transports: ['websocket', 'polling']
});
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
}));
const users = {};
io.on("connection", (socket) => {
    console.log("New client connected! Socket ID:", socket.id);
    socket.on("initializeUser", (userId) => {
        console.log(`User initialized: ${userId}`);
        console.log(socket.id);
        if (users[userId]) {
            users[userId].disconnect();
            console.log(`Disconnected previous socket for user: ${userId}`);
        }
        users[userId] = socket;
        socket.join(userId);
        console.log(`Current users: ${JSON.stringify(Object.keys(users))}`); // Log current users
    });
    socket.on("joinChat", (chatId) => {
        console.log(`User joined chat: ${chatId}`);
        socket.join(chatId);
    });
    socket.on("disconnect", (reason) => {
        console.log(`Client disconnected. Reason: ${reason}`);
        for (const userId in users) {
            if (users[userId] === socket) {
                delete users[userId];
                console.log(`Removed user from tracking: ${userId}`);
                console.log(`Current users after disconnect: ${JSON.stringify(Object.keys(users))}`); // Log current users
                break;
            }
        }
    });
    socket.on("newMessage", (data) => {
        console.log("New message received:", data);
        console.log(`Current users before sending message: ${JSON.stringify(Object.keys(users))}`);
        data.chat.members.forEach((member) => {
            if (member._id.toString() !== data.sender._id.toString()) {
                console.log("Sending message to:", member._id);
                socket.to(member._id).emit("receiveMessage", {
                    sender: data.sender,
                    content: data.content,
                    createdAt: new Date().toISOString(),
                });
            }
        });
    });
});
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/chat', chat_routes_1.default);
app.use('/api/v1/message', message_routes_1.default);
(0, database_1.default)();
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
