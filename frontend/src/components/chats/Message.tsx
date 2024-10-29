import React from 'react';
import { extractTime } from '../miscellaneous/timeExtract';
import { useAppContext } from '../../context/AppContext';

interface MessageProps {
  isRight: boolean;
  content: string;
  time: string;
  name: string;
  avatar: string;
}

const Message = ({ isRight = true, content, time, name, avatar }: MessageProps) => {
  const timeStr = extractTime(time);
  const { user, currentChat } = useAppContext() ;
 
  return (
    <div className={`w-full flex ${isRight ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 lg:max-w-72 max-w-64 p-1.5 ${isRight ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {!isRight && (
          <img
            src={avatar} 
            alt="avatar"
            className="h-6 w-6 rounded-full flex-shrink-0 mt-2"
          />
        )}
        <div className="flex flex-col overflow-hidden flex-grow min-w-0 bg-[#262729] p-2 rounded-tl-lg ">
          {currentChat?.groupChat && (
            <p className="text-sm font-semibold truncate text-indigo-700">{name.split(" ")[0]}</p>
          )}
          <div className="flex justify-between items-end">
            <p className="text-md break-words text-white">{content}</p>
            <p className="text-xs text-white/80 ml-2 self-end">{timeStr}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
