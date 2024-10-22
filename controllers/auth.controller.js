import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
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
        .json({ success: false, message: "User already exists" });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashPassword,
      });
      await newUser.save();
      const token = await generateTokenAndSetCookie(res, newUser._id);
      res.status(201).json({
        success: true,
        message: "User created successfully",
        token: token,
        user: {
          ...newUser._doc,
          password: undefined,
        },
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
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
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid password" });
      } else {
        const token = await generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();
        res.status(200).json({
          success: true,
          message: "Logged in successfully",
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
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, user: { ...user._doc } });
};
