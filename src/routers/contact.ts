import express from "express";
import { addContactItem, createContact, deleteContactItem, getContact } from "../controllers/contact";

const contactRouter = express.Router();

contactRouter.post("/create-contact", createContact);
contactRouter.post("/add-contact-item/:contact_phone", addContactItem);
contactRouter.get("/get-contact", getContact);
contactRouter.post("/delete-contact-item/:deleted_contact_phone", deleteContactItem);

export default contactRouter;