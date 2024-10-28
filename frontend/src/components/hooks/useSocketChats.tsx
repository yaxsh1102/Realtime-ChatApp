import { useEffect, useCallback, SetStateAction } from 'react';
import { Chat } from '../../interfaces/interfaces';
import socket from '../../socket';
import { useAppContext } from '../../context/AppContext';




const useSocketChats = (currentChat :Chat|null) => {

  const {  setChats , setCurrentChat ,setShowGroupInfo , chats} = useAppContext();



  const handleNewChat = useCallback((data: Chat) => {
   

    setChats(prevChats => {
      if (!prevChats) return [data];
      return [data, ...prevChats];
    });  }, [setChats]);

  const handleGroupDeleted = useCallback((chatId: string) => {

    if(currentChat?._id===chatId){
        setCurrentChat(null)
        setShowGroupInfo(false)

    }
    setChats(prevChats => {
      if (!prevChats) return [];
      return prevChats.filter(chat => chat._id !== chatId);
    });
  }, [currentChat, setChats, setCurrentChat, setShowGroupInfo]); 

  const handleUpdateGroup = useCallback((updatedChat: Chat) => {
  
    if(currentChat && currentChat?._id===updatedChat._id){
    
        setCurrentChat(updatedChat)
    }
    setChats(prevChats => {
      if (!prevChats) return [updatedChat];
      return prevChats.map(chat => 
        chat._id === updatedChat._id ? updatedChat : chat
      );
    });
   
  }, [setChats , currentChat]);

  const handleRemoveFromGroup = useCallback((chatId:string)=>{

    if(currentChat?._id===chatId){
        setCurrentChat(null)
        setShowGroupInfo(false)
    }
    setChats(prevChats => {
      if (!prevChats) return [];
      return prevChats.filter(chat => chat._id !== chatId);
    });

  } , [setChats , currentChat])

  useEffect(() => {
 

    socket.off('newChat');
    socket.off('deleteGroup');
    socket.off('updateGroup');
    socket.off('removeFromGroupChat')
    



    socket.on('newChat', handleNewChat);
    socket.on('deleteGroup', handleGroupDeleted);
    socket.on('updateGroup', handleUpdateGroup);
    socket.on('removeFromGroupChat' , handleRemoveFromGroup)

    return () => {
      socket.off('newChat', handleNewChat);
      socket.off('deleteGroup', handleGroupDeleted);
      socket.off('updateGroup', handleUpdateGroup);
      socket.off('removeFromGroupChat' , handleRemoveFromGroup)

    };
  }, [handleNewChat, handleGroupDeleted, handleUpdateGroup , handleRemoveFromGroup]);


};

export default useSocketChats;
