import React from 'react'
import { MdDeleteForever } from 'react-icons/md'

const GroupParticipants = ({isAdmin=false}) => {
  return (
    <div className='w-full border-b-[0.1px] border-b-slate-700'>
         <div className='flex justify-between  items-center h-16 mt-2 w-full'>
            <div className='flex items-center w-full'>
                <img src="https://api.multiavatar.com/mann%20male.svg" height={16} width={16} className='lg:h-12 lg:w-12 md:h-8 md:w-8' alt="" />
            <div className='flex flex-col px-4 w-full'>
                <div className='flex justify-between w-full items-center'>
                <p>{"Ghanshyam"}</p>
                </div>

                <p className='text-xs '>{"ghanu@g.co"}</p>
            </div>
            <MdDeleteForever className='w-8 h-8'/> 


            </div>  

        </div>
    </div>
  )
}

export default GroupParticipants