import { Schema, model } from "mongoose";

const Contact = new Schema({
  phone: { type: String },
  contactList: {
    type: [
      {
        phone: { type: String },
        name: { type: String },
      },
    ],
  },
});

export const ContactModel = model("contact", Contact);
