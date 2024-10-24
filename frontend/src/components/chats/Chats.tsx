import React , {FC, useContext, useState , useEffect} from 'react'
import { Chat } from '../../interfaces/interfaces'
import ChatComponent from './Chat'
import { CiCirclePlus } from 'react-icons/ci'
import Searchbar from '../search/Searchbar'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import Loader from '../miscellaneous/Loader'


const Chats:FC = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error('AppContext must be used within an AppProvider');
  }
  const[loading , setLoading] = useState<boolean>(false)
  const { chats , setCreateChat  , filteredChats , setChats } = appContext;
  const navigate = useNavigate()

  useEffect(()=>{
   
    async function getChats (){
      setLoading(true)
    try{
      const data = await fetch(process.env.REACT_APP_BACKEND_URL as string + "chat/get-chats" , {
        method:"GET" ,
        headers:{
          "content-type":"application/json" ,
          "Authorization":`Bearer ${localStorage.getItem("token")}`
        }
      } )
      const resp = await data.json()
      const sortedChats = resp.data.sort((a:Chat, b:Chat) => {
      const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
    
      return timeB - timeA;
    });
    
    setChats(sortedChats)
    setLoading(false)
 
    }
    catch(err){
      navigate("/login")
    
    }
  }
    getChats()

  } , [])


  



  return (
    <div className='lg:w-[30%] md:w-[45%] w-full h-full flex flex-col bg-[2f303a] bg-[#262729] border-r-[0.1px] border-slate-700] no-scrollbar text-white'> 
      <Searchbar></Searchbar>


      {loading ? <Loader text='loading chats'></Loader>
       :<> <div className='flex  justify-start items-center px-3 mt-4 hover:cursor-pointer ' onClick={()=>{setCreateChat(true)}}>
            <CiCirclePlus className='h-14 w-14 hover:fill-white'  fill='gray'></CiCirclePlus>
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
            <div className='w-full flex justify-center items-center'>No Chats Found</div>
          )
        )}
      </div></> }


     
    </div>
      
  )
} 

export default Chats