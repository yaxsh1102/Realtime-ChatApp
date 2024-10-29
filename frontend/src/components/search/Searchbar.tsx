
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { IoIosLogOut } from "react-icons/io";


const Searchbar = () => {
  const {  setFilteredChats  , chats} = useAppContext();
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    if (searchValue.trim() === '') {
      setFilteredChats(chats);
    } else {
      if (!chats || chats.length === 0) {
        return;
      }
      const filtered = chats.filter(chat =>
        chat.members.some(member =>
          member.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
      setFilteredChats(filtered);
    } 
  }, [searchValue]);
  ;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setSearchValue(e.target.value);
  };

  function logOutHandler(){
    localStorage.removeItem("token") 
    window.location.replace("/login")
    
  }

  return (
    <div className="flex flex-col w-full h-28 justify-center px-4 gap-y-2 mt-4">
      <div className='flex w-[95%]  justify-between'>
      <p className='text-xl lg:px-2 md:px-1'>Chats</p>
      <p onClick={logOutHandler} className='hover:cursor-pointer'>
      <IoIosLogOut className='w-8 h-8'></IoIosLogOut>
      </p>
      </div>
      <input
        type="text"
        className="lg:w-[95%] md:w-[95%] w-[95%] py-1 outline-none rounded-sm text-sm lg:px-2 md:px-1 text-slate-400 h-10 bg-[#2e3033] border-b-[0.5px] border-b-white focus:border-b-[1px] focus:border-indigo-600 px-2"
        placeholder="Search people and groups...."
        value={searchValue}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default Searchbar;