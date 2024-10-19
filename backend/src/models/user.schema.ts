import mongoose, { Document } from "mongoose";



export interface IUser extends Document{
    name:string ,
    email:string ,
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
