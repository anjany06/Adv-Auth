import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({ origin: "https://adv-auth-iota.vercel.app", credentials: true })
);
app.use(cookieParser());
app.use(express.json()); //allows us to parse incoming requests: req.body

app.get("/", (req, res) => {
  res.send("API Working!");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port: ${PORT}`);
});
