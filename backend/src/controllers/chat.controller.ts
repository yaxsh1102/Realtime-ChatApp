import { createChatDTO } from './../dtos/one2one.dto';
import { AuthenticatRequest } from '../middlewares/auth.middleware';
import {Chat} from "../models/chat.schema"
import { User } from '../models/user.schema';
import { ErrorResponseDTO } from '../dtos/error.dto';
import { createGroupChatDTO } from '../dtos/createGroupChat.dto';
import { Response } from 'express';
import { modifyGroupDTO } from '../dtos/modifyGroup.dto';
import mongoose  from 'mongoose';
import { SuccessResponseDTO } from './../dtos/success.dto';

let errResponse:ErrorResponseDTO={
    success:false ,
    message:""
}


export const createChat = async(req: AuthenticatRequest<null>, res: Response)=>{
    try{

        const {id} = req.params;
        if(!id){
            errResponse.message="No Paramters Found"
            
            return res.status(400).json(errResponse) ;
        }

        const user = await User.findOne({_id:id})
        if(!user){
            return res.status(400).json({
                success:true ,
                message:"No such user exists" ,
            })

        }
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


            if(chat){
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
        console.log(err)

        return res.status(500).json({
            success:false ,
            message:"Error"

        })

    }

}



export const getChats = async(req : AuthenticatRequest<null> , res:Response)=>{ 
    try{

    

        const data = await Chat.find({
            members:{$elemMatch:{$eq:req.user.id}}}
        )
        .populate({path:"members" , 
            select:"name email avatar"
        })
        .populate(
            {
                path:"lastMessage" ,
                populate:{
                    path:"sender" ,
                    select:" avatar email name"
                }


        })
        .populate({path:"admin" ,  
            select:"name email avatar"
            })
        .sort({updatedAt:-1})

        if(!data){
            errResponse.message="No Chat Found"
            return res.status(400).json(errResponse)
        }

        const successresponse :SuccessResponseDTO<typeof data>={
            success:true ,
            message:"Chats Fetched" ,
            data:data
        }

        return res.status(200).json(successresponse)



        
    }catch(err){
        console.log(err)

        errResponse.message="Error Occured"
        return res.status(500).json(errResponse) 
    }
}


export const createGroupChat = async(req:AuthenticatRequest<createGroupChatDTO> , res:Response)=>{
             try{

                const {members , name}=req.body

                if(!members || !name){
                    errResponse.message="All Fields Are Required"
                    return res.status(400).json(errResponse)
                }


                const data = await Chat.create({
                    name:name ,
                    groupChat:true ,
                    admin:req.user.id ,
                    memebers:members , 

                })

                if(!data){
                    errResponse.message="Couldn't Create Group"
                    return res.status(400).json(errResponse)
                }

                const group = await Chat.findOne({_id:data._id})
                                                                .populate({
                                                                    path:"members" ,
                                                                    select:"username name avatar email"
                                                                })
                                                                .populate({
                                                                    path:"admin" ,
                                                                    select:"username name avatar email"
                                                                })

            const successResponse : SuccessResponseDTO<typeof group>={
                success:true ,
                message:"Group Created Successfully" ,
                data:group

            }
            return res.status(200).json(successResponse)






             }catch(err){
                errResponse.message="Error  Occured"
                return res.status(500).json(errResponse)

             }
}


export const addToGroupChat = async(req:AuthenticatRequest<modifyGroupDTO> , res:Response)=>{
    try{

        const {member , group} = req.body 
        if(!member || !group){
            errResponse.message="Missing Parameters"
            return res.status(400).json(errResponse)
        }

        const userExists = await User.findOne({_id:member}) 
        const groupExists = await Chat.findOne({_id:group , groupChat:true})
                                                          .populate("admin")
        if(!userExists || !groupExists){
            errResponse.message = !userExists ? ("No Such User Exists") :("No Such Group Exists")
        }

        if(req.user.id.toString()!==groupExists?.admin?._id.toString()){
            errResponse.message=="Only Admins Can Add Members"
            return res.status(400).json(errResponse)
        }
        const objectID = new mongoose.Types.ObjectId(member)

        if(groupExists.members.includes(objectID)){
            errResponse.message="Member Already Exists In Group"
            return res.status(400).json(errResponse)

        }

        groupExists.members.push(objectID) 

        await groupExists.save()

        const data = await Chat.findOne({
            _id:groupExists._id
        }
        )
        .populate("members -password")
        .populate(
            {
                path:"lastMessage" ,
                populate:{
                    path:"sender" ,
                    select:"username avatar email name"
                }


        })
        .populate("admin -password")
        .sort({updatedAt:-1})

        const success :SuccessResponseDTO<typeof data>={
            success:true ,
            message:"Added Member",
            data:data
         }
        return res.status(200).json(success)


    }catch(err){
        errResponse.message="Error Occured"
        return res.status(500).json(errResponse)

    }

}


export const removeFromGroupChat = async(req:AuthenticatRequest<modifyGroupDTO> , res:Response)=>{
    try{


        const {member , group} = req.body 
        if(!member || !group){
            errResponse.message="Missing Parameters"
            return res.status(400).json(errResponse)
        }

        const userExists = await User.findOne({_id:member}) 
        const groupExists = await Chat.findOne({_id:group , groupChat:true})
                                                          .populate("admin")
        if(!userExists || !groupExists){
            errResponse.message = !userExists ? ("No Such User Exists") :("No Such Group Exists")
        }

        if(req.user.id.toString()!==groupExists?.admin?._id.toString()){
            errResponse.message=="Only Admins Can Remove Members"
            return res.status(400).json(errResponse)
        }
        //potential threats


        const objectID = new mongoose.Types.ObjectId(member)

        if(!groupExists.members.includes(objectID)){
            errResponse.message="No Such USer Exists In Group"
            return res.status(400).json(errResponse)

        }

        const newGroup = await Chat.findOneAndUpdate({_id :group} , {$pull:{members:objectID}} , {new:true})

        const success :SuccessResponseDTO<typeof newGroup>={
            success:true ,
            message:"Member Removed Successfully" ,
            data:newGroup
        }


           

    }catch(err){
        errResponse.message="Error Occured"
        return res.status(500).json(errResponse)
    }
}


export const deleteGroupChat =async(req:AuthenticatRequest<modifyGroupDTO> ,res:Response)=>{
    try{
        const {group} = req.body ;

        if(!group){
            errResponse.message="Missing Paramter"
            return res.status(400).json(errResponse)
        }

        const deletedChat = await Chat.findOneAndDelete({_id:group , groupChat:true})
        if(!deletedChat){
            errResponse.message="No Such Group Exists"
            return res.status(400).json(errResponse)
        }

        return res.status(200).json({
            success:true ,
            message:"Group Deleted"
        })


    }catch(err){
        errResponse.message="Error Occured"
        return res.status(500).json(errResponse)

    }
}



export const getGroupChatDetails = async(req:AuthenticatRequest<null> ,res:Response )=>{
    try{
        const {chatId} = req.params ;
        if(!chatId){
            errResponse.message="No Parameters Found" 
            return res.status(400).json(errResponse)
        }

        const chat = await Chat.findOne({_id:chatId , groupChat:true})
        .populate({
            path:"members" ,
            select:"name username avatar"

        })

        if(!chat){
            errResponse.message="No Group Chat Found"
        }
        const success:SuccessResponseDTO<typeof chat>={
            success:true ,
            message:"Group Details Fetched Successfully" ,
            data:chat

        }


    }catch(err){
        errResponse.message="Error Occured"
        return res.status(500).json(errResponse)

    }
}


