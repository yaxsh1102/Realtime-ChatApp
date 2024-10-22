import { useEffect, useCallback, useContext } from 'react';
import { Chat, Message as MessageType } from '../../interfaces/interfaces';
import socket from '../../socket';
import { useAppContext } from '../../context/AppContext';

const useSocketMessages = (setCurrentMessages: React.Dispatch<React.SetStateAction<MessageType[]>>) => {
  const { chats, setChats  , currentChat} = useAppContext();

  const handleMessageReceive = useCallback((data: MessageType) => {
    console.log('Message received:', data);
    console.log('Current chats before update:', chats);

    const newChats: Chat[] = chats.map((chat) => {
      
      if (chat._id === data.chat) {
        return { ...chat, lastMessage: data }; 
      }
      return chat; 
    });

    setChats(newChats);
    console.log(data)
    console.log(currentChat)

    if(data.chat===currentChat?._id){
    setCurrentMessages((prev) => [...prev, data]);
    }
  }, [setCurrentMessages, chats , currentChat]);

  useEffect(() => {
    socket.off('receiveMessage');
    socket.on('receiveMessage', handleMessageReceive);

    return () => {
      socket.off('receiveMessage');
    };
  }, [handleMessageReceive]);
};

export default useSocketMessages;
