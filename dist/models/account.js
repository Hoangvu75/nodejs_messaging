"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModel = void 0;
const mongoose_1 = require("mongoose");
const Account = new mongoose_1.Schema({
    phone: { type: String },
    password: { type: String },
});
exports.AccountModel = (0, mongoose_1.model)("account", Account);
