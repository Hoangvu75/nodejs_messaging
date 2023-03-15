import { Schema, model } from "mongoose";

const Chat = new Schema({
  users: {
    type: [
      {
        phone: { type: String },
        name: { type: String },
      },
    ],
  },
  chat: [
    {
      sender: { type: String },
      content: { type: String },
      time: { type: Number },
    },
  ],
});

export const ChatModel = model("chat", Chat);
