import { Request } from "express";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorResponseDTO } from "../dtos/error.dto";
import { User as UserModel } from "../models/user.schema";

interface User {
    id: string;
    email: string;
}

export interface AuthenticatRequest<T = any> extends Request {
    user: User;  
    body: T;     
}





require("dotenv").config();
const jwt_secret = process.env.JWT_SCERET;

if (jwt_secret === undefined) {
    throw new Error("No JWT Secret Found");
}

export const AuthenticatedUser = async (
    req: AuthenticatRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let token = req.headers['authorization'];
        if (!token) {
            const errResponse: ErrorResponseDTO = {
                success: false,
                message: "Authorization Token Required",
            };
            return res.status(401).json(errResponse);
        }

        if (typeof token === 'string') {
            token = token.split(' ')[1]; 
        } else {
            const errorResponse: ErrorResponseDTO = {
                success: false,
                message: "Invalid Authorization Token",
            };
            return res.status(400).json(errorResponse);
        } 
        
        if (!token) {
            const errResponse: ErrorResponseDTO = {
                success: false,
                message: "Authorization Token Required",
            };
            return res.status(401).json(errResponse);
        }

        const auth = jwt.verify(token, jwt_secret) as { id: string };
        const user = await UserModel.findById(auth.id).select("_id email");
        if (!user) {
            const errResponse: ErrorResponseDTO = {
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
    } catch (err) {
        const errResponse: ErrorResponseDTO = {
            success: false,
            message: "Error Occurred",
        };
        return res.status(500).json(errResponse);
    }
};

