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
exports.AuthenticatedUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_1 = require("../models/user.schema");
require("dotenv").config();
const jwt_secret = process.env.JWT_SECRET;
if (jwt_secret === undefined) {
    throw new Error("No JWT Secret Found");
}
const AuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const errResponse = {
                success: false,
                message: "Authorization Token Required",
            };
            return res.status(401).json(errResponse);
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            const errResponse = {
                success: false,
                message: "Authorization Token Required",
            };
            return res.status(401).json(errResponse);
        }
        const auth = jsonwebtoken_1.default.verify(token, jwt_secret);
        const user = yield user_schema_1.User.findById(auth.id).select("_id email");
        if (!user) {
            const errResponse = {
                success: false,
                message: "No such user exists",
            };
            return res.status(401).json(errResponse);
        }
        req.user = {
            id: user._id.toString(),
            email: user.email,
        };
        next();
    }
    catch (err) {
        console.error('Auth middleware error:', err);
        const errResponse = {
            success: false,
            message: "Token Expired",
        };
        return res.status(500).json(errResponse);
    }
});
exports.AuthenticatedUser = AuthenticatedUser;
