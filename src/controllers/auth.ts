import jwt, { JwtPayload } from "jsonwebtoken";
import express from "express";

import { AccountModel } from "../models/account";
import { ProfileModel } from "../models/profile";
import { LoginValidator } from "../validator/login_validator";
import { RegisterValidator } from "../validator/register_validator";
import { AddProfileValidator } from "../validator/add_profile_validator";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_token_secret";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const registerValidator = new RegisterValidator(
      req.body.phone,
      req.body.password,
    );

    if (!registerValidator.isValidPhone()) {
      res.status(500).send({
        success: false,
        message: "Please enter a valid phone number",
      });
    } else if (!registerValidator.isValidPassword()) {
      res.status(500).send({
        success: false,
        message: "Password must be at least 8 characters",
      });
    } else if ((await registerValidator.isValidRegisteredAccount()) === false) {
      res.status(500).send({
        success: false,
        message: "This phone number is already registered",
      });
    } else {
      const registeredAccount = new AccountModel(req.body);
      await registeredAccount.save();
      res.status(200).send({
        success: true,
        message: "Register successfully",
        registeredAccount,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const loginValidator = new LoginValidator(
      req.body.phone,
      req.body.password,
    );

    if (!loginValidator.isValidPhone()) {
      res.status(500).send({
        success: false,
        message: "Please enter a valid phone number",
      });
    } else if (!loginValidator.isValidPassword()) {
      res.status(500).send({
        success: false,
        message: "Password must be at least 8 characters",
      });
    } else if (!loginValidator.isValidLoginAccount()) {
      res.status(500).send({
        success: false,
        message: "Your phone number is not registered",
      });
    } else {
      const loginAccount = await AccountModel.findOne({
        phone: req.body.phone,
        password: req.body.password,
      });

      if (!loginAccount) {
        res.status(500).send({
          success: false,
          message: "Wrong username or password. Please try again",
        });
      } else if (loginAccount) {
        const token = jwt.sign({ id: loginAccount!._id }, ACCESS_TOKEN_SECRET, {
          expiresIn: 86400,
        });

        res.status(200).send({
          success: true,
          message: "Login successfully",
          token,
          loginAccount,
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

export const addProfile = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const addProfileValidator = new AddProfileValidator(
      req.body.name,
      req.body.birthday
    );

    if (!addProfileValidator.isValidName()) {
      res.status(500).send({
        success: false,
        message: "Name cannot be empty",
      });
    } else if (!addProfileValidator.isValidBirthday()) {
      res.status(500).send({
        success: false,
        message: "Birthday cannot be empty",
      });
    } else {
      const addedProfile = new ProfileModel(req.body);
      await addedProfile.save();
  
      res.status(200).send({
        success: true,
        message: "Add profile successfully",
        addedProfile,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};

export const getProfile = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const token: any = req.headers["authorization"];
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    const payload = decoded as JwtPayload;
    var accountId = payload.id;

    await AccountModel.findOne({ _id: accountId }).then((account) => {
      if (!account) {
        res.status(500).send({
          success: false,
          message: "Invalid access permission. Please login again",
        });
      } else if (account) {
        ProfileModel.findOne({ phone: account.phone }).then((profile) => {
          if (!profile) {
            res.status(500).send({
              success: false,
              message: "Profile not found",
            });
          } else if (profile) {
            res.status(200).send({
              success: true,
              message: "Get profile information successfully",
              profile,
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
  }
};
