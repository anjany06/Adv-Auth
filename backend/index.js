import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());//allows us to parse incoming requests: req.body


app.get("/",(req, res)=>{
  res.send("Hello World!")
});

app.use("/api/auth", authRoutes);

app.listen(PORT, ()=>{
  connectDB();
  console.log("Server is running on port 3000");
})
