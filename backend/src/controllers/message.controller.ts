import { Chat } from "../models/chat.schema";
import { Request , Response } from "express";
import { ErrorResponseDTO } from "../dtos/error.dto";
import { AuthenticatRequest } from "../middlewares/auth.middleware";
import mongoose from "mongoose";
import { Message } from "../models/message.schema";
import { SuccessResponseDTO } from "../dtos/success.dto";
import { contentDTO } from "../dtos/content.dto";
import { User } from "../models/user.schema";
import { IChat } from "../models/chat.schema";
import { IMessage } from "../models/message.schema";

let errResponse:ErrorResponseDTO={
    success:false ,
    message:""
}


export const getMessages = async(req:AuthenticatRequest<null> , res:Response)=>{
    try {
        const {chatId} = req.params ;

        if(!chatId){
            errResponse.message='Missing Parameters'
            return res.status(400).json(errResponse)

        }


        const chats = await Chat.findOne({_id:chatId})
        const objectID = new mongoose.Types.ObjectId(req.user.id)
        if(!chats?.members.includes(objectID)){
            errResponse.message="User Is Not a Part of this chat"
            return res.status(400).json(errResponse)
        }


        const messages = await Message.find({chat:chatId})
                                                .populate({
                                                    path:"sender" , 
                                                    select:"name username avatar"
                                                })
                                                .populate("chat")



        const success:SuccessResponseDTO<typeof messages>={
            success:true ,
            message:"Chats Fetched Successfully" ,
            data:messages
        }

        return res.status(200).json(success)

                                        
    } catch (error) {
        console.log(error)
        errResponse.message="Error Ocurred" 
        return res.status(500).json(errResponse)
        
    }
}



export const sendMessage = async(req:AuthenticatRequest<contentDTO> , res:Response)=>{
    try{
        const {chatId} = req.params 
        const {content} = req.body ;
        console.log(req.body)


        if(!chatId || !content){
            errResponse.message="Missing parameters"
            return res.status(400).json(errResponse)
            
        }

        const chat:IChat | null = await Chat.findOne({_id:chatId})
        if(!chat){
            errResponse.message="No Chats Found"
            return res.status(400).json(errResponse)
        }

        let message :IMessage = await Message.create({
            sender:new mongoose.Types.ObjectId(req.user.id),
            content:content,
            chat: new mongoose.Types.ObjectId(chatId) ,

        })


        chat.lastMessage=message._id as mongoose.Types.ObjectId ;
        await chat.save()


        const newMessage =await Message.find({chat:chatId})
                                                    .populate({
                                                        path:"sender" , 
                                                        select:"name username avatar"
                                                    })
                                                    .populate("chat")




                    if (!newMessage) {
                    errResponse.message = "Message creation failed";
                    return res.status(500).json(errResponse);
                    }
                
                    const successResponse: SuccessResponseDTO<typeof newMessage> = {
                    success: true,
                    message: "Message sent successfully",
                    data: newMessage,
                    };
 
                    return res.status(200).json(successResponse);
                                                          

        

       







    }catch(err){
        errResponse.message="Error Occured" 
        return res.status(500).json(errResponse)

    }
}