import { Request } from "express";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorResponseDTO } from "../dtos/error.dto";
import { User as UserModel } from "../models/user.schema";
import mongoose from "mongoose";

interface User {
    id: string;
    email: string;
}

export interface AuthenticatRequest<T = null> extends Request {
    user: User;
    body: T;
    headers: {
        [key: string]: string | undefined;
        authorization?: string;
    };
}

interface JWTPayload {
    id: string;
}

require("dotenv").config();
const jwt_secret = process.env.JWT_SECRET;

if (jwt_secret === undefined) {
    throw new Error("No JWT Secret Found");
}

export const AuthenticatedUser = async (
    req: AuthenticatRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            const errResponse: ErrorResponseDTO = {
                success: false,
                message: "Authorization Token Required",
            };
            return res.status(401).json(errResponse);
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            const errResponse: ErrorResponseDTO = {
                success: false,
                message: "Authorization Token Required",
            };
            return res.status(401).json(errResponse);
        }

        const auth = jwt.verify(token, jwt_secret) as JWTPayload;
        
        const user = await UserModel.findById(auth.id).select("_id email");
        
        if (!user) {
            const errResponse: ErrorResponseDTO = {
                success: false,
                message: "No such user exists",
            };
            return res.status(401).json(errResponse);
        }

        req.user = {
            id: (user._id as mongoose.Types.ObjectId).toString(), 
            email: user.email,
        };
        
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        
        const errResponse: ErrorResponseDTO = {
            success: false,
            message: "Token Expired",
        };
        return res.status(500).json(errResponse);
    }
};