import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    // 1️⃣ Token get from cookie or authorization header
    let token = req.cookies?.token;
    // console.log("token is---> ",token);
    
    

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
    }

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
        success: false
      });
    }

    // 2️⃣ Token verify
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 3️⃣ User find
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    // 4️⃣ Attach user details to req
    req.id = user._id;
    req.userRole = user.role;

    next();

  } catch (error) {
    console.log("Auth error:", error);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

export default isAuthenticated;
