import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: [true, "Email already exists!"],
        required: [true, "Email is required!"],
    },
    username: {
        type: String,
        unique: [true, "Username already exists!"],
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

  
export const User = mongoose.model("User", userSchema);
