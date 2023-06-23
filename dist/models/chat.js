"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = void 0;
const mongoose_1 = require("mongoose");
const Chat = new mongoose_1.Schema({
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
exports.ChatModel = (0, mongoose_1.model)("chat", Chat);
