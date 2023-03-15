import { Schema, model } from 'mongoose';

export const Profile = new Schema({
    phone: { type: String },
    name: { type: String },
    birthday: { type: String },
})

export const ProfileModel = model("profile", Profile);