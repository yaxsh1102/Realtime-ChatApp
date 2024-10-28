import React, { useState, useEffect, ChangeEvent } from 'react';
import { MdCancel } from 'react-icons/md';
import GroupParticipants from '../group/GroupParticipants';
import { useAppContext } from '../../context/AppContext';
import { useDebounce } from '../hooks/useDebounce';
import { User } from '../../interfaces/interfaces';
import Loader from '../miscellaneous/Loader';
import LoadingButton from '../miscellaneous/LoadingButton';



const CreateChat: React.FC = () => {
  const { setCreateChat , user , setChats  , chats , addMembers , currentChat , setShowAddMembers , setCurrentChat , showToast } = useAppContext();
  

  const [isGroupChat, setIsGroupChat] = useState<boolean>(addMembers ? true :false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [groupName,setGroupName] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, isGroupChat? 0 :1500);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>(addMembers ? [] : [user as User]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); 
  const [createLoading, setCreateLoading] = useState<boolean>(false); 

  useEffect(() => {
    if (searchTerm.length > 0) {
      setIsDropdownVisible(true);
      setLoading(true);
    } else {
      setIsDropdownVisible(false);
      setSearchResults([]);
      setLoading(false); 
    }
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUserSelect = (user: User) => {
    if(!isGroupChat && selectedMembers.length===2){
      setIsDropdownVisible(false);
      setSearchTerm('');

      return 

    }
    setSearchTerm('');
    setSelectedMembers([...selectedMembers , user])
    setIsDropdownVisible(false);
  };

  function removeMemberHandler(user:User){
    const filteredmembers = selectedMembers.filter((member)=>member._id!==user._id)
    setSelectedMembers(filteredmembers)

  }

  async function handleSearch(name: string) {
    if(!chats){
      return  null
    }
    if (isGroupChat) {
      const filteredResults = Array.from(
        new Set(
          chats.flatMap(chat => chat.members).map(member => member._id)
        )
      )
        .map(id => chats.flatMap(chat => chat.members).find(member => member._id === id)) 
        .filter(member => member && member.name.toLowerCase().includes(name.toLowerCase())) 
        .filter(member => !selectedMembers.some(selected => selected._id === member?._id)); 
  
      setSearchResults(filteredResults as User[]); 
      setLoading(false);
    } else {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}chat/get-search-results`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ name }),
        });
  
        const data = await response.json();
        setSearchResults(data.data);
        setLoading(false); 
      } catch (error) {
        setSearchResults([]);
        setLoading(false);
      }
    }
  }
  

  async function createOnetoOneChat (){

    if(selectedMembers.length!==2){
      showToast("Select atleast one person")
      return 

    }
    setCreateLoading(true)

    try{
    const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}chat/create-chat/${selectedMembers[1]._id}` , {
      method:"GET" ,
      headers:{
        "content-type":"application/json" ,
        "Authorization":`Bearer ${localStorage.getItem("token")}`
      }
    })
    const resp = await data.json()
    if(resp.success){
      if(!chats){
        return ;
      }
      setChats([resp.data , ...chats])
    } else{
      showToast(resp.message)

    }
    

    
  }catch(err){
    showToast("Error Occured")

  }finally{
    setCreateLoading(false)
    setIsDropdownVisible(false)
    setSearchTerm("")
    setCreateChat(false)
  }
}
async function createGroupChat (){

  if(selectedMembers.length<2 ){
    showToast("Atleast two people required")
    
    return 

  }

  if( groupName.trim().length===0){
    showToast("Group Name Required")

  }

  const ids = selectedMembers.map(member => member._id);
  try{
  const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}chat/create-group-chat`, {
    method:"POST" ,
    headers:{
      "content-type":"application/json" ,
      "Authorization":`Bearer ${localStorage.getItem("token")}`
    }
     , body:JSON.stringify({name:groupName , members:ids})
  })
  const resp = await data.json()
  if(resp.success){
    if(chats){
    setChats([ resp.data ,...chats ])
    }
  } else {
    showToast("Error Occured")

  }
  setIsDropdownVisible(false)
  setSearchTerm("")
  setCreateChat(false)
  setCreateLoading(false)

  
}catch(err){
  showToast("Error Occured")
}finally{
    setCreateLoading(false)
  }
}

async function addToGroup (){

  if(selectedMembers.length===0 ){
   
    return 

  }

  const id = selectedMembers[0]._id;
  try{
    setCreateLoading(true)
  const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}chat/add-to-group`, {
    method:"POST" ,
    headers:{
      "content-type":"application/json" ,
      "Authorization":`Bearer ${localStorage.getItem("token")}`
    }
     , body:JSON.stringify({group:currentChat?._id , member:id})
  })
  const resp = await data.json()
  if(resp.success){
    if(!chats){
      return 
    }
    const newChats = chats.filter((chat)=>chat._id!==currentChat?._id)
    setChats([...newChats , resp.data])
    setCurrentChat(resp.data)
  
  }
  setIsDropdownVisible(false)
  setSearchTerm("")
  setShowAddMembers(false)
  setCreateChat(false)


  
}catch(err){
}
finally{
  setCreateLoading(false)
}
}

  return (
    <div className="sm:w-[40rem] w-[23rem] bg-[#262729] h-full sm:p-6 p-4 flex flex-col">
     {!addMembers &&  <div className="mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isGroupChat}
            onChange={() => {setIsGroupChat(!isGroupChat) ; setSelectedMembers([user as User])}}
            className="sr-only peer"
            disabled={createLoading}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
          <span className="ms-3 text-sm sm:text-base font-medium text-white">
            {isGroupChat ? 'Group Chat' : 'Single Chat'}
          </span>
        </label>
      </div>
}

      <div className="relative mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="md:w-full w-[100%] mx-auto px-4 py-2 focus:outline-none text-slate-400 h-8 bg-[#2e3033] border-b-[0.5px] border-b-white focus:border-b-[1px] focus:border-indigo-600"
        />

        {isDropdownVisible && (
          <div className="absolute z-10 w-full mt-12 bg-[#393a3c] rounded-md shadow-lg max-h-48 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-2 text-gray-500">Loading...</div> 
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className="px-4 py-2 cursor-pointer "
                >
                  <GroupParticipants member={user} isSearchResult={true}></GroupParticipants> 
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No results found</div>
            )}
          </div>
        )}
      </div>

       
        <div className="flex flex-col flex-grow">
          <p className="text-white mb-2">Members</p>
          <div className="flex-grow overflow-x-auto no-scrollbar">
            <div className="flex space-x-2 pb-2">
              {selectedMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-slate-700 flex justify-between items-center max-w-[8rem] max-w-sm:w-[8.4rem] h-12 rounded-full border-4 border-black relative px-2 gap-x-2"
                >
                  <img
                    src={member.avatar}
                    alt=""
                    className="w-8 h-8"
                  />
                  <p className="text-sm text-slate-300 truncate">{member.name}</p>
                  { member._id !== user?._id && <button className="absolute -bottom-1 right-0 focus:outline-none" onClick={()=>{removeMemberHandler(member)}}>
                    <MdCancel fill="white" />
                  </button>
}
                </div>
              ))}
            </div>
          </div>
        </div>

   { isGroupChat && !addMembers &&       <div className='w-full'>
        <input
          type="text"
          placeholder="Enter Group Name.."
          value={groupName}
          onChange={(e: ChangeEvent<HTMLInputElement>)=>{
            setGroupName(e.target.value)

          }}
          className="md:w-full w-[100%] mx-auto px-4 py-2 focus:outline-none text-slate-400 h-8 bg-[#2e3033] border-b-[0.5px] border-b-white focus:border-b-[1px] focus:border-indigo-600"
        />

        </div>
}
      

    <div className="w-full flex justify-between mt-4">

      { !addMembers ? (
        <>
            <button 
              className="w-[48%] h-8 bg-indigo-600 text-white rounded flex justify-center items-center" disabled={createLoading}
              onClick={() => {
                isGroupChat ? createGroupChat() : createOnetoOneChat();
        }}
      >
                  {createLoading ? <LoadingButton/> :"Create"}
      </button>
          
        <button className="w-[48%] h-8 bg-slate-800 text-white rounded" onClick={()=>{setCreateChat(false)}} disabled={createLoading}>
          Cancel
        </button>
        </>
      ) :( <button 
        className="w-[48%] h-8 bg-indigo-600 text-white rounded" disabled={createLoading}
        onClick={() => {
          addToGroup()
  }}
>

  Add
            
</button>)
}
      </div>

    </div>
  );
};

export default CreateChat;
