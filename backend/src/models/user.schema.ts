import mongoose, { Document } from "mongoose";



export interface IUser extends Document{
    name:string ,
    email:string ,
    username:string ,
    avatar:string ,
    password:string ,
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true, 
        required: [true, "Email is required!"],
    },
    username: {
        type: String,
        unique: true,
        required:true
    },
    avatar: {
        type: String,
        default: "ht",
    },
    password:{
        type:String , 
        required:true
    }
});

  
export const User = mongoose.model<IUser>("User", userSchema);
