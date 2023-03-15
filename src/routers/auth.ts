import express from "express";
import { addProfile, getProfile, login, register } from "../controllers/auth";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/add-profile", addProfile);
authRouter.get("/get-profile", getProfile);

export default authRouter;