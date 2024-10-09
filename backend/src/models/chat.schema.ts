import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
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


module.exports = mongoose.model("Chat" , chatSchema)