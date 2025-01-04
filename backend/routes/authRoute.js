import express from "express";
const router = express.Router();
import { register, login, logout } from "../controllers/authController.js";

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
