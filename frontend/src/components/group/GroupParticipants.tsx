import { MdDeleteForever } from 'react-icons/md'
import { User } from '../../interfaces/interfaces'
import { useAppContext } from '../../context/AppContext'
import { IoMdExit } from "react-icons/io";
import { useState } from 'react';
import LoadingButton from '../miscellaneous/LoadingButton';

interface GroupParticpantProp{
member:User ,
isSearchResult?:boolean ,
isAdmin?:boolean

}



const GroupParticipants = ({member , isSearchResult=false , isAdmin=false}:GroupParticpantProp) => {
const {user , currentChat , chats , setChats , setCurrentChat , setShowGroupInfo , showToast} = useAppContext()
const[loading , setLoading] = useState<boolean>(false)


async function removeFromGroupHandler(){
  setLoading(true)
  try{
    const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}chat/remove-from-group`, {
      method:"POST" ,
      headers:{
        "content-type":"application/json" ,
        "Authorization":`Bearer ${localStorage.getItem("token")}`
      }
       , body:JSON.stringify({group:currentChat?._id , member:member._id})
    })


    
    const resp = await data.json()
    if(!chats){
      return
    }

    if(resp.success){
      const newChats = chats.filter((chat)=>chat._id!==currentChat?._id)
      setChats([...newChats , resp.data])
      setCurrentChat(resp.data) 
    }else{
      showToast(resp.message)
    }
    

    
  
    
  }catch(err){
    showToast("Error Occured")
  } finally{
    setLoading(false)
  }

}

async function leaveGroupHandler(){
  setLoading(true)

  try{
    const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}chat/leave-group`, {
      method:"POST" ,
      headers:{
        "content-type":"application/json" ,
        "Authorization":`Bearer ${localStorage.getItem("token")}`
      }
       , body:JSON.stringify({group:currentChat?._id })
    }) 
    const resp = await data.json()
    if(!chats){
      return
    }
    if(resp.success){
      const newChats = chats.filter((chat)=>chat._id!==currentChat?._id)
      setShowGroupInfo(false)
      setChats(newChats)
      setCurrentChat(null)
    }else{
      showToast(resp.message)
    } 

  }catch(err){
  console.log(err)
  } finally{
    setLoading(false)


  }


}


 
  return (
    <div className='w-full border-b-[1px] border-b-slate-500 text-white'>
         <div className='flex justify-between  items-center h-16 mt-2 w-full'>
            <div className='flex items-center w-full'>
                <img src={member?.avatar} height={24} width={24} className='lg:h-12 lg:w-12  h-10 w-10' alt="" />
            <div className='flex flex-col px-4 w-full'>
                <div className='flex gap-x-2 w-full items-center'>  
                <p>{member._id === user?._id ? "You" : member.name}</p>
                {member?._id === currentChat?.admin?._id &&  <p  className='w-18 text-sm px-2 text-center rounded-full bg-gray-600 flex   justify-center items-center my-auto'> admin</p>}
                </div>

                <p className='text-xs '>{member?.email}</p>
            </div>


            {
                     !isSearchResult ? (
                        currentChat?.admin?._id === user?._id && (
                          member._id === currentChat?.admin?._id ? (
                            <p onClick={leaveGroupHandler}>
                              {loading ? <LoadingButton></LoadingButton> :  <IoMdExit className='w-8 h-8' />
                              }
                            </p>
                          ) : (
                            <p className=' hover:cursor-pointer'>
                             { loading ? <LoadingButton></LoadingButton>  : <MdDeleteForever className='w-8 h-8' onClick={removeFromGroupHandler} />}
                            </p>
                          )
                        ) 
                      ) : (
                        ""
                      )
}


            </div>  

        </div>
    </div>
  )
}

export default GroupParticipants