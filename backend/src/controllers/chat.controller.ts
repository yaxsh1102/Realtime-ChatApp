import { createChatDTO } from './../dtos/one2one.dto';
import { AuthenticatRequest } from '../middlewares/auth.middleware';
import { Response } from 'express';
import {Chat} from "../models/chat.schema"


export const createChat = async(req: AuthenticatRequest<createChatDTO>, res: Response)=>{
    try{

        const {id} = req.body
        let chat = await Chat.find({
            isGroupChat: false,
            $and: [
              { users: { $elemMatch: { $eq: req.user.id } } },
              { users: { $elemMatch: { $eq: id } } },
            ],
          })
            .populate("users", "-password")
            .populate({
              path: "latestMessage",
              populate: {
                path: "sender",
                select: "name pic email",
              },
            });


            if(chat.length>0){
                return res.status(200).json({
                    success:true ,
                    message:"Chats Fetched Successfully" ,
                    data:chat
                })
            } 

            let newChat = await Chat.create({
                name:"one-to-one" ,
                groupChat:false ,
                members:[id , req.user.id] 
            })


            return res.status(200).json({
                success:true ,
                message:"New Chat Created" ,
                data:newChat
            })



           

    }catch(err){

        return res.status(500).json({
            success:false ,
            message:"Error"

        })

    }

}