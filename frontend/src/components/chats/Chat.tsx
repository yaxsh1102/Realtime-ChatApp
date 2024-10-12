import React from 'react'
import { Chat } from '../../interfaces/interfaces'



 

const ChatComponent = () => {
  return (
    <div className='w-full'>
        <div className='flex justify-between px-4 items-center h-16 mt-2 w-full'>
            <div className='flex items-center w-full'>
                <img src="https://api.multiavatar.com/mann%20male.svg" height={16} width={16} className='lg:h-12 lg:w-12 md:h-8 md:w-8 h-12 w-12' alt="" />
            <div className='flex flex-col px-4 w-full'>
                <div className='flex justify-between w-full items-center'>
                <p>{"Ghanshyam"}</p>
                <p className='text-xs'>11:29</p>
                </div>

                <p className='text-xs '>{"hii i was busy a bit"}</p>
            </div>


            </div> 

        </div>
    </div>
  )
}

export default ChatComponent 