import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Cloudinary Storage Config (Dynamic Folder)
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {

    const isCompanyRoute = req.originalUrl.includes("company");
    const isProfileUpdate = req.originalUrl.includes("profile/update");

    return {
      folder: isCompanyRoute
        ? "jobportal_uploads/company_logos"
        : "jobportal_uploads/profile_photos",

      // 🔥 FIX: Allow PDF ONLY during profile/update request
      allowed_formats: isProfileUpdate
        ? ["jpg", "jpeg", "png", "pdf"]   // resume support added
        : ["jpg", "jpeg", "png"],        // rest same as before

      // 🔥 PDFs require this:
      resource_type: isProfileUpdate ? "raw" : "auto",

      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`
    };
  }
});

// Ek hi upload middleware
export const singleUpload = multer({ storage }).single("file");
