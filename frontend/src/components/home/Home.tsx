import Chats from '../chats/Chats';
import ChatPage from '../chats/ChatPage';
import GroupInfo from '../group/GroupInfo';
import CreateChat from '../form/CreateChat';
import { useRef, useState } from 'react';
import { AppContext } from'../../context/AppContext';
import Loader from '../miscellaneous/Loader';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';
import useSocketChats from '../hooks/useSocketChats';
import { Chat } from '../../interfaces/interfaces';
const Home = () => {



  const appContext = useContext(AppContext); 
  const navigate = useNavigate()

 


  if (!appContext) {
    throw new Error('AppContext must be used within an AppProvider');
  }
  const groupInfoRef = useRef<HTMLDivElement>(null);
  const initializeRef = useRef(false);


  


  const { setChats  , setLoader , createChat  , showMenu  , showGroupInfo  , user , currentChat} = appContext;

  if(!localStorage.getItem("token")){
    navigate("/login")
  }


  useEffect(() => {
    const initializeSocket = () => {
      if (user?._id && !initializeRef.current) {
        
        socket.disconnect();
        
        socket.connect();
        socket.emit("initializeUser", user._id);
        
        initializeRef.current = true;
      }
    };
  
    initializeSocket();
  
    return () => {
      socket.disconnect();
      initializeRef.current = false;
    };
  }, [user?._id]);

 



 
  return (
    <div className="relative w-[100%] h-screen overflow-x-hidden overflow-y-hidden bg-gradient-to-tr from-[#1c1e22] to-[#434445]">
      <div className={`text-white w-full h-full md:flex hidden`}>
        <Chats />
        <ChatPage />

      </div>

      <div className='md:hidden flex w-full h-full overflow-y-hidden'>
        {currentChat ? <ChatPage></ChatPage> :<Chats></Chats>}
      </div>

      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
      )}

      {createChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center">
          <div className="bg-[#262729] rounded-lg p-4">
            <CreateChat />
          </div>
        </div>
      )}

      <div
        ref={groupInfoRef}
        className={`${
          showGroupInfo ? 'right-0' : 'right-[-1200px]'
        } md:w-[50%] w-full h-full absolute top-0 z-20 transition-all duration-300`}
      >
        <GroupInfo />
      </div>
   </div>  )
}

export default Home 