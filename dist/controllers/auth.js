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
exports.getProfile = exports.addProfile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const account_1 = require("../models/account");
const profile_1 = require("../models/profile");
const login_validator_1 = require("../validator/login_validator");
const register_validator_1 = require("../validator/register_validator");
const add_profile_validator_1 = require("../validator/add_profile_validator");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_token_secret";
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registerValidator = new register_validator_1.RegisterValidator(req.body.phone, req.body.password);
        if (!registerValidator.isValidPhone()) {
            res.status(500).send({
                success: false,
                message: "Please enter a valid phone number",
            });
        }
        else if (!registerValidator.isValidPassword()) {
            res.status(500).send({
                success: false,
                message: "Password must be at least 8 characters",
            });
        }
        else if ((yield registerValidator.isValidRegisteredAccount()) === false) {
            res.status(500).send({
                success: false,
                message: "This phone number is already registered",
            });
        }
        else {
            const registeredAccount = new account_1.AccountModel(req.body);
            yield registeredAccount.save();
            res.status(200).send({
                success: true,
                message: "Register successfully",
                registeredAccount,
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
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginValidator = new login_validator_1.LoginValidator(req.body.phone, req.body.password);
        if (!loginValidator.isValidPhone()) {
            res.status(500).send({
                success: false,
                message: "Please enter a valid phone number",
            });
        }
        else if (!loginValidator.isValidPassword()) {
            res.status(500).send({
                success: false,
                message: "Password must be at least 8 characters",
            });
        }
        else if (!loginValidator.isValidLoginAccount()) {
            res.status(500).send({
                success: false,
                message: "Your phone number is not registered",
            });
        }
        else {
            const loginAccount = yield account_1.AccountModel.findOne({
                phone: req.body.phone,
                password: req.body.password,
            });
            if (!loginAccount) {
                res.status(500).send({
                    success: false,
                    message: "Wrong username or password. Please try again",
                });
            }
            else if (loginAccount) {
                const token = jsonwebtoken_1.default.sign({ id: loginAccount._id }, ACCESS_TOKEN_SECRET, {
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
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error,
        });
    }
});
exports.login = login;
const addProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addProfileValidator = new add_profile_validator_1.AddProfileValidator(req.body.name, req.body.birthday);
        if (!addProfileValidator.isValidName()) {
            res.status(500).send({
                success: false,
                message: "Name cannot be empty",
            });
        }
        else if (!addProfileValidator.isValidBirthday()) {
            res.status(500).send({
                success: false,
                message: "Birthday cannot be empty",
            });
        }
        else {
            const addedProfile = new profile_1.ProfileModel(req.body);
            yield addedProfile.save();
            res.status(200).send({
                success: true,
                message: "Add profile successfully",
                addedProfile,
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
exports.addProfile = addProfile;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers["authorization"];
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        const payload = decoded;
        var accountId = payload.id;
        yield account_1.AccountModel.findOne({ _id: accountId }).then((account) => {
            if (!account) {
                res.status(500).send({
                    success: false,
                    message: "Invalid access permission. Please login again",
                });
            }
            else if (account) {
                profile_1.ProfileModel.findOne({ phone: account.phone }).then((profile) => {
                    if (!profile) {
                        res.status(500).send({
                            success: false,
                            message: "Profile not found",
                        });
                    }
                    else if (profile) {
                        res.status(200).send({
                            success: true,
                            message: "Get profile information successfully",
                            profile,
                        });
                    }
                });
            }
        });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error,
        });
    }
});
exports.getProfile = getProfile;
