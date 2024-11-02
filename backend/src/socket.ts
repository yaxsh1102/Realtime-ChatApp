import { Server, Socket } from 'socket.io';
import { IUser } from './models/user.schema'; 
import { IMessage } from './models/message.schema';
import { IChat } from './models/chat.schema';
import mongoose from 'mongoose';

interface User {
  name: string;
  email: string;
  avatar: string;
  _id: string;
}

export interface MessageToBeSent{
  _id?:string ,
  content: string;
  sender: User;
  createdAt:string
  chat:string | mongoose.Types.ObjectId,
}

const users: { [key: string]: Socket } = {}; 

let ioGlobal: Server | null = null; 

const initializeSocket = (io: Server) => {
  ioGlobal = io; 
  io.on("connection", (socket: Socket) => {

    socket.on("initializeUser", (userId: string) => {

      if (users[userId]) {
        users[userId].disconnect();
      }

      users[userId] = socket;
      socket.join(userId); 
    });

    

    socket.on("disconnect", (reason: string) => {
      for (const userId in users) {
        if (users[userId] === socket) {
          delete users[userId];
          break;
        }
      }
    });


    socket.on("startTyping", (data) => {

      data.members.forEach((member: User) => {
        if (users[member._id]) {
          socket.to(member._id).emit("showTyping" , {name:data.name , chatId:data.chatId});
        }
      });
    });

    socket.on("stopTyping", (data) => {

      data.members.forEach((member: User) => {
        if (users[member._id]) {
          socket.to(member._id).emit("stopShowingTyping");
        }
      });
    });

    socket.on("sendNewMessage" , (data)=>{
      data.members.forEach((member:User)=>{
        if(member._id!==data.message.sender._id){
        emitMessage<typeof data.message>(member._id , "receiveMessage" , data.message)
        }
      })
     
    })


  });
};

export const emitMessage = <T>(userId: string, event: string, data: T) => {
  if (!ioGlobal) {
    return;
  }

  if (users[userId]) {
    ioGlobal.to(users[userId].id).emit(event, data);
  } else {
  }
};


export const updateGroupIO=(userId:string , event:string , data:IChat)=>{
    if (!ioGlobal) {
        return;
      }

    if(users[userId]){
        ioGlobal.to(users[userId].id).emit(event , data)
    }



}


export const removeFromGroupIO=(userId:string , event:string , chatId:string)=>{
    if (!ioGlobal) {
        return;
      }

    if(users[userId]){
        ioGlobal.to(users[userId].id).emit(event  , chatId)
    }else{
    }



}

export const deleteGroupIO = (userId:string , event:string , chatId:string)=>{
    if (!ioGlobal) {
        return;
      }

    if(users[userId]){
        ioGlobal.to(users[userId].id).emit(event  , chatId)
    }

}

export const newChatIO = (userId:string , event:string , data:IChat)=>{
  if (!ioGlobal) {
    return;
  }

if(users[userId]){
    ioGlobal.to(users[userId].id).emit(event  , data)
}

}


export default initializeSocket;
