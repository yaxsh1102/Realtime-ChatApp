import React from 'react'
import { Chat } from '../../interfaces/interfaces'
import {  useAppContext } from '../../context/AppContext';
import { extractTime } from '../miscellaneous/timeExtract';
import { useState } from 'react';



interface ChatComponentProps {
  chat: Chat; 
}




const ChatComponent:React.FC<ChatComponentProps> = ({chat}) => {

  const {user} = useAppContext()
   const {setCurrentChat} = useAppContext()
   const dateStr = chat.lastMessage?.createdAt +""
   const formattedTime = extractTime(dateStr);
   const name = chat.groupChat ? (chat.name):(chat.members[0]._id===user?._id ? (chat.members[1].name):(chat.members[0].name
   ))  


  return (
    <div className='w-full' >
        <div className='flex justify-between px-4 items-center h-16 mt-2 w-full hover:bg-[#3a3b3d] 'onClick={()=>{setCurrentChat(chat)}}>
            <div className='flex items-center w-full'>
                <img src={!chat.groupChat ? ("https://api.multiavatar.com/mann%20male.svg") :("group.png.png")}   className='h-12 w-12' alt="" />
            <div className='flex flex-col px-4 w-full'>
                <div className='flex justify-between w-full items-center'>
                <p>{name}</p>
                <p className='text-xs'>{chat.lastMessage? (formattedTime):  ""}</p>
                </div> 

                <p className='text-xs '>{chat.lastMessage?.content || ""}</p>
            </div>
            </div>



        </div> 
    </div> 
  )
}

export default ChatComponent 