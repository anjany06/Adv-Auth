import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs"

export const signup = async(req, res) =>{
  const {email, password, name} = req.body;
  try {
    if(!email || !password || !name){
      throw new Error = ("All fields are required");
    }

    const userAlreadyExists = await User.find({email});
    if(userAlreadyExists){
      return res.status(400).json({success:false, message: "User Already exits"});
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const verificationCode = generateVerificationCode();
    const user = new User({email, password: hashedPassword, name});

  } catch (error) {
    res.status(400).json({success:false, message: error.message});
  }
}

export const login = async (req,res)=>{
  res.send("login Route");
}

export const logout = async(req,res)=>{
  res.send("logout Route");
}