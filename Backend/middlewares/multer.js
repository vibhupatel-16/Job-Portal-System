import multer from "multer";
import path from "path";

// 🔹 Step 1: Storage define karo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // "uploads" folder me file save hogi
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Unique filename banayenge — jaise: 1698778451256.png
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// 🔹 Step 2: Export the upload middleware
export const singleUpload = multer({ storage }).single("file");
