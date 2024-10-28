import React, { createContext, ReactNode, useState, useContext } from "react";
import { Chat, User , ChatMessages, Message } from "../interfaces/interfaces";
import toast from "react-hot-toast"
import { Toaster } from "react-hot-toast";



interface AppContextType {
  user: User|null;
  setUser: React.Dispatch<React.SetStateAction<User|null>>;
  loader: boolean;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  chats: Chat[] | null;
  setChats: React.Dispatch<React.SetStateAction<Chat[] | null>>;
  filteredChats: Chat[]|null;
  setFilteredChats: React.Dispatch<React.SetStateAction<Chat[]|null>>;
  selectedChatId:string|null ,
  setSelectedChatId:React.Dispatch<React.SetStateAction<string|null>>
  currentMessages: Message[] | null;
  setCurrentMessages: React.Dispatch<React.SetStateAction<Message[] >>;
  chatMessages: ChatMessages[] ;
  setChatMessages:React.Dispatch<React.SetStateAction<ChatMessages[]>>
  currentChat:Chat|null ,
  setCurrentChat :React.Dispatch<React.SetStateAction<Chat|null>> ,
  showMenu:boolean, 
  setShowMenu:React.Dispatch<React.SetStateAction<boolean>> ,
  createChat:boolean ,
  setCreateChat:React.Dispatch<React.SetStateAction<boolean>>  ,
  showGroupInfo:boolean ,
  setShowGroupInfo:React.Dispatch<React.SetStateAction<boolean>>  ,
  addMembers:boolean ,
  setShowAddMembers:React.Dispatch<React.SetStateAction<boolean>>  ,
  showToast:(message:string)=>void

  

}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User|null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [chats, setChats] = useState<Chat[] | null>(null);
  const [filteredChats, setFilteredChats] = useState<Chat[]|null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const[chatMessages , setChatMessages]=useState<ChatMessages[]>([])
  const[selectedChatId , setSelectedChatId]=useState<string|null>(null)
  const[currentChat , setCurrentChat] = useState<Chat|null>(null)
  const[showMenu , setShowMenu] = useState<boolean>(false)
  const[createChat , setCreateChat] = useState<boolean>(false)
  const[showGroupInfo , setShowGroupInfo] = useState<boolean>(false) 
  const[addMembers , setShowAddMembers] = useState<boolean>(false)

  const showToast =(message:string)=>{
    console.log(message)
    toast.remove()
    toast(message , {
      duration:2000 ,
      style: { 
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    })

  }


  const contextValue: AppContextType = {
    user,
    setUser,
    loader,
    setLoader,
    chats,
    setChats,
    currentMessages,
    setCurrentMessages,
    chatMessages ,
    setChatMessages ,
    selectedChatId ,
    setSelectedChatId ,
    currentChat , 
    setCurrentChat ,
    showMenu , 
    setShowMenu ,
    createChat ,
    setCreateChat ,
    filteredChats ,
    setFilteredChats ,
    showGroupInfo ,
    setShowGroupInfo ,
    addMembers , 
    setShowAddMembers ,
    showToast
  
     

  };

  return (
    <AppContext.Provider value={contextValue}>
      <Toaster/>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) { 
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export { AppContext };