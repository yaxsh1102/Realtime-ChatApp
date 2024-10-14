export function extractTime (dateStr:string):string{

    const dateObj = new Date(dateStr)
    
    const hours = dateObj.getUTCHours().toString().padStart(2, '0')
    const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0')
    
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime
    
}