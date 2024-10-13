import express, { RequestHandler } from 'express'
import { contentDTO } from '../dtos/content.dto'
import { Request , Response } from 'express'
import { getMessages, sendMessage } from '../controllers/message.controller'
import { AuthenticatedUser, AuthenticatRequest } from '../middlewares/auth.middleware'




const router = express.Router()

const sendMessageHander = (req:Request<{} , {} , contentDTO> , res:Response)=>{
      sendMessage(req as AuthenticatRequest<contentDTO> , res)
}


const getMessagesHandler = (req:Request<{} , {} , null> , res:Response)=>{
    getMessages(req as AuthenticatRequest<null> , res)
}



router.get("/get-messages/:chatId" , AuthenticatedUser as RequestHandler ,getMessagesHandler )
router.post("/send-message/:chatId" , AuthenticatedUser as RequestHandler , sendMessageHander )


export default router