import mongoose  , {Document} from "mongoose";

export interface IChat extends Document{
    name:string ,
    groupChat:boolean , 
    lastMessage?:mongoose.Types.ObjectId ,
    members:mongoose.Types.ObjectId[] ,
    admin:mongoose.Types.ObjectId


}


const chatSchema = new mongoose.Schema<IChat>({
    name:{
        type:String ,
        required:true ,
        
    } ,

    groupChat:{
        type:Boolean ,
        required:true
    }
    ,
    lastMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    } ,

    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]

    ,admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    }

    
},
{ timestamps: true }
)


export const Chat= mongoose.model<IChat>("Chat" , chatSchema)