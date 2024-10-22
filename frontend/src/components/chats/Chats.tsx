import React , {FC, useContext} from 'react'
import { Chat } from '../../interfaces/interfaces'
import ChatComponent from './Chat'
import { CiCirclePlus } from 'react-icons/ci'
import Searchbar from '../search/Searchbar'
import { AppContext } from '../../context/AppContext'


const Chats:FC = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error('AppContext must be used within an AppProvider');
  }
  const { chats , setCreateChat  , filteredChats } = appContext;



  return (
    <div className='lg:w-[30%] md:w-[45%] w-full h-full flex flex-col bg-[2f303a] bg-[#262729] border-r-[0.1px] border-slate-700
] no-scrollbar text-white'> 
      <Searchbar></Searchbar>


      <div className='flex  justify-start items-center px-3 mt-4' onClick={()=>{setCreateChat(true)}}>
            <CiCirclePlus className='h-14 w-14'  fill='gray'></CiCirclePlus>
            <p className='pl-3'>New Chat</p>
        </div>


    
        <div className='overflow-y-scroll no-scrollbar'>
        {filteredChats && filteredChats.length > 0 ? (
          filteredChats.map((chat: Chat) => (
            <ChatComponent key={chat._id} chat={chat} />
          ))
        ) : (
          chats && chats.length > 0 ? (
            chats.map((chat: Chat) => (
              <ChatComponent key={chat._id} chat={chat} />
            ))
          ) : (
            <div>No Chats Found</div>
          )
        )}
      </div>
    </div>
  )
} 

export default Chats