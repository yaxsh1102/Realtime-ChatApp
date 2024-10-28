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
exports.leaveGroup = exports.getSearchResults = exports.getGroupChatDetails = exports.deleteGroupChat = exports.removeFromGroupChat = exports.addToGroupChat = exports.createGroupChat = exports.getChats = exports.createChat = void 0;
const chat_schema_1 = require("../models/chat.schema");
const user_schema_1 = require("../models/user.schema");
const mongoose_1 = __importDefault(require("mongoose"));
const socket_1 = require("../socket");
const socket_2 = require("../socket");
let errResponse = {
    success: false,
    message: ""
};
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id);
        console.log(req.user.id);
        if (!id) {
            errResponse.message = "No Paramters Found";
            return res.status(400).json(errResponse);
        }
        const user = yield user_schema_1.User.findOne({ _id: id });
        if (!user) {
            return res.status(400).json({
                success: true,
                message: "No such user exists",
            });
        }
        let chat = yield chat_schema_1.Chat.findOne({
            isGroupChat: false,
            $and: [
                { members: { $elemMatch: { $eq: req.user.id } } },
                { members: { $elemMatch: { $eq: id } } },
            ],
        })
            .populate("members", "-password")
            .populate({
            path: "latestMessage",
            populate: {
                path: "sender",
                select: "name pic email",
            },
        });
        if (chat) {
            return res.status(200).json({
                success: true,
                message: "Chats Fetched Successfully",
                data: chat
            });
        }
        let newChat = yield chat_schema_1.Chat.create({
            name: "one-to-one",
            groupChat: false,
            members: [id, req.user.id]
        });
        const createdChat = yield chat_schema_1.Chat.findOne({ _id: newChat._id })
            .populate({ path: "members",
            select: "name email avatar"
        })
            .populate({
            path: "lastMessage",
            populate: {
                path: "sender",
                select: " avatar email name"
            }
        })
            .populate({ path: "admin",
            select: "name email avatar"
        })
            .sort({ updatedAt: -1 });
        if (createdChat) {
            (0, socket_1.newChatIO)(id, "newChat", createdChat);
        }
        return res.status(200).json({
            success: true,
            message: "New Chat Created",
            data: createdChat
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error"
        });
    }
});
exports.createChat = createChat;
const getChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield chat_schema_1.Chat.find({
            members: { $elemMatch: { $eq: req.user.id } }
        })
            .populate({ path: "members",
            select: "name email avatar"
        })
            .populate({
            path: "lastMessage",
            populate: {
                path: "sender",
                select: " avatar email name"
            }
        })
            .populate({ path: "admin",
            select: "name email avatar"
        })
            .select("+unreadBy")
            .sort({ updatedAt: -1 });
        if (!data) {
            errResponse.message = "No Chat Found";
            return res.status(400).json(errResponse);
        }
        console.log(data);
        const successresponse = {
            success: true,
            message: "Chats Fetched",
            data: data
        };
        return res.status(200).json(successresponse);
    }
    catch (err) {
        console.log(err);
        errResponse.message = "Error Occured";
        return res.status(500).json(errResponse);
    }
});
exports.getChats = getChats;
const createGroupChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { members, name } = req.body;
        if (!members || !name) {
            errResponse.message = "All Fields Are Required";
            return res.status(400).json(errResponse);
        }
        const data = yield chat_schema_1.Chat.create({
            name: name,
            groupChat: true,
            admin: req.user.id,
            members: members,
        });
        if (!data) {
            errResponse.message = "Couldn't Create Group";
            return res.status(400).json(errResponse);
        }
        const group = yield chat_schema_1.Chat.findOne({ _id: data._id })
            .populate({
            path: "members",
            select: "username name avatar email"
        })
            .populate({
            path: "admin",
            select: "username name avatar email"
        });
        members.forEach((member) => {
            if (member !== req.user.id) {
                group && (0, socket_1.newChatIO)(member, "newChat", group);
            }
        });
        const successResponse = {
            success: true,
            message: "Group Created Successfully",
            data: group
        };
        return res.status(200).json(successResponse);
    }
    catch (err) {
        console.log(err);
        errResponse.message = "Error  Occured";
        return res.status(500).json(errResponse);
    }
});
exports.createGroupChat = createGroupChat;
const addToGroupChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { member, group } = req.body;
        if (!member || !group) {
            errResponse.message = "Missing Parameters";
            return res.status(400).json(errResponse);
        }
        const userExists = yield user_schema_1.User.findOne({ _id: member });
        const groupExists = yield chat_schema_1.Chat.findOne({ _id: group, groupChat: true })
            .populate("admin");
        if (!userExists || !groupExists) {
            errResponse.message = !userExists ? ("No Such User Exists") : ("No Such Group Exists");
        }
        if (req.user.id.toString() !== ((_a = groupExists === null || groupExists === void 0 ? void 0 : groupExists.admin) === null || _a === void 0 ? void 0 : _a._id.toString())) {
            errResponse.message == "Only Admins Can Add Members";
            return res.status(400).json(errResponse);
        }
        const objectID = new mongoose_1.default.Types.ObjectId(member);
        if (groupExists.members.includes(objectID)) {
            errResponse.message = "Member Already Exists In Group";
            return res.status(400).json(errResponse);
        }
        groupExists.members.push(objectID);
        yield groupExists.save();
        const data = yield chat_schema_1.Chat.findOne({
            _id: groupExists._id
        })
            .populate({
            path: "members",
            select: "name email avatar"
        })
            .populate({
            path: "lastMessage",
            populate: {
                path: "sender",
                select: " avatar email name"
            }
        })
            .populate({ path: "admin",
            select: "name email avatar"
        })
            .sort({ updatedAt: -1 });
        data === null || data === void 0 ? void 0 : data.members.forEach((member) => {
            (0, socket_1.updateGroupIO)(member._id.toString(), "updateGroup", data);
        });
        if (data) {
            (0, socket_1.newChatIO)(member, "newChat", data);
        }
        const success = {
            success: true,
            message: "Added Member",
            data: data
        };
        return res.status(200).json(success);
    }
    catch (err) {
        console.log(err);
        errResponse.message = "Error Occured";
        return res.status(500).json(errResponse);
    }
});
exports.addToGroupChat = addToGroupChat;
const removeFromGroupChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { member, group } = req.body;
        if (!member || !group) {
            errResponse.message = "Missing Parameters";
            return res.status(400).json(errResponse);
        }
        const userExists = yield user_schema_1.User.findOne({ _id: member });
        const groupExists = yield chat_schema_1.Chat.findOne({ _id: group, groupChat: true })
            .populate("admin");
        if (!userExists || !groupExists) {
            errResponse.message = !userExists ? ("No Such User Exists") : ("No Such Group Exists");
        }
        if (req.user.id.toString() !== ((_b = groupExists === null || groupExists === void 0 ? void 0 : groupExists.admin) === null || _b === void 0 ? void 0 : _b._id.toString())) {
            errResponse.message == "Only Admins Can Remove Members";
            return res.status(400).json(errResponse);
        }
        const objectID = new mongoose_1.default.Types.ObjectId(member);
        if (!groupExists.members.includes(objectID)) {
            errResponse.message = "No Such User Exists In Group";
            return res.status(400).json(errResponse);
        }
        const newGroup = yield chat_schema_1.Chat.findOneAndUpdate({ _id: group }, { $pull: { members: objectID } }, { new: true })
            .populate({
            path: "members",
            select: "name email avatar"
        })
            .populate({
            path: "lastMessage",
            populate: {
                path: "sender",
                select: " avatar email name"
            }
        })
            .populate({ path: "admin",
            select: "name email avatar"
        })
            .sort({ updatedAt: -1 });
        (0, socket_2.removeFromGroupIO)(member, "removeFromGroupChat", group);
        newGroup === null || newGroup === void 0 ? void 0 : newGroup.members.forEach((groupMember) => {
            (0, socket_1.updateGroupIO)(groupMember._id.toString(), "updateGroup", newGroup);
        });
        const success = {
            success: true,
            message: "Member Removed Successfully",
            data: newGroup
        };
        return res.status(200).json(success);
    }
    catch (err) {
        errResponse.message = "Error Occured";
        return res.status(500).json(errResponse);
    }
});
exports.removeFromGroupChat = removeFromGroupChat;
const deleteGroupChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { group } = req.body;
        if (!group) {
            errResponse.message = "Missing Parameter";
            return res.status(400).json(errResponse);
        }
        const deletedChat = yield chat_schema_1.Chat.findOneAndDelete({ _id: group, groupChat: true });
        if (!deletedChat) {
            errResponse.message = "No Such Group Exists";
            return res.status(400).json(errResponse);
        }
        deletedChat.members.forEach((member) => {
            (0, socket_1.deleteGroupIO)(member.toString(), "deleteGroup", group);
        });
        return res.status(200).json({
            success: true,
            message: "Group Deleted"
        });
    }
    catch (err) {
        errResponse.message = "Error Occured";
        return res.status(500).json(errResponse);
    }
});
exports.deleteGroupChat = deleteGroupChat;
const getGroupChatDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        if (!chatId) {
            errResponse.message = "No Parameters Found";
            return res.status(400).json(errResponse);
        }
        const chat = yield chat_schema_1.Chat.findOne({ _id: chatId, groupChat: true })
            .populate({
            path: "members",
            select: "name username avatar"
        });
        if (!chat) {
            errResponse.message = "No Group Chat Found";
        }
        const success = {
            success: true,
            message: "Group Details Fetched Successfully",
            data: chat
        };
    }
    catch (err) {
        errResponse.message = "Error Occured";
        return res.status(500).json(errResponse);
    }
});
exports.getGroupChatDetails = getGroupChatDetails;
const getSearchResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            errResponse.message = "No Parameters Found";
            return res.status(400).json(errResponse);
        }
        const data = yield user_schema_1.User.find({
            name: { $regex: req.body.name, $options: 'i' }
        }).select("name email avatar");
        const success = {
            success: true,
            message: "Fetched Users",
            data: data
        };
        return res.status(200).json(success);
    }
    catch (err) {
        errResponse.message = "Error Occured";
        return res.status(500).json(errResponse);
    }
});
exports.getSearchResults = getSearchResults;
const leaveGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { group } = req.body;
        const id = req.user.id;
        console.log("Hiii");
        if (!group) {
            errResponse.message = "Missing Parameters";
            return res.status(400).json(errResponse);
        }
        let groupExists = yield chat_schema_1.Chat.findOne({ _id: group, groupChat: true }).populate("admin");
        if (!groupExists) {
            errResponse.message = ("No Such Group Exists");
            return res.status(400).json(errResponse);
        }
        const objectID = new mongoose_1.default.Types.ObjectId(id);
        if (!groupExists.members.includes(objectID)) {
            errResponse.message = "No Such User Exists In Group";
            return res.status(400).json(errResponse);
        }
        groupExists.members = groupExists.members.filter((member) => member._id.toString() !== (id.toString()));
        if (groupExists.admin._id.toString() === (id.toString())) {
            if (groupExists.members.length > 0) {
                groupExists.admin = groupExists.members[0];
            }
        }
        yield groupExists.save();
        console.log("pink");
        const newGroup = yield chat_schema_1.Chat.findOne({ _id: group, groupChat: true })
            .populate({
            path: "members",
            select: "name email avatar _id"
        })
            .populate({
            path: "lastMessage",
            populate: {
                path: "sender",
                select: " avatar email name"
            }
        })
            .populate({ path: "admin",
            select: "name email avatar"
        });
        newGroup === null || newGroup === void 0 ? void 0 : newGroup.members.forEach((member) => {
            (0, socket_1.updateGroupIO)(member._id.toString(), "updateGroup", newGroup);
        });
        (0, socket_2.removeFromGroupIO)(req.user.id, "leaveGroup", group);
        const success = {
            success: true,
            message: "Exited Successfully",
        };
        return res.status(200).json(success);
    }
    catch (err) {
        errResponse.message = "Error Occured";
        return res.status(500).json(errResponse);
    }
});
exports.leaveGroup = leaveGroup;
