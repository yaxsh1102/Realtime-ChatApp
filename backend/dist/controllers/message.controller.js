"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = void 0;
const chat_schema_1 = require("../models/chat.schema");
const mongoose_1 = __importDefault(require("mongoose"));
const message_schema_1 = require("../models/message.schema");
let errResponse = {
    success: false,
    message: ""
};
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        if (!chatId) {
            errResponse.message = 'Missing Parameters';
            return res.status(400).json(errResponse);
        }
        const chats = yield chat_schema_1.Chat.findOne({ _id: chatId });
        const objectID = new mongoose_1.default.Types.ObjectId(req.user.id);
        if (!(chats === null || chats === void 0 ? void 0 : chats.members.includes(objectID))) {
            errResponse.message = "User Is Not a Part of this chat";
            return res.status(400).json(errResponse);
        }
        const messages = yield message_schema_1.Message.find({ chat: chatId })
            .populate({
            path: "sender",
            select: "name username avatar"
        })
            .populate("chat");
        const success = {
            success: true,
            message: "Chats Fetched Successfully",
            data: messages
        };
        return res.status(200).json(success);
    }
    catch (error) {
        console.log(error);
        errResponse.message = "Error Ocurred";
        return res.status(500).json(errResponse);
    }
});
exports.getMessages = getMessages;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const { content } = req.body;
        console.log(req.body);
        if (!chatId || !content) {
            errResponse.message = "Missing parameters";
            return res.status(400).json(errResponse);
        }
        const chat = yield chat_schema_1.Chat.findOne({ _id: chatId });
        if (!chat) {
            errResponse.message = "No Chats Found";
            return res.status(400).json(errResponse);
        }
        let message = yield message_schema_1.Message.create({
            sender: new mongoose_1.default.Types.ObjectId(req.user.id),
            content: content,
            chat: new mongoose_1.default.Types.ObjectId(chatId),
        });
        chat.lastMessage = message._id;
        yield chat.save();
        const newMessage = yield message_schema_1.Message.find({ chat: chatId })
            .populate({
            path: "sender",
            select: "name username avatar"
        })
            .populate("chat");
        if (!newMessage) {
            errResponse.message = "Message creation failed";
            return res.status(500).json(errResponse);
        }
        const successResponse = {
            success: true,
            message: "Message sent successfully",
            data: newMessage,
        };
        return res.status(200).json(successResponse);
    }
    catch (err) {
        errResponse.message = "Error Occured";
        return res.status(500).json(errResponse);
    }
});
exports.sendMessage = sendMessage;
