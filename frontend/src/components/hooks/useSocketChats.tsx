import { useEffect, useCallback, SetStateAction } from 'react';
import { Chat } from '../../interfaces/interfaces';
import socket from '../../socket';
import { useAppContext } from '../../context/AppContext';




const useSocketChats = (currentChat :Chat|null) => {
  const { chats, setChats , setCurrentChat ,setShowGroupInfo} = useAppContext();

  const handleNewChat = useCallback((data: Chat) => {
    setChats((prevChats) => [...prevChats, data]);
  }, [setChats]);

  const handleGroupDeleted = useCallback((chatId: string) => {

    if(currentChat?._id===chatId){
        setCurrentChat(null)
        setShowGroupInfo(false)

    }
    setChats((prevChats) => prevChats.filter((oldChat) => oldChat._id !== chatId));
  }, [setChats , currentChat]);

  const handleUpdateGroup = useCallback((updatedChat: Chat) => {
  
    if(currentChat && currentChat?._id===updatedChat._id){
    
        setCurrentChat(updatedChat)
    }
    setChats((prevChats) => 
      prevChats.map((oldChat) => (oldChat._id === updatedChat._id ? updatedChat : oldChat))
    );
   
  }, [setChats , currentChat]);

  const handleRemoveFromGroup = useCallback((chatId:string)=>{
    console.log(chatId)

    if(currentChat?._id===chatId){
        setCurrentChat(null)
        setShowGroupInfo(false)
    }
    setChats((prevChats) => prevChats.filter((oldChat) => oldChat._id !== chatId));


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
