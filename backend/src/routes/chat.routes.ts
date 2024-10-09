import express, { Response, Request, RequestHandler } from "express";
import { createChatDTO } from "../dtos/one2one.dto";
import { createChat } from "../controllers/chat.controller";
import { AuthenticatRequest } from "../middlewares/auth.middleware";
import { AuthenticatedUser } from "../middlewares/auth.middleware";

const router = express.Router();

const createChatHandler = (req: Request<{}, {}, createChatDTO>, res: Response) => {
    createChat(req as AuthenticatRequest<createChatDTO>, res);
};

router.post("/create-chat", AuthenticatedUser as RequestHandler, createChatHandler);

export default router;
