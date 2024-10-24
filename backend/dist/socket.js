"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newChatIO = exports.deleteGroupIO = exports.removeFromGroupIO = exports.updateGroupIO = exports.emitMessage = void 0;
const users = {};
let ioGlobal = null;
const initializeSocket = (io) => {
    ioGlobal = io;
    io.on("connection", (socket) => {
        console.log("New client connected! Socket ID:", socket.id);
        socket.on("initializeUser", (userId) => {
            console.log(`User initialized: ${userId}`);
            if (users[userId]) {
                users[userId].disconnect();
            }
            users[userId] = socket;
            socket.join(userId);
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
                    break;
                }
            }
        });
        socket.on("startTyping", (data) => {
            data.members.forEach((member) => {
                if (users[member._id]) {
                    socket.to(member._id).emit("showTyping", data.name);
                }
            });
        });
        socket.on("stopTyping", (data) => {
            data.members.forEach((member) => {
                if (users[member._id]) {
                    socket.to(member._id).emit("stopShowingTyping");
                }
            });
        });
    });
};
const emitMessage = (userId, event, data) => {
    if (!ioGlobal) {
        console.error("Socket.io is not initialized");
        return;
    }
    if (users[userId]) {
        ioGlobal.to(users[userId].id).emit(event, data);
        console.log(`Emitting event '${event}' to user: ${userId}`);
    }
    else {
        console.log(`User with ID: ${userId} is not connected.`);
    }
};
exports.emitMessage = emitMessage;
const updateGroupIO = (userId, event, data) => {
    if (!ioGlobal) {
        console.error("Socket.io is not initialized");
        return;
    }
    if (users[userId]) {
        ioGlobal.to(users[userId].id).emit(event, data);
    }
};
exports.updateGroupIO = updateGroupIO;
const removeFromGroupIO = (userId, event, chatId) => {
    if (!ioGlobal) {
        console.error("Socket.io is not initialized");
        return;
    }
    if (users[userId]) {
        ioGlobal.to(users[userId].id).emit(event, chatId);
    }
    else {
        console.log("hii");
    }
};
exports.removeFromGroupIO = removeFromGroupIO;
const deleteGroupIO = (userId, event, chatId) => {
    if (!ioGlobal) {
        console.error("Socket.io is not initialized");
        return;
    }
    if (users[userId]) {
        console.log("pink");
        ioGlobal.to(users[userId].id).emit(event, chatId);
    }
};
exports.deleteGroupIO = deleteGroupIO;
const newChatIO = (userId, event, data) => {
    if (!ioGlobal) {
        console.error("Socket.io is not initialized");
        return;
    }
    if (users[userId]) {
        ioGlobal.to(users[userId].id).emit(event, data);
    }
};
exports.newChatIO = newChatIO;
exports.default = initializeSocket;
