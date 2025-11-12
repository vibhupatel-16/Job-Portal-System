import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; 
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config({});
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/home", (req, res) => {
  return res.status(200).json({
    message: "I am coming from the backend",
    success: true,
  });
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

//  API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

app.use('/uploads', express.static('uploads'));



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server running at port ${PORT}`);
});
