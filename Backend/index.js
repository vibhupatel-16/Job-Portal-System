import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io"; // ✅ ADD
import http from "http"; // ✅ ADD

import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import adminRoute from "./routes/admin.route.js";

import interviewRoute from "./routes/interview.route.js";
import savedJobRoute from "./routes/savedJob.route.js";
import "./utils/cronJobs.js";
import testimonialRoute from "./routes/testimonial.route.js";

dotenv.config({});
const app = express();

// ✅ REQUIRED FOR SOCKET
const server = http.createServer(app); // ✅ ADD
const io = new Server(server, {
  // ✅ ADD
  cors: {
    origin: ["http://localhost:5173", "http://192.168.1.21:5173"],
    credentials: true,
  },
});

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
  origin: ["http://localhost:5173", "http://192.168.1.21:5173"],
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ SOCKET ACCESS FOR CONTROLLERS
app.use((req, res, next) => {
  req.io = io; // ✅ ADD
  next();
});

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/admin", adminRoute);

app.use("/api/v1/interview", interviewRoute);
app.use("/api/v1/user", savedJobRoute);

app.use("/api/v1/testimonials", testimonialRoute);

app.use("/uploads", express.static("uploads"));

// ✅ SOCKET CONNECTION LOGIC
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("👤 User joined room:", userId);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8000;

// ❌ app.listen → ❌ REMOVED
// ✅ server.listen → ✅ REQUIRED
server.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server running at port ${PORT}`);
});
