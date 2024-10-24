import { AuthenticatRequest } from '../middlewares/auth.middleware';
import {Chat, IChat} from "../models/chat.schema"
import { User } from '../models/user.schema';
import { ErrorResponseDTO } from '../dtos/error.dto';
import { createGroupChatDTO } from '../dtos/createGroupChat.dto';
import { Response } from 'express';
import { modifyGroupDTO } from '../dtos/modifyGroup.dto';
import mongoose  from 'mongoose';
import { SuccessResponseDTO } from './../dtos/success.dto';
import { searchUserDTO } from '../dtos/searchuser.dto';
import { deleteGroupIO, emitMessage, newChatIO, updateGroupIO } from '../socket';
import { removeFromGroupIO } from '../socket';

let errResponse:ErrorResponseDTO={
    success:false ,
    message:""
}

  

export const createChat = async(req: AuthenticatRequest<null>, res: Response)=>{
    try{

        const {id} = req.params; 
        console.log(id)
        console.log(req.user.id)
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
        let chat = await Chat.findOne({
            isGroupChat: false,
            $and: [
              { members: { $elemMatch: { $eq: req.user.id } } },
              { members: { $elemMatch: { $eq: id } } },
            ],
          })
            .populate("members", "-password")
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

            let newChat:IChat = await Chat.create({
                name:"one-to-one" ,
                groupChat:false ,
                members:[id , req.user.id] 
            } )

            const createdChat = await Chat.findOne({_id : newChat._id})
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


            if(createdChat){


            newChatIO(id , "newChat" , createdChat)
            }


            

          

          

            return res.status(200).json({
                success:true ,
                message:"New Chat Created" ,
                data:createdChat
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
        .select("+unreadBy")
        .sort({updatedAt:-1})

        if(!data){
            errResponse.message="No Chat Found"
            return res.status(400).json(errResponse)
        }
        console.log(data)

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
                    members:members , 

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


                members.forEach((member)=>{
                    if(member!==req.user.id){
                      group &&   newChatIO(member , "newChat" , group)
                    }
                })


              

            const successResponse : SuccessResponseDTO<typeof group>={
                success:true ,
                message:"Group Created Successfully" ,
                data:group

            }
            return res.status(200).json(successResponse)






             }catch(err){
                console.log(err)
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
        .populate({
            path:"members" ,
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

        data?.members.forEach((member)=>{
           updateGroupIO(member._id.toString() , "updateGroup" , data) 
        })


        if(data){
        newChatIO(member , "newChat" , data)
        }



       

        const success :SuccessResponseDTO<typeof data>={
            success:true ,
            message:"Added Member",
            data:data
         }
        return res.status(200).json(success)


    }catch(err){
        console.log(err)
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


        const objectID = new mongoose.Types.ObjectId(member)

        if(!groupExists.members.includes(objectID)){
            errResponse.message="No Such User Exists In Group"
            return res.status(400).json(errResponse)

        }

        const newGroup = await Chat.findOneAndUpdate({_id :group} , {$pull:{members:objectID}} , {new:true})
        .populate({
            path:"members" ,
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

        removeFromGroupIO(member , "removeFromGroupChat" , group)


        newGroup?.members.forEach((groupMember)=>{
                updateGroupIO(groupMember._id.toString() , "updateGroup" , newGroup)
            }

        )

      
        const success :SuccessResponseDTO<typeof newGroup>={
            success:true ,
            message:"Member Removed Successfully" ,
            data:newGroup
        }

        return res.status(200).json(success)


           

    }catch(err){
        errResponse.message="Error Occured"
        return res.status(500).json(errResponse)
    }
}


export const deleteGroupChat =async(req:AuthenticatRequest<modifyGroupDTO> ,res:Response)=>{
    try{
        const {group} = req.body ;

        if(!group){
            errResponse.message="Missing Parameter"
            return res.status(400).json(errResponse)
        }

        const deletedChat = await Chat.findOneAndDelete({_id:group , groupChat:true})
        if(!deletedChat){
            errResponse.message="No Such Group Exists"
            return res.status(400).json(errResponse)
        }

        deletedChat.members.forEach((member)=>{
            deleteGroupIO(member.toString() , "deleteGroup" , group)

        })

       

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

export const getSearchResults = async(req:AuthenticatRequest<searchUserDTO> , res:Response)=>{
    try{

        const {name} = req.body ;
        if(!name){
            errResponse.message="No Parameters Found" 
            return res.status(400).json(errResponse)
        }


        const data = await User.find({
            name: { $regex: req.body.name, $options: 'i' }  
          }).select("name email avatar")

          const success:SuccessResponseDTO<typeof data>={
            success:true , 
            message:"Fetched Users" ,
            data:data
          }

          return res.status(200).json(success)

        




    }catch(err){
        errResponse.message="Error Occured"
        return res.status(500).json(errResponse)

    }

}


export const leaveGroup = async(req:AuthenticatRequest<modifyGroupDTO> , res:Response)=>{

    try{

        const { group} = req.body 
        const id = req.user.id ;
        console.log("Hiii")
        if(!group){
            errResponse.message="Missing Parameters"
            return res.status(400).json(errResponse)
        }

        let groupExists = await Chat.findOne({_id:group , groupChat:true}).populate("admin")
        

        if( !groupExists){
            errResponse.message = ("No Such Group Exists")
            return res.status(400).json(errResponse)
        }

       


        const objectID = new mongoose.Types.ObjectId(id)
    

        if(!groupExists.members.includes(objectID)){
            errResponse.message="No Such User Exists In Group"
            return res.status(400).json(errResponse)

        }
        groupExists.members=groupExists.members.filter((member)=>member._id.toString()!==(id.toString()))


        if(groupExists.admin._id.toString()===(id.toString())){
            if(groupExists.members.length>0){
                groupExists.admin=groupExists.members[0]
            }
        }


        await groupExists.save()
        console.log("pink")

        const newGroup = await Chat.findOne({_id:group , groupChat:true})
                                                    .populate({
                                                        path:"members" ,
                                                        select:"name email avatar _id"
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

                newGroup?.members.forEach((member)=>{
                    updateGroupIO(member._id.toString() , "updateGroup" , newGroup)
                })

                removeFromGroupIO(req.user.id , "leaveGroup" , group)

          

       
        const success :SuccessResponseDTO<null>={
            success:true ,
            message:"Exited Successfully" ,
        }

        return res.status(200).json(success)






    }catch(err){
        errResponse.message="Error Occured"
        return res.status(500).json(errResponse)

    }
}


