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
exports.getContact = exports.deleteContactItem = exports.addContactItem = exports.createContact = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const account_1 = require("../models/account");
const contact_1 = require("../models/contact");
const profile_1 = require("../models/profile");
const chat_1 = require("../models/chat");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_token_secret";
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const new_contact = new contact_1.ContactModel({
                phone: account.phone,
                contactList: [],
            });
            yield new_contact.save();
            res.status(200).send({
                success: true,
                message: "Contact created successfully",
                new_contact,
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
exports.createContact = createContact;
const addContactItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers["authorization"];
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        const payload = decoded;
        var accountId = payload.id;
        const new_contact_phone = req.params.contact_phone;
        const account = yield account_1.AccountModel.findOne({ _id: accountId });
        if (!account) {
            res.status(500).send({
                success: false,
                message: "Invalid access permission. Please login again",
            });
        }
        else if (account) {
            if (account.phone === new_contact_phone) {
                res.status(500).send({
                    success: false,
                    message: "Can't not connect to yourself. Please try again",
                });
            }
            else {
                const contact = yield contact_1.ContactModel.findOne({ phone: account.phone });
                if (!contact) {
                    res.status(500).send({
                        success: false,
                        message: "Invalid access permission. Please login again",
                    });
                }
                else if (contact) {
                    const contact_profile = yield profile_1.ProfileModel.findOne({
                        phone: new_contact_phone,
                    });
                    if (!contact_profile) {
                        res.status(500).send({
                            success: false,
                            message: "This phone number not found",
                        });
                    }
                    else if (contact_profile) {
                        var new_contact_item = {
                            phone: contact_profile.phone,
                            name: contact_profile.name,
                        };
                        var contactList = contact.contactList;
                        const checkContactList = () => {
                            for (var i = 0; i < contactList.length; i++) {
                                if (contactList[i].phone === contact_profile.phone) {
                                    return false;
                                }
                            }
                            return true;
                        };
                        if (!checkContactList()) {
                            res.status(500).send({
                                success: false,
                                message: "You've added this phone to your contact list",
                            });
                        }
                        else if (checkContactList()) {
                            contactList.push(new_contact_item);
                            contact.updateOne({ contactList: contactList });
                            contact.save();
                            const otherContact = yield contact_1.ContactModel.findOne({
                                phone: new_contact_phone,
                            });
                            if (otherContact) {
                                const my_profile = yield profile_1.ProfileModel.findOne({
                                    phone: account.phone,
                                });
                                if (my_profile) {
                                    var new_contact_item_2 = {
                                        phone: my_profile.phone,
                                        name: my_profile.name,
                                    };
                                    var otherContactList = otherContact.contactList;
                                    otherContactList.push(new_contact_item_2);
                                    otherContact.updateOne({ contactList: otherContactList });
                                    otherContact.save();
                                }
                            }
                            res.status(200).send({
                                success: true,
                                contact: contact,
                            });
                        }
                    }
                }
            }
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error,
        });
    }
});
exports.addContactItem = addContactItem;
const deleteContactItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers["authorization"];
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        const payload = decoded;
        var accountId = payload.id;
        const deleted_contact_phone = req.params.deleted_contact_phone;
        const account = yield account_1.AccountModel.findOne({ _id: accountId });
        if (!account) {
            res.status(500).send({
                success: false,
                message: "Invalid access permission. Please login again",
            });
        }
        else if (account) {
            const contact = yield contact_1.ContactModel.findOne({ phone: account.phone });
            if (!contact) {
                res.status(500).send({
                    success: false,
                    message: "Invalid access permission. Please login again",
                });
            }
            else if (contact) {
                var contactList = contact.contactList;
                for (var i = 0; i < contactList.length; i++) {
                    if (contactList[i].phone === deleted_contact_phone) {
                        contactList.splice(contactList.indexOf(contactList[i]), 1);
                        contact.updateOne({ contactList: contactList });
                        contact.save();
                        const otherContact = yield contact_1.ContactModel.findOne({
                            phone: deleted_contact_phone,
                        });
                        if (otherContact) {
                            var otherContactList = otherContact.contactList;
                            for (var i = 0; i < otherContactList.length; i++) {
                                if (otherContactList[i].phone === account.phone) {
                                    otherContactList.splice(otherContactList.indexOf(otherContactList[i]), 1);
                                    otherContact.updateOne({ contactList: otherContactList });
                                    otherContact.save();
                                }
                            }
                        }
                        res.status(200).send({
                            success: true,
                            contact: contact,
                        });
                        break;
                    }
                }
            }
        }
        var chat = yield chat_1.ChatModel.findOne({
            "users.phone": { $all: [account === null || account === void 0 ? void 0 : account.phone, deleted_contact_phone] },
        });
        console.log(chat);
        if (chat) {
            yield chat_1.ChatModel.findOneAndDelete({
                "users.phone": { $all: [account === null || account === void 0 ? void 0 : account.phone, deleted_contact_phone] },
            });
            console.log("Chat item deleted successfully.");
        }
        else {
            console.log("Chat item not found.");
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error,
        });
    }
});
exports.deleteContactItem = deleteContactItem;
const getContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const contact = yield contact_1.ContactModel.findOne({ phone: account.phone });
            res.status(200).send({
                success: true,
                contact: contact,
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
exports.getContact = getContact;
