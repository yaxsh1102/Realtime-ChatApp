import { useEffect, useCallback, useContext } from 'react';
import { Chat, Message as MessageType } from '../../interfaces/interfaces';
import socket from '../../socket';
import { useAppContext } from '../../context/AppContext';


const markAsChatRead = async(id:string)=>{

  try{
  await fetch(`${process.env.REACT_APP_BACKEND_URL}message/mark-as-read/${id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  });
}catch(err){

}
}

const useSocketMessages = (setCurrentMessages: React.Dispatch<React.SetStateAction<MessageType[]>>) => {
  const { chats, setChats  , currentChat , user} = useAppContext();

  const handleMessageReceive = useCallback((data: MessageType) => {
    console.log('Message received:', data);
    console.log('Current chats before update:', chats);

    const newChats: Chat[] = chats.map((chat) => {
      
      if (chat._id === data.chat && data.chat!==currentChat?._id) {
       
      
        const newUnreadBy = user?._id ? [...chat.unreadBy, user._id] : chat.unreadBy;
        console.log(newUnreadBy )

        return {
          ...chat,
          lastMessage: data, 
          unreadBy: newUnreadBy
        };
      }

      
    
      return chat; 
    });
    

    const updatedChats = newChats.sort((a, b) => {
      const dateA = new Date(a.lastMessage?.createdAt || 0).getTime();
      const dateB = new Date(b.lastMessage?.createdAt || 0).getTime();
      return dateB - dateA;
    });

    setChats(updatedChats);    markAsChatRead(data.chat)
  

    if(data.chat===currentChat?._id){
      console.log("hiee")
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
