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

    // Resume validation
    if (file.fieldname === "file") {
      if (file.mimetype !== "application/pdf") {
        return cb(new Error("Only PDF resume allowed"), false);
      }
    }

    // Profile photo validation
    if (file.fieldname === "profilePhoto") {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image allowed for profile photo"), false);
      }
    }

    cb(null, true);
  }
}).fields([
  { name: "file", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 }
]);
