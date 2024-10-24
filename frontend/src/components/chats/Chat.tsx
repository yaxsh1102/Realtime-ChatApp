import React from 'react'
import { Chat } from '../../interfaces/interfaces'
import {  useAppContext } from '../../context/AppContext';
import { extractTime } from '../miscellaneous/timeExtract';
import { useState } from 'react';



interface ChatComponentProps {
  chat: Chat; 
}




const ChatComponent:React.FC<ChatComponentProps> = ({chat}) => {

 
  const {user , currentChat} = useAppContext()
   const {setCurrentChat} = useAppContext()

   if(!user){
    return null ;
   }
   if(!chat){
    return  null
  }
   const dateStr: string = chat.lastMessage?.createdAt + "";
const messageDate: Date = new Date(dateStr); 

const isToday = (someDate: Date): boolean => {
  const today: Date = new Date();
  return someDate.getDate() === today.getDate() &&
         someDate.getMonth() === today.getMonth() &&
         someDate.getFullYear() === today.getFullYear();
};

const extractTime = (someDate: Date): string => {
  const hours: string = someDate.getHours().toString().padStart(2, '0');
  const minutes: string = someDate.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const extractDate = (someDate: Date): string => {
  const day: string = someDate.getDate().toString().padStart(2, '0');
  const month: string = (someDate.getMonth() + 1).toString().padStart(2, '0'); 
  const year: number = someDate.getFullYear();
  return `${day}/${month}/${year}`;
};

const formattedTime: string = isToday(messageDate) ? extractTime(messageDate) : extractDate(messageDate);
   const name = chat.groupChat ? (chat.name):(chat.members[0]._id===user?._id ? (chat.members[1].name):(chat.members[0].name
   )) 
   let avatar = chat.groupChat ? (chat.name):(chat.members[0]._id===user?._id ? (chat.members[1].avatar):(chat.members[0].avatar
   )) 
   
  const isUnread = chat.unreadBy.includes(user?._id)
  console.log(chat)
 


  return (
    <div className="w-full">
    <div
      className="flex justify-between px-4 items-center h-16 mt-2 w-full hover:bg-[#3a3b3d] hover:cursor-pointer"
      onClick={() => {
        setCurrentChat(chat);
      }}
    >
      <div className="flex items-center w-full">
        <img
          src={!chat.groupChat ? avatar : "group.png.png"}
          className="h-12 w-12"
          alt=""
        />
        <div className="flex flex-col px-4 w-full"> 
          <div className="flex justify-between w-full items-center">
            <p>{name.split(" ")[0]}</p>
            <p className={`text-xs ${ isUnread ? `text-green-600` :``}`}>{chat.lastMessage ? formattedTime : ""}</p>
          </div>
  
          <div className="flex justify-between w-full items-center">
            <p className="text-xs truncate">{chat.lastMessage?.content || ""}</p>
           {isUnread &&  <span>🟢</span>}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  
  )
}

export default ChatComponent 