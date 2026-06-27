const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ── Configure Cloudinary ──────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let upload;

if (process.env.NODE_ENV === "production") {
  // ── Production: stream directly to Cloudinary ─────────
  const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "job-portal-resumes",
      resource_type: "raw",          // allow PDF uploads
      allowed_formats: ["pdf"],
      public_id: (_req, file) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        return `resume-${uniqueSuffix}`;
      },
    },
  });

  upload = multer({
    storage: cloudinaryStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });
} else {
  // ── Development: save locally ──────────────────────────
  const uploadDir = path.join(__dirname, "../uploads/resumes");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname.replace(/ /g, "_"));
    },
  });

  upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
  });
}

module.exports = { upload, cloudinary };
