"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_1 = require("../controllers/contact");
const contactRouter = express_1.default.Router();
contactRouter.post("/create-contact", contact_1.createContact);
contactRouter.post("/add-contact-item/:contact_phone", contact_1.addContactItem);
contactRouter.get("/get-contact", contact_1.getContact);
contactRouter.post("/delete-contact-item/:deleted_contact_phone", contact_1.deleteContactItem);
exports.default = contactRouter;
