import express from "express";
import { addChat, createChat, getChat, getChatList } from "../controllers/chat";

const chatRouter = express.Router();

chatRouter.post("/create-chat", createChat);
chatRouter.post("/add-chat", addChat);
chatRouter.get("/get-chat-list", getChatList);
chatRouter.get("/get-chat/:chat_id", getChat);

export default chatRouter;