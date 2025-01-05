import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../utils/nodemailer.js";

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

    const hashedPassword = await bcrypt.hash(password, 10);

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

    //to send welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to my website",
      text: `Hi ${name}, we're thrilled to have you here! Get ready to explore amazing features and make the most of your journey with us. Your email id is ${email} 🚀`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "New user created" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "All fields required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, //cookie cannot be accessed by client side js
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //it prevents csrf attack
      maxAge: 7 * 24 * 60 * 60 * 1000, // valid for 7 days
    });

    return res.json({ success: true, message: "user logged in" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true, //cookie cannot be accessed by client side js
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //it prevents csrf attack
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Logged OUT" });
  } catch (error) {
    return res.json({ success: false, messgae: error.message });
  }
};

//send verfication otp to the user's email
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Account is already verified",
      });
    }
    //creating a 6 six digit otp for verfication
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    //otp expires in one day
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();
    //send otp to user's email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Verification OTP sent on Email" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
//email verfication checker
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const user = await userModel.findById(userId);
    if (!userId) {
      return res.json({ success: false, message: "user not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    //checks whether the otp expires
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" });
    }

    //after the account verification
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Email verified Successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

//contoller to check user authentication
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

//send password reset otp
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: error.message });
    }

    //creating a 6 six digit otp for verfication
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    //otp expires in 15 minutes
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();
    //send otp to user's email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for reset password is ${otp}. Use this OTP to proceed with resetting your password.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

//Reset user Password

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();
    return res.json({
      success: true,
      message: "password has been reset successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

