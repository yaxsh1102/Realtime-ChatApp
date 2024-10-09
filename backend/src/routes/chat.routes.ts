import express, { Response , Request } from "express"
import { createChatDTO } from "../dtos/one2one.dto";
const router = express.Router()
import { createChat } from "../controllers/chat.controller"
import { AuthenticatRequest } from "../middlewares/auth.middleware";

const createChatHandler = (req: Request<{}, {}, createChatDTO>, res: Response) => {
    createChat(req as AuthenticatRequest<createChatDTO>, res:Response);
  };
  
  
