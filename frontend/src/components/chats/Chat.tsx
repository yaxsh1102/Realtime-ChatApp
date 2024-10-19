import React from 'react'
import { Chat } from '../../interfaces/interfaces'
import {  useAppContext } from '../../context/AppContext';
import { extractTime } from '../miscellaneous/timeExtract';



interface ChatComponentProps {
  chat: Chat; 
}



const ChatComponent:React.FC<ChatComponentProps> = ({chat}) => {
   const {setCurrentChat} = useAppContext()
   const dateStr = chat.lastMessage?.createdAt +""
   const formattedTime = extractTime(dateStr);


  return (
    <div className='w-full' >
        <div className='flex justify-between px-4 items-center h-16 mt-2 w-full hover:bg-[#3a3b3d] 'onClick={()=>{setCurrentChat(chat)}}>
            <div className='flex items-center w-full'>
                <img src={!chat.groupChat ? (chat.members[1].avatar) :("group.png.png")} height={16} width={16} className='lg:h-12 lg:w-12 md:h-8 md:w-8 h-12 w-12' alt="" />
            <div className='flex flex-col px-4 w-full'>
                <div className='flex justify-between w-full items-center'>
                <p>{!chat.groupChat ? chat.members[0].name : chat.name}</p>
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