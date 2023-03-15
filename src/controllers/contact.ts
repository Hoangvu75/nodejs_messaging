import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AccountModel } from "../models/account";
import { ContactModel } from "../models/contact";
import { ProfileModel } from "../models/profile";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "access_token_secret";

export const createContact = async (
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
      const new_contact = new ContactModel({
        phone: account.phone,
        contactList: [],
      });
      await new_contact.save();
      res.status(200).send({
        success: true,
        message: "Contact created successfully",
        new_contact,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const addContactItem = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const token: any = req.headers["authorization"];
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    const payload = decoded as JwtPayload;
    var accountId = payload.id;
    const new_contact_phone = req.params.contact_phone;

    const account = await AccountModel.findOne({ _id: accountId });
    if (!account) {
      res.status(500).send({
        success: false,
        message: "Invalid access permission. Please login again",
      });
    } else if (account) {
      if (account.phone === new_contact_phone) {
        res.status(500).send({
          success: false,
          message: "Can't not connect to yourself. Please try again",
        });
      } else {
        const contact = await ContactModel.findOne({ phone: account.phone });
        if (!contact) {
          res.status(500).send({
            success: false,
            message: "Invalid access permission. Please login again",
          });
        } else if (contact) {
          const contact_profile = await ProfileModel.findOne({
            phone: new_contact_phone,
          });
          if (!contact_profile) {
            res.status(500).send({
              success: false,
              message: "This phone number not found",
            });
          } else if (contact_profile) {
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
            } else if (checkContactList()) {
              contactList.push(new_contact_item);
              contact.updateOne({ contactList: contactList });
              contact.save();
              res.status(200).send({
                success: true,
                contact: contact,
              });
            }
          }
        }
      }
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const deleteContactItem = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const token: any = req.headers["authorization"];
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    const payload = decoded as JwtPayload;
    var accountId = payload.id;
    const deleted_contact_phone = req.params.deleted_contact_phone;

    const account = await AccountModel.findOne({ _id: accountId });
    if (!account) {
      res.status(500).send({
        success: false,
        message: "Invalid access permission. Please login again",
      });
    } else if (account) {
      const contact = await ContactModel.findOne({ phone: account.phone });
      if (!contact) {
        res.status(500).send({
          success: false,
          message: "Invalid access permission. Please login again",
        });
      } else if (contact) {
        var contactList = contact.contactList;
        for (var i = 0; i < contactList.length; i++) {
          if (contactList[i].phone === deleted_contact_phone) {
            contactList.splice(contactList.indexOf(contactList[i]), 1);
            contact.updateOne({ contactList: contactList });
            contact.save();
            res.status(200).send({
              success: true,
              contact: contact,
            });
            break;
          }
        }
      }
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const getContact = async (
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
      const contact = await ContactModel.findOne({ phone: account.phone });
      if (!contact) {
        res.status(500).send({
          success: false,
          message: "Invalid access permission. Please login again",
        });
      } else if (contact) {
        res.status(200).send({
          success: true,
          contact: contact,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};
