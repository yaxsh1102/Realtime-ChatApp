import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;  
  content: string;                  
  chat: mongoose.Types.ObjectId;   
  createdAt:string ;
  _id:string
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",   
      required: true
    },
    content: {
      type: String,
      required: true
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",   
      required: true
    } 
   
  
  },

  
  { timestamps: true }
);

export const Message = mongoose.model<IMessage>("Message", messageSchema);
