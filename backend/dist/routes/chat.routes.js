"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("../controllers/chat.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const chat_controller_2 = require("./../controllers/chat.controller");
const chat_controller_3 = require("../controllers/chat.controller");
const chat_controller_4 = require("../controllers/chat.controller");
const chat_controller_5 = require("../controllers/chat.controller");
const router = express_1.default.Router();
const createChatHandler = (req, res) => {
    (0, chat_controller_1.createChat)(req, res);
};
const getChatsHandler = (req, res) => {
    (0, chat_controller_1.getChats)(req, res);
};
const createGroupChatHandler = (req, res) => {
    (0, chat_controller_2.createGroupChat)(req, res);
};
const addToGroupHandler = (req, res) => {
    (0, chat_controller_3.addToGroupChat)(req, res);
};
const removeFromGroupHandler = (req, res) => {
    (0, chat_controller_1.removeFromGroupChat)(req, res);
};
const getGroupChats = (req, res) => {
    (0, chat_controller_1.getGroupChatDetails)(req, res);
};
const deleteGroupChathandler = (req, res) => {
    (0, chat_controller_5.deleteGroupChat)(req, res);
};
const getSearchResultsHandler = (req, res) => {
    (0, chat_controller_1.getSearchResults)(req, res);
};
const leaveGroupChatHandler = (req, res) => {
    (0, chat_controller_4.leaveGroup)(req, res);
};
router.get("/create-chat/:id", auth_middleware_1.AuthenticatedUser, createChatHandler);
router.get("/get-chats", auth_middleware_1.AuthenticatedUser, getChatsHandler);
router.post("/create-group-chat", auth_middleware_1.AuthenticatedUser, createGroupChatHandler);
router.post("/add-to-group", auth_middleware_1.AuthenticatedUser, addToGroupHandler);
router.post("/remove-from-group", auth_middleware_1.AuthenticatedUser, removeFromGroupHandler);
router.post("/get-search-results", auth_middleware_1.AuthenticatedUser, getSearchResultsHandler);
router.post("/leave-group", auth_middleware_1.AuthenticatedUser, leaveGroupChatHandler);
router.post("/delete-group", auth_middleware_1.AuthenticatedUser, deleteGroupChathandler);
exports.default = router;
