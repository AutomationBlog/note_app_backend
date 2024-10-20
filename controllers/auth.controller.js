import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendVerificationSuccessfulEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessfulEmail,
} from "../nodemailer/emails.js";
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const verificationToken = generateVerificationToken();
      const newUser = new User({
        name,
        email,
        password: hashPassword,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });
      await newUser.save();
      const token = await generateTokenAndSetCookie(res, newUser._id);
      await sendVerificationEmail(newUser.email, verificationToken);
      res.status(201).json({
        success: true,
        msg: "User created successfully",
        token: token,
        user: {
          ...newUser._doc,
          password: undefined,
        },
      });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    } else if (!user.isVerified) {
      return res
        .status(400)
        .json({ success: false, msg: "Please verify your email" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, msg: "Invalid password" });
      } else {
        const token = await generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();
        res.status(200).json({
          success: true,
          msg: "Logged in successfully",
          token: token,
          user: {
            ...user._doc,
            password: undefined,
          },
        });
      }
    }
  } catch (error) {
    console.log("Error while logging in", error);
    res.status(400).json({ success: false, msg: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, msg: "Logged out successfully" });
};
