import React, { useEffect, useRef, useState, useCallback } from 'react';
import Message from './Message';
import { IoMdSend } from "react-icons/io";
import { useAppContext } from '../../context/AppContext';
import Loader from '../miscellaneous/Loader';
import { CiCircleInfo } from "react-icons/ci";
import socket from '../../socket';
import { Message as MessageType } from '../../interfaces/interfaces';

const ChatPage: React.FC = () => {
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const {
    selectedChatId,
    setChatMessages,
    chatMessages,
    setCurrentMessages,
    currentMessages,
    loader,
    currentChat,
    setLoader,
    setShowGroupInfo ,
    
    user
  } = useAppContext();






const scrollToBottom = useCallback(() => {
  if (messagesContainerRef.current) {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }
}, []);

const fetchMessages = useCallback(async () => {
  if (!currentChat) return;

  setLoader(true);
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}message/get-messages/${currentChat._id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    const data = await response.json(); 
    console.log(data);
    setChatMessages(prev => [...prev, { chatId: currentChat._id, messages: data.data }]);
    setCurrentMessages(data.data);
  } catch (error) {
    console.error('Error fetching messages:', error);
  } finally {
    setLoader(false);
  }
}, [currentChat]);

useEffect(() => {
  console.log("I fire once");
  const existingChat = chatMessages.find(chat => chat.chatId === currentChat?._id);

  if (existingChat) {
    setCurrentMessages(existingChat.messages);
  } else if (currentChat) {
    fetchMessages();
  }

  scrollToBottom();
}, [currentChat, fetchMessages]);

useEffect(() => {
  scrollToBottom();
}, [currentMessages, scrollToBottom]);

  const sendMessageHandler = async () => {
    if (!currentChat || !messageInputRef.current) {
      return;
    }
    const data = {
      chat:currentChat , 
      sender:user , 
      content:messageInputRef.current.value
    }
    console.log(data)
    socket.emit("newMessage" ,data)

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}message/send-message/${currentChat._id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content:  messageInputRef.current.value }) 
      }); 

      const resp = await response.json();
      console.log(resp); 
      setCurrentMessages(resp.data); 
      messageInputRef.current.value = '';
      setTimeout(scrollToBottom , 100)
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
   
  
  useEffect(() => {
    // Socket event listener setup
    const handleMessageReceive = (data: MessageType) => { 
      console.log('Message received:', data);
      setCurrentMessages(prev => [...prev, data]);
    };
  
    // Add event listener
    socket.on("receiveMessage", handleMessageReceive);
  
    // Cleanup function to remove event listener
    return () => {
      socket.off("receiveMessage", handleMessageReceive);
    };
  }, [])
  
 
  
  
  
   

  if (!currentChat) {
    return <div>Chat with your friends</div>;
  }

  const name = currentChat.groupChat ? (currentChat.name):(currentChat
    .members[0]._id===user?._id ? (currentChat.members[1].name):(currentChat
      .members[0].name
  ))

  console.log(name)
 

 

  return (
    <div className='w-full h-screen flex flex-col bg-gradient-to-tr from-[#1c1e22] to-[#434445]'>
      <div className='  h-16 min-h-[4rem] bg-[#262729] flex items-center text-2xl  border-b-[0.1px] border-slate-700 justify-between px-4'>
        <div className='flex gap-x-4'>
        <img
          src={"https://api.multiavatar.com/mann%20male.svg"}
          className='h-10 w-10 rounded-full' 
          alt={`${currentChat?.name}'s Avatar`}
        />
        <p className='text-white'>{name}</p>
        </div>  
        {currentChat.groupChat && 
        <p className='hover:cursor-pointer' onClick={()=>{setShowGroupInfo(true)}}>
        <CiCircleInfo fill="white"></CiCircleInfo>
      </p>
      }
      </div>
      

      <div
        ref={messagesContainerRef}
        className='flex-grow overflow-y-auto p-4 no-scrollbar'
      >
        {currentMessages && currentMessages.length>0 &&  currentMessages.map((message) => (
          <Message
            isRight={message.sender._id === user?._id}
            content={message.content}
            time={message.createdAt}
            name={message.sender.name}
            avatar={message.sender.avatar}
            key={message._id}
          />
        ))}
      </div>

      <div className='h-24 min-h-[6rem] w-full p-4 flex items-center bg-[#262729] border-t-[0.1px] border-slate-700'>
        <input
          className='flex-grow h-12 px-4 rounded-l-full border border-gray-300 focus:outline-none focus:border-blue-500 text-white bg-[#2e3033]'
          placeholder='Send a message..'
          ref={messageInputRef}        />
        <button
          className='h-12 px-6 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 focus:outline-none'
          onClick={sendMessageHandler}
        >
          <IoMdSend />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
