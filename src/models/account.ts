import { Schema, model } from "mongoose";

const Account = new Schema({
  phone: { type: String },
  password: { type: String },
});

export const AccountModel = model("account", Account);