export interface User {
    name: string;
    username: string;
    email: string;
    avatar: string;
}

export interface Message {
    content: string;
    sender: User;
}

export interface Chat {
    name: string;
    groupChat: boolean;
    lastMessage?: Message;  
    members: User[];
}
