import express, { Response, Request, RequestHandler } from "express";
import { createChat  , getChats, removeFromGroupChat , getGroupChatDetails, getSearchResults} from "../controllers/chat.controller";
import { AuthenticatRequest } from "../middlewares/auth.middleware";
import { AuthenticatedUser } from "../middlewares/auth.middleware";
import { createGroupChat } from './../controllers/chat.controller';
import { createGroupChatDTO } from "../dtos/createGroupChat.dto";
import { modifyGroupDTO } from "../dtos/modifyGroup.dto";
import { addToGroupChat } from "../controllers/chat.controller";
import { searchUserDTO } from "../dtos/searchuser.dto";
import { leaveGroup } from "../controllers/chat.controller";

const router = express.Router();

const createChatHandler = (req: Request<{}, {}, null>, res: Response) => {
    createChat(req as AuthenticatRequest<null>, res);
};

const getChatsHandler = (req:Request<{} , {} , null> , res:Response)=>{
    getChats(req as AuthenticatRequest<null>, res)
}
const createGroupChatHandler = (req:Request<{} , {} , createGroupChatDTO> , res:Response)=>{
    createGroupChat(req as AuthenticatRequest<createGroupChatDTO>, res)
}

const addToGroupHandler = (req:Request<{} , {} , modifyGroupDTO>  , res:Response)=>{
    addToGroupChat(req as AuthenticatRequest<modifyGroupDTO> , res)
}

const removeFromGroupHandler = (req:Request<{}, {} , modifyGroupDTO> , res:Response)=>{
    removeFromGroupChat(req as AuthenticatRequest< modifyGroupDTO> , res )
}

const getGroupChats = (req:Request<{}, {} , null> , res:Response)=>{
    getGroupChatDetails(req as AuthenticatRequest<null> , res )
}

const getSearchResultsHandler = (req:Request<{}, {} , searchUserDTO> , res:Response)=>{
    getSearchResults(req as AuthenticatRequest<searchUserDTO> , res )
}

const leaveGroupChatHandler = (req:Request<{}, {} , modifyGroupDTO> , res:Response)=>{
    leaveGroup(req as AuthenticatRequest<modifyGroupDTO> , res )
}
router.get("/create-chat/:id",AuthenticatedUser as RequestHandler ,  createChatHandler);
router.get("/get-chats", AuthenticatedUser as RequestHandler, getChatsHandler);
router.post("/create-group-chat" , AuthenticatedUser as RequestHandler , createGroupChatHandler)
router.post("/add-to-group" ,AuthenticatedUser as RequestHandler ,  addToGroupHandler)
router.post("/remove-from-group" , AuthenticatedUser as RequestHandler , removeFromGroupHandler)
router.post("/get-search-results" , AuthenticatedUser as RequestHandler , getSearchResultsHandler)
router.post("/exit-group" ,AuthenticatedUser as RequestHandler ,leaveGroupChatHandler  )

export default router;
