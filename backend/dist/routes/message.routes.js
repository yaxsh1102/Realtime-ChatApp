"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controllers/message.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
const sendMessageHander = (req, res) => {
    (0, message_controller_1.sendMessage)(req, res);
};
const getMessagesHandler = (req, res) => {
    (0, message_controller_1.getMessages)(req, res);
};
router.get("/get-messages/:chatId", auth_middleware_1.AuthenticatedUser, getMessagesHandler);
router.post("/send-message/:chatId", auth_middleware_1.AuthenticatedUser, sendMessageHander);
exports.default = router;
