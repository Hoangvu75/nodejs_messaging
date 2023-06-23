"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_1 = require("../controllers/chat");
const chatRouter = express_1.default.Router();
chatRouter.post("/create-chat", chat_1.createChat);
chatRouter.post("/add-chat", chat_1.addChat);
chatRouter.get("/get-chat-list", chat_1.getChatList);
chatRouter.get("/get-chat/:chat_id", chat_1.getChat);
exports.default = chatRouter;
