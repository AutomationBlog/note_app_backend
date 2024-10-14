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

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid or expired verification token" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendVerificationSuccessfulEmail(user.email);
    res.status(200).json({
      success: true,
      msg: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    } else if (!user.isVerified) {
      return res
        .status(400)
        .json({ success: false, msg: "Please verify your email" });
    } else {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
      await user.save();
      await sendPasswordResetEmail(user.email, resetToken);
      res.status(200).json({
        success: true,
        msg: "Password reset link sent to your email",
      });
    }
  } catch (error) {
    console.log("Error while sending password reset link", error);
    res.status(400).json({ success: false, msg: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid or expired reset token" });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      user.password = hashPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresAt = undefined;
      await user.save();
      await sendPasswordResetSuccessfulEmail(user.email);
      res.status(200).json({
        success: true,
        msg: "Password reset successfully",
      });
    }
  } catch (error) {
    console.log("Error while resetting password", error);
    res.status(400).json({ success: false, msg: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    } else {
      res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    console.log("Error while checking authentication", error);
    res.status(400).json({ success: false, msg: error.message });
  }
};
