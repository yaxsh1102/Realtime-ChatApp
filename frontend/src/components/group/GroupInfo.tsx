import GroupParticipants from './GroupParticipants';
import { IoIosPeople } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import React, { Dispatch, SetStateAction } from 'react';

interface GroupInfoProps {
  setShowMenu: Dispatch<SetStateAction<boolean>>; 
  setShowCreateChat: Dispatch<SetStateAction<boolean>>; 

}

const GroupInfo: React.FC<GroupInfoProps> = ({ setShowMenu , setShowCreateChat }) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#262729] text-white relative">
      <p className='absolute top-4 left-2 hover:cursor-pointer' onClick={() => {
          console.log("Closeeeu");  
          setShowMenu(false);
      }}>
        <IoMdClose className='h-8 w-8' />
      </p>

      <div className="flex flex-col items-center p-4">
        <img src="logo512.png" className="w-16 h-16" alt="Group logo" />
        <p className="text-2xl mt-2">Youtube</p>
        <p className="text-sm">Group: 3 participants</p>
      </div>

      <div className="flex-grow flex flex-col px-4 overflow-hidden">
        <div className="flex items-center mb-4 border-b-[0.1px] border-b-slate-700">
          <IoIosPeople className="w-8 h-8 mr-2" />
          <p>3 participants</p>
        </div>

        <div className="flex-grow overflow-y-auto mb-4">
          <GroupParticipants />
          <GroupParticipants />
          <GroupParticipants />
        </div>

        <div className="flex flex-col space-y-2">
          <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={()=>{setShowCreateChat(true)}}>
            Add Participant
          </button>
          <button className="bg-red-500 text-white py-2 px-4 rounded flex items-center justify-center">
            <MdDeleteForever className="mr-2" />
            Delete Group
          </button>
        </div>
      </div>
      <p className='w-full text-center bg-[#262729] sm:h-auto h-24'></p>

    </div>
  );
};

export default GroupInfo;
