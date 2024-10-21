import React, { createContext, ReactNode, useState, useContext } from "react";
import { Chat, User , ChatMessages, Message } from "../interfaces/interfaces";

interface AppContextType {
  user: User|null;
  setUser: React.Dispatch<React.SetStateAction<User|null>>;
  loader: boolean;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
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
  onlineMember:string[] ,
  setOnlineMember:React.Dispatch<React.SetStateAction<string[]>>
  

}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User|null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]|null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const[chatMessages , setChatMessages]=useState<ChatMessages[]>([])
  const[selectedChatId , setSelectedChatId]=useState<string|null>(null)
  const[currentChat , setCurrentChat] = useState<Chat|null>(null)
  const[showMenu , setShowMenu] = useState<boolean>(false)
  const[createChat , setCreateChat] = useState<boolean>(false)
  const[showGroupInfo , setShowGroupInfo] = useState<boolean>(false)
  const[addMembers , setShowAddMembers] = useState<boolean>(false)
  const[onlineMember , setOnlineMember] = useState<string[]>([])


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
    onlineMember ,
     setOnlineMember
     

  };

  return (
    <AppContext.Provider value={contextValue}>
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