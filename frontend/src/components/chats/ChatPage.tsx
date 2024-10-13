import React, { useEffect, useRef } from 'react';
import Message from './Message';
import { IoMdSend } from "react-icons/io";
import { useAppContext } from '../../context/AppContext';
import Loader from '../miscellaneous/Loader';

const ChatPage: React.FC = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { 
    selectedChatId, 
    setChatMessages, 
    chatMessages,
    setCurrentMessages ,
    currentMessages  , 
    setSelectedChatId, 
    loader, 
    currentChat ,
    setLoader,
    user 
    
  
    
  } = useAppContext();

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => { 
    async function getMessages(){
      setLoader(true)
      const texts = await fetch(process.env.REACT_APP_BACKEND_URL as string +"message/get-messages/"+currentChat?._id as string, {
        method:"GET" ,
        headers:{
          "Content-type":"application/json" , 
          "Authorization":`Bearer ${localStorage.getItem("token")}`

        }
      }) 
      const messages = await texts.json() 
      console.log(messages)
      setLoader(false)
      setChatMessages([...chatMessages , {chatId:currentChat?._id as string , messages:messages.data}])
      setCurrentMessages(messages.data)
    }
    const existingChatIndex = chatMessages.findIndex(chat => chat.chatId === selectedChatId);
    if(existingChatIndex!==-1){
      getMessages()
    } else{
      
    }

    
  }, [currentChat]);  

  useEffect(() => {
    scrollToBottom();
  }, []);

  if (!currentChat) {
    return (
      <div className='w-full h-full'>
        <p>Start Chatting with your friends</p>
      </div> 
    );
  }

  if(loader){
    return <Loader/>
  }

  return (
    <div className='w-full h-screen flex flex-col bg-gradient-to-tr from-[#1c1e22] to-[#434445]'>
      <div className='md:h-24 h-28 bg-[#262729] flex items-center text-2xl px-4 gap-x-4 border-b-[0.1px] border-slate-700'>
        <img
          src="https://api.multiavatar.com/mann%20male.svg"
          className='lg:h-10 lg:w-10 md:h-8 md:w-8 w-8'
          alt="Avatar"
        />
        <p className='text-white'>Sidhant Kotak</p>
      </div>

      <div
        ref={messagesContainerRef}
        className='flex-grow overflow-y-auto p-4 no-scrollbar'
      >

        {/* {currentChat && currentChat.map((message=>)}
        <Message isRight={true} content='' />
        <Message isRight={true} />
        <Message isRight={false} />
        <Message isRight={true} />
        <Message isRight={true} />
        <Message isRight={false} />
        <Message isRight={true} /> */}
      </div>

      <div className='h-32 w-full p-4 flex items-center bg-[#262729] border-t-[0.1px] border-slate-700'>
        <input
          className='flex-grow h-12 px-4 rounded-l-full border border-gray-300 focus:outline-none focus:border-blue-500 text-slate-500 bg-[#2e3033]'
          placeholder='Send a message..'
        />
        <button className='h-12 px-6 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 focus:outline-none'>
          <IoMdSend />
        </button>
      </div>

      <p className='w-full text-center bg-[#262729] sm:h-auto h-16'>Made By Yash Mishra</p>
    </div>
  );
};

export default ChatPage;