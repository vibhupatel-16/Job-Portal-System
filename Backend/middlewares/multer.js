import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Cloudinary Storage Config
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isCompanyRoute = req.originalUrl.includes("company");
    const isProfileUpdate = req.originalUrl.includes("profile/update");

    return {
      folder: isCompanyRoute
        ? "jobportal_uploads/company_logos"
        : "jobportal_uploads/profile_photos",

      allowed_formats: isProfileUpdate
        ? ["jpg", "jpeg", "png", "pdf"]
        : ["jpg", "jpeg", "png"],

      resource_type: isProfileUpdate ? "raw" : "auto",

      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`
    };
  }
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // 1. Identify which route is being accessed
    const isCompanyRoute = req.originalUrl.includes("company");

    // 2. Logic for the "file" field
    if (file.fieldname === "file") {
      // If it's a company logo, allow images
      if (isCompanyRoute) {
        if (!file.mimetype.startsWith("image/")) {
          return cb(new Error("Only images (jpg, png) allowed for company logo"), false);
        }
      } 
      // If it's NOT a company route (e.g., student resume), keep it PDF only
      else {
        if (file.mimetype !== "application/pdf") {
          return cb(new Error("Only PDF resume allowed"), false);
        }
      }
    }

    // 3. Profile photo validation (remains the same)
    if (file.fieldname === "profilePhoto") {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image allowed for profile photo"), false);
      }
    }

    cb(null, true);
  }
}).fields([
  { name: "file", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
  { name: "logo", maxCount: 1 }
]);