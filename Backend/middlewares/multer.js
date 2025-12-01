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

// Allow both resume & profilePhoto
export const upload = multer({ storage }).fields([
  { name: "file", maxCount: 1 },               // resume
  { name: "profilePhoto", maxCount: 1 }        // profile photo
]);
