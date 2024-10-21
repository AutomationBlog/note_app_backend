import express from "express";
import { login, signup, getUser } from "../controllers/auth.controller.js";
import { authenticateToken } from "../utils/verifyAuthenticateToken.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/getuser", authenticateToken, getUser);

export default authRouter;
