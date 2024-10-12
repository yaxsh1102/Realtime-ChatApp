import React from 'react'

const Searchbar = () => {
  return (
    <div className="flex flex-col  w-full h-28 justify-center  px-4 gap-y-2 mt-4">
         <p className='text-xl lg:px-2 md:px-1'>Chats</p>
        <input
            type="text"
            className=" lg:w-[95%] md:w-[95%] w-[95%] py-1 outline-none rounded-sm text-sm lg:px-2 md:px-1 text-slate-400 h-10 bg-[#2e3033] border-b-[0.5px] border-b-white focus:border-b-[1px] focus:border-indigo-600 px-2"
            placeholder="Search people and groups...."
        />
        
</div>
  )
}

export default Searchbar 