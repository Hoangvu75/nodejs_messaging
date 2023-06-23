"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModel = exports.Profile = void 0;
const mongoose_1 = require("mongoose");
exports.Profile = new mongoose_1.Schema({
    phone: { type: String },
    name: { type: String },
    birthday: { type: String },
});
exports.ProfileModel = (0, mongoose_1.model)("profile", exports.Profile);
