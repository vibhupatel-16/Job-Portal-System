import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Cloudinary Storage Config
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "jobportal_uploads/profile_photos", // subfolder
      allowed_formats: ["jpg", "jpeg", "png"],
      resource_type: "auto", // allow images
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}` // unique file name
    };
  }
});

// Multer middleware for single file
export const singleUpload = multer({ storage }).single("file");
