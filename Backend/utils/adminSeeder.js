import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

const toPhoneNumber = (rawValue) => {
  const digits = (rawValue || "").toString().replace(/\D/g, "");
  if (digits.length !== 10) return null;
  return Number(digits);
};

export const seedAdminUser = async () => {
  const isSeederEnabled = process.env.ADMIN_SEEDER_ENABLED !== "false";
  if (!isSeederEnabled) {
    return;
  }

  const adminFullname = process.env.ADMIN_FULLNAME;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminPhoneNumber = toPhoneNumber(process.env.ADMIN_PHONE);

  if (!adminPhoneNumber) {
    console.log(
      "[Seeder] Admin seeding skipped: ADMIN_PHONE must contain exactly 10 digits.",
    );
    return;
  }

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("[Seeder] Admin already exists. Skipping admin seeding.");
    return;
  }

  const conflictingUser = await User.findOne({
    $or: [{ email: adminEmail }, { phoneNumber: adminPhoneNumber }],
  });

  if (conflictingUser) {
    console.log(
      "[Seeder] Admin seeding skipped: email or phone already belongs to another user.",
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.create({
    fullname: adminFullname,
    email: adminEmail,
    phoneNumber: adminPhoneNumber,
    password: hashedPassword,
    role: "admin",
    isVerified: true,
    profile: {
      profilePhoto: "",
    },
  });

  console.log("[Seeder] Admin user seeded successfully.");
};
