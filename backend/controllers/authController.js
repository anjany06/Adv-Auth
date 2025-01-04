import userModel from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const userAlreadyExists = await userModel.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User Already exits" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new userModel({
      email,
      password: hashedPassword,
      name,
    });

    await user.save();

    // jwt
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, //cookie cannot be accessed by client side js
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //it prevents csrf attack
      maxAge: 7 * 24 * 60 * 60 * 1000, // valid for 7 days
    });

    res.json({ success: true, message: "New user created" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  res.send("login Route");
};

export const logout = async (req, res) => {
  res.send("logout Route");
};
