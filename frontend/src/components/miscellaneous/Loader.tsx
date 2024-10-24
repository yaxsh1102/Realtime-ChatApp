import React from 'react'
interface props{
  text:string
}

const Loader = ({text}:props) => {
  return (
    <div className="w-full flex flex-col justify-center items-center h-full">
    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" role="status">
    </div>
    <span className="mt-2 text-white">{text}...</span>
  </div>
  
  )
}

export default Loader