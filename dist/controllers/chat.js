"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChat = exports.getChatList = exports.addChat = exports.createChat = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const account_1 = require("../models/account");
const chat_1 = require("../models/chat");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_token_secret";
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var chat = yield chat_1.ChatModel.findOne({
            users: [req.body.user_1, req.body.user_2],
        });
        if (!chat) {
            chat = yield chat_1.ChatModel.findOne({
                users: [req.body.user_1, req.body.user_2],
            });
            if (!chat) {
                const new_chat = new chat_1.ChatModel({
                    users: [req.body.user_1, req.body.user_2],
                    chat: [],
                });
                new_chat.save();
                res.status(200).send({
                    success: true,
                    message: "Create chat successfully",
                    new_chat,
                });
            }
            else if (chat) {
                return;
            }
        }
        else if (chat) {
            return;
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error,
        });
    }
});
exports.createChat = createChat;
const addChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var user_array = [req.body.user_1, req.body.user_2];
        const chat = yield chat_1.ChatModel.findOne({ users: user_array });
        if (!chat) {
            res.status(500).send({
                success: false,
                message: "Invalid access permission. Please login again",
            });
        }
        else if (chat) {
            const chat_item = {
                sender: req.body.sender,
                content: req.body.content,
                time: Date.now(),
            };
            var chat_array = chat.chat;
            chat_array.push(chat_item);
            chat.updateOne({
                chat: chat_array,
            });
            chat.save();
            res.status(200).send({
                success: true,
                chat: chat,
            });
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error,
        });
    }
});
exports.addChat = addChat;
const getChatList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers["authorization"];
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        const payload = decoded;
        var accountId = payload.id;
        const account = yield account_1.AccountModel.findOne({ _id: accountId });
        if (!account) {
            res.status(500).send({
                success: false,
                message: "Invalid access permission. Please login again",
            });
        }
        else if (account) {
            const chat_list = yield chat_1.ChatModel.find({ "users.phone": account.phone });
            if (!chat_list) {
                res.status(500).send({
                    success: false,
                    message: "Invalid access permission. Please login again",
                });
            }
            else if (chat_list) {
                res.status(200).send({
                    success: true,
                    chat_list,
                });
            }
        }
    }
    catch (error) { }
});
exports.getChatList = getChatList;
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var chat_id = req.params.chat_id;
        const chat = yield chat_1.ChatModel.findOne({ _id: chat_id });
        if (!chat) {
            res.status(500).send({
                success: false,
                message: "Invalid access permission. Please login again",
            });
        }
        else if (chat) {
            res.status(200).send({
                success: true,
                chat,
            });
        }
    }
    catch (error) { }
});
exports.getChat = getChat;
