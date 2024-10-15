import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import Chats from './components/chats/Chats';
import './index.css';
import ChatPage from './components/chats/ChatPage';
import GroupInfo from './components/group/GroupInfo';
import CreateChat from './components/form/CreateChat';
import { useRef } from 'react';
import { AppContext } from './context/AppContext';
import Loader from './components/miscellaneous/Loader';



function App() {

  const appContext = useContext(AppContext); 

  if (!appContext) {
    throw new Error('AppContext must be used within an AppProvider');
  }

  const { chats, setChats , loader , setLoader , createChat , setCreateChat , setShowMenu , showMenu  , showGroupInfo } = appContext;
  useEffect(()=>{
    localStorage.setItem("token" , "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inlhc2giLCJpZCI6IjY3MDNjMzM4YTA2NzMyZmQ3YjU4YjdjNCIsImlhdCI6MTcyOTAxMTI0NywiZXhwIjoxNzI5MDE4NDQ3fQ.BDGdBU-LE1O28uDT7BmnPJG6iUejC_ofyVyMuL29BAk")
    async function getChats (){
    setLoader(true)
      const data = await fetch(process.env.REACT_APP_BACKEND_URL as string + "chat/get-chats" , {
        method:"GET" ,
        headers:{
          "content-type":"application/json" ,
          "Authorization":`Bearer ${localStorage.getItem("token")}`
        }
      } )
    const resp = await data.json()
    console.log(resp) 
    setChats(resp.data)
 
    }
    getChats()

  } , [])
  const groupInfoRef = useRef<HTMLDivElement>(null);
 

  

  return (
    <div className="relative w-[100%] h-screen overflow-x-hidden overflow-y-hidden bg-gradient-to-tr from-[#1c1e22] to-[#434445]">
      <div className={`text-white w-full h-full md:flex hidden`}>
        <Chats />
        <ChatPage />

      </div>

      <div className='md:hidden flex w-full h-full overflow-y-hidden'>
        <ChatPage />
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
    </div>
  );
}

export default App;