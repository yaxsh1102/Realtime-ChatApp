export function extractTime (dateStr:string):string{

    const dateObj = new Date(dateStr)
    
        const hours: string = dateObj.getHours().toString().padStart(2, '0');
        const minutes: string = dateObj.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      
    
}