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
exports.getUser = exports.login = exports.signup = void 0;
const user_schema_1 = require("../models/user.schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const assignGravatar_1 = require("../utils/assignGravatar");
let errResponse = {
    success: false,
    message: ""
};
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, gender } = req.body;
        if (!name || !email || !password || !password) {
            const errorResponse = {
                success: false,
                message: 'All fields (name, username, email, password) are required.',
            };
            return res.status(400).json(errorResponse);
        }
        const existingUser = yield user_schema_1.User.findOne({ email: email });
        console.log(1212);
        if (existingUser) {
            const errorResponse = {
                success: false,
                message: 'User Already Exists',
            };
            return res.status(400).json(errorResponse);
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield user_schema_1.User.create({
            name,
            email,
            password: hashedPassword,
            avatar: "https://api.multiavatar.com/" + (0, assignGravatar_1.assignGravatr)(gender) + ".svg",
        });
        const payload = {
            email: newUser.email,
            id: newUser._id,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h"
        });
        const userData = {
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            _id: newUser._id
        };
        const data = { user: userData, token: token };
        const successResponse = {
            success: true,
            message: "User Registered Successfully",
            data: data
        };
        return res.status(200).json(successResponse);
    }
    catch (err) {
        console.log(err);
        const errorResponse = {
            success: false,
            message: 'An unexpected error occurred. Please try again later.',
        };
        return res.status(500).json(errorResponse);
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        if (!email || !password) {
            const errorResponse = {
                success: false,
                message: 'All fields (name, username, email, password) are required.',
            };
            return res.status(400).json(errorResponse);
        }
        const user = yield user_schema_1.User.findOne({ email: email });
        console.log(user);
        if (!user) {
            const errorResponse = {
                success: false,
                message: 'No Such User Found.',
            };
            return res.status(400).json(errorResponse);
        }
        if (!(yield bcrypt_1.default.compare(password, user.password))) {
            console.log("hii");
            const errorResponse = {
                success: false,
                message: 'Incorrect Password',
            };
            return res.status(400).json(errorResponse);
        }
        const payload = {
            email: user.email,
            id: user._id,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h"
        });
        const userData = {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            _id: user._id
        };
        const data = { user: userData, token: token };
        const successResponse = {
            success: true,
            message: "User Registered Successfully",
            data: data
        };
        return res.status(200).json(successResponse);
    }
    catch (err) {
        console.log(err);
        const errorResponse = {
            success: false,
            message: 'An unexpected error occurred. Please try again later.',
        };
        return res.status(500).json(errorResponse);
    }
});
exports.login = login;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield user_schema_1.User.findById(req.user.id).select("name email _id avatar");
        const successResponse = {
            success: true,
            message: "User Details Fetched",
            data: data
        };
        return res.status(200).json(successResponse);
    }
    catch (err) {
        errResponse.message = "Internal Server Error";
        return res.status(500).json(errResponse);
    }
});
exports.getUser = getUser;
