import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    reuired: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  verifyOtp: {
    type: String,
    default: "",
  },
  verificationOtpExpiresAt: {
    type: Number,
    default: 0,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  resetOtp: {
    type: String,
    default: "",
  },
  resetOtpExpiresAt: {
    type: Number,
    default: 0,
  },
});

const UserModel = mongoose.models.user || mongoose.model("User", userSchema);

export default UserModel;
