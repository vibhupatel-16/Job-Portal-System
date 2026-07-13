import mongoose from "mongoose";
import { seedAdminUser } from "./adminSeeder.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mondodb connected successfully");
    await seedAdminUser();
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
