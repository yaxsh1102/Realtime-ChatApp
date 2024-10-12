import React, { useState, useEffect, ChangeEvent } from 'react';
import { MdCancel } from 'react-icons/md';
import GroupParticipants from '../group/GroupParticipants';

interface User {
  id: number;
  name: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Smith' },
  { id: 3, name: 'Charlie Brown' },
  { id: 4, name: 'David Lee' },
  { id: 5, name: 'Eva Martinez' },
];

const CreateChat: React.FC = () => {
  const [isGroupChat, setIsGroupChat] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filteredResults = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
      setIsDropdownVisible(true);
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  }, [searchTerm]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUserSelect = (user: User) => {
    console.log('Selected user:', user);
    setSearchTerm('');
    setIsDropdownVisible(false);
  };

  return (
    <div className=" sm:w-[40rem] w-[23rem] bg-[#262729] h-full sm:p-6 p-4 flex flex-col">
      <div className="mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isGroupChat}
            onChange={() => setIsGroupChat(!isGroupChat)}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
          <span className="ms-3 text-sm sm:text-base font-medium text-white">
            {isGroupChat ? 'Group Chat' : 'Single Chat'}
          </span>
        </label>
      </div>

      <div className="relative mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="md:w-full  w-[100%] mx-auto px-4 py-2 focus:outline-none text-slate-400 h-8 bg-[#2e3033] border-b-[0.5px] border-b-white focus:border-b-[1px] focus:border-indigo-600"
        />

        {isDropdownVisible && (
          <div className="absolute z-10 w-full mt-12 bg-white rounded-md shadow-lg max-h-48 overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                    <GroupParticipants></GroupParticipants>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No results found</div>
            )}
          </div>
        )} 
      </div>

      {isGroupChat && (
        <div className='flex flex-col flex-grow'>
          <p className="text-white mb-2">Members</p>
          <div className='flex-grow overflow-x-auto no-scrollbar'>
            <div className='flex space-x-2 pb-2'>
              {[...Array(6)].map((_, index) => (
                <div key={index} className='flex-shrink-0 bg-slate-700 flex justify-between items-center w-[8rem] sm:w-[8.4rem] h-12 rounded-full border-4 border-black relative px-2'>
                  <img src={`https://api.multiavatar.com/avatar${index + 1}.svg`} alt='' className='w-8 h-8' />
                  <p className='text-sm text-slate-300 truncate'>Ghanshyam</p>
                  <button className='absolute -bottom-1 right-0 focus:outline-none'>
                    <MdCancel fill='white' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className='w-full flex justify-between mt-4'>
        <button className='w-[48%] h-8 bg-indigo-600 text-white rounded'>Create</button>
        <button className='w-[48%] h-8 bg-slate-800 text-white rounded'>Cancel</button>
      </div>
    </div>
  );
};

export default CreateChat;
