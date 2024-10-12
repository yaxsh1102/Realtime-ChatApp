import React, { useState } from 'react';
import './App.css';
import Chats from './components/chats/Chats';
import './index.css';
import ChatPage from './components/chats/ChatPage';
import GroupInfo from './components/group/GroupInfo'; 
import CreateChat from './components/form/CreateChat';
import useOutsideClick from './components/hooks/useOutsideClick';
import { useRef } from 'react';

function App() {
  const [showMenu, setShowMenu] = useState<boolean>(true);
  const [showCreateChat, setShowCreateChat] = useState<boolean>(true );
  const groupInfoRef = useRef<HTMLDivElement>(null);

  useOutsideClick(groupInfoRef, () => { 
    setShowMenu(false); 
  });

  return (
    <div className="relative w-[100%]  h-screen overflow-x-hidden overflow-y-hidden bg-gradient-to-tr from-[#1c1e22] to-[#434445]">

      <div className={` text-white w-full h-full md:flex  hidden`}>
       
        <Chats />
      </div>

      <div className='md:hidden flex w-full h-full overflow-y-hidden'>
{/* <Chats></Chats>       */}
<ChatPage />


      </div>

      {(showMenu) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
      )}

{(showCreateChat) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
      )}
      

     <div className={`absolute  ${showCreateChat?`lg:left-[30%] md:left-[10%] sm:left-[2%] left-[1/2] md:top-[35%] top-[30%]`:`left-[-12000px]`}`}>
      <CreateChat></CreateChat>
      </div>
 
      <div
        className={`${
          showMenu ? 'right-0' : 'right-[-1200px]'
        } md:w-[50%] w-full h-full  absolute top-0 z-20 transition-all duration-300`}
      >
        <GroupInfo setShowMenu={setShowMenu}></GroupInfo>
      </div>
    </div>
  ); 
}

export default App;
