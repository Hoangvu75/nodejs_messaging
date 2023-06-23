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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginValidator = void 0;
const account_1 = require("../models/account");
class LoginValidator {
    constructor(phone, password) {
        this.isValidPhone = () => {
            const phoneValidator = /^(\()?\d{3}(\))?(|\s)?\d{3}(|\s)\d{4}$/;
            if (!this.phone.match(phoneValidator)) {
                return false;
            }
            else {
                return true;
            }
        };
        this.isValidPassword = () => {
            if (this.password.length < 8) {
                return false;
            }
            else {
                return true;
            }
        };
        this.isValidLoginAccount = () => __awaiter(this, void 0, void 0, function* () {
            const isAccountExist = yield account_1.AccountModel.findOne({
                phone: this.phone,
            });
            if (isAccountExist) {
                return false;
            }
            else {
                return true;
            }
        });
        this.phone = phone;
        this.password = password;
    }
}
exports.LoginValidator = LoginValidator;
