import { useEffect, useState } from "react"

export const useDebounce = <T>(value:T , delay:number=2500)=>{
    const [debounced , setDebouncedValue] = useState<T>(value)

    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setDebouncedValue(value)
        } , delay)


        return () => clearTimeout(timeout)
    },[value])

    return debounced
}