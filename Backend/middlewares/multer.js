import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Cloudinary Storage Config (Dynamic Folder)
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // 🔹 If route contains "/company", store in company folder
    const isCompanyRoute = req.originalUrl.includes("company");

    return {
      folder: isCompanyRoute
        ? "jobportal_uploads/company_logos"
        : "jobportal_uploads/profile_photos",

      allowed_formats: ["jpg", "jpeg", "png"],
      resource_type: "auto",
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`
    };
  }
});

// Ek hi upload middleware for all
export const singleUpload = multer({ storage }).single("file");
