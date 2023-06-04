import jwt, { JwtPayload } from "jsonwebtoken";
import express from "express";

import { AccountModel } from "../models/account";
import { ChatModel } from "../models/chat";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "access_token_secret";

export const createChat = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    var chat = await ChatModel.findOne({
      users: [req.body.user_1, req.body.user_2],
    });
    if (!chat) {
      chat = await ChatModel.findOne({
        users: [req.body.user_1, req.body.user_2],
      });
      if (!chat) {
        const new_chat = new ChatModel({
          users: [req.body.user_1, req.body.user_2],
          chat: [],
        });
        new_chat.save();
        res.status(200).send({
          success: true,
          message: "Create chat successfully",
          new_chat,
        });
      } else if (chat) {
        return;
      }
    } else if (chat) {
      return;
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const addChat = async (req: express.Request, res: express.Response) => {
  try {
    var user_array = [req.body.user_1, req.body.user_2];
    const chat = await ChatModel.findOne({ users: user_array });
    if (!chat) {
      res.status(500).send({
        success: false,
        message: "Invalid access permission. Please login again",
      });
    } else if (chat) {
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
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const getChatList = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const token: any = req.headers["authorization"];
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    const payload = decoded as JwtPayload;
    var accountId = payload.id;

    const account = await AccountModel.findOne({ _id: accountId });
    if (!account) {
      res.status(500).send({
        success: false,
        message: "Invalid access permission. Please login again",
      });
    } else if (account) {
      const chat_list = await ChatModel.find({ "users.phone": account.phone });
      if (!chat_list) {
        res.status(500).send({
          success: false,
          message: "Invalid access permission. Please login again",
        });
      } else if (chat_list) {
        res.status(200).send({
          success: true,
          chat_list,
        });
      }
    }
  } catch (error) {}
};

export const getChat = async (req: express.Request, res: express.Response) => {
  try {
    var chat_id = req.params.chat_id;

    const chat = await ChatModel.findOne({ _id: chat_id });
    if (!chat) {
      res.status(500).send({
        success: false,
        message: "Invalid access permission. Please login again",
      });
    } else if (chat) {
      res.status(200).send({
        success: true,
        chat,
      });
    }
  } catch (error) {}
};