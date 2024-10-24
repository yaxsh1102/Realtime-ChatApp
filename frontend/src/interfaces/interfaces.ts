export interface User {
    name: string;
    email: string;
    avatar: string;
    _id:string
}

export interface Message {
    _id?:string ,
    content: string;
    sender: User;
    createdAt:string
    chat:string ,
}

export interface Chat {
    _id:string , 
    name: string;
    groupChat: boolean;
    lastMessage?: Message;  
    members: User[];
    admin?:User;
    unreadBy:string[]
}


export interface ChatMessages{
    chatId:string ,
    messages:Message[]
}
