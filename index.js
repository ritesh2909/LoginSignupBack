import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());


mongoose.connect(process.env.MONGO_URL)
    .then(console.log("DB Connected"))

app.use('/api/auth', authRoute);

app.listen(process.env.PORT, () => {
    console.log("Server running on 5000");
})


