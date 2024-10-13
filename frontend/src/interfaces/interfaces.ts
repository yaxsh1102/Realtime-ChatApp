export interface User {
    name: string;
    email: string;
    avatar: string;
    _id:string
}

export interface Message {
    content: string;
    sender: User;
    createdAt:string
}

export interface Chat {
    _id:string , 
    name: string;
    groupChat: boolean;
    lastMessage?: Message;  
    members: User[];
    admin?:User
}


export interface ChatMessages{
    chatId:string ,
    messages:Message[]
}
