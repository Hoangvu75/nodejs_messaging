"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactModel = void 0;
const mongoose_1 = require("mongoose");
const Contact = new mongoose_1.Schema({
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
exports.ContactModel = (0, mongoose_1.model)("contact", Contact);
