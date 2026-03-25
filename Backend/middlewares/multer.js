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
  const isCompanyRoute = req.originalUrl.includes("company");
  const isRegisterRoute = req.originalUrl.includes("register"); // Signup check

  if (file.fieldname === "file") {
    // 1. Agar Company Logo ya Signup Profile Photo hai -> Image allow karo
    if (isCompanyRoute || isRegisterRoute) {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only images (jpg, png) allowed"), false);
      }
    } 
    // 2. Sirf tab PDF maango jab ye register ya company route NA HO (e.g., Application submit)
    else {
      if (file.mimetype !== "application/pdf") {
        return cb(new Error("Only PDF resume allowed"), false);
      }
    }
  }
  
  // Baki validation (profilePhoto field ke liye)
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