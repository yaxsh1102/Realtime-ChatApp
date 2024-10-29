import { useEffect, useCallback, useContext } from 'react';
import { Chat, Message as MessageType } from '../../interfaces/interfaces';
import socket from '../../socket';
import { useAppContext } from '../../context/AppContext';
import { ChatMessages } from '../../interfaces/interfaces';


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
  const { chats, setChats  , currentChat , user , setChatMessages } = useAppContext();

  const handleMessageReceive = useCallback((data: MessageType) => {
  
    if(!chats){
      return 
    }

    const newChats: Chat[] =   chats.map((chat) => {
      
      if (chat._id === data.chat && data.chat!==currentChat?._id) {
       
      
        const newUnreadBy = user?._id ? [...chat.unreadBy, user._id] : chat.unreadBy;

        return {
          ...chat,
          lastMessage: data, 
          unreadBy: newUnreadBy
        };
      } else if(chat._id === data.chat && data.chat===currentChat?._id ){
        return {
          ...chat,
          lastMessage: data, 
        };


      } 

      
    
      return {
        ...chat ,
      }; 
    });
    

    const updatedChats = newChats.sort((a, b) => {
      const dateA = new Date(a.lastMessage?.createdAt || 0).getTime();
      const dateB = new Date(b.lastMessage?.createdAt || 0).getTime();
      return dateB - dateA;
    });

    setChats(updatedChats);  
      markAsChatRead(data.chat)
  

    if(data.chat===currentChat?._id){
    setCurrentMessages((prev) => [...prev, data]);
    }



    setChatMessages((prevChatMessages: ChatMessages[]) => {
      // const chatExists = prevChatMessages.some(chat => chat.chatId === data.chat);
    
      // if (!chatExists) {
      //   return [...prevChatMessages, {
      //     chatId: data?.chat,
      //     messages: [data]
      //   }]; 
      // }
    
      return prevChatMessages.map((chatMessages) => { 
        if (chatMessages.chatId === data?.chat) {
          return {
            chatId: data.chat,
            messages: [...chatMessages.messages, data]
          };
        }
        return chatMessages;
      });
    });
  
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
