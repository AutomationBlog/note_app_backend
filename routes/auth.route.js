import express from "express";
import { login, signup, getUser } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/getuser", getUser);

export default authRouter;
