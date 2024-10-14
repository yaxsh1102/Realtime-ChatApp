import React from 'react'
import { extractTime } from '../miscellaneous/timeExtract'
import { useAppContext } from '../../context/AppContext'

interface MessageProps{
  isRight:boolean ,
  content:string ,
  time:string ,
  name:string ,
  avatar :string
}

const Message = ({ isRight = true , content , time  , name , avatar}:MessageProps) => {
  console.log("hooi")

  const timeStr = extractTime(time)
  const {user} = useAppContext()

  return (
    <div className={`w-full flex ${isRight ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 lg:max-w-72 max-w-64 rounded-lg p-1.5  ${isRight ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <img
          src={isRight ? user?.avatar : avatar}
          alt="avatar"
          className="h-8 w-8 rounded-full flex-shrink-0"
        />
        <div className="flex flex-col overflow-hidden flex-grow min-w-0 bg-[#262729] rounded-md">
          <p className="text-xs font-semibold truncate text-indigo-700 px-2">{name}</p>
          <p className="text-md break-words text-white px-2 py-2">
            {content}
          </p>
          <p className="text-[9px] text-right text-white/80 mt-0.5 px-2">{timeStr}</p>
        </div>
      </div>
    </div>
  )
} 

export default Message