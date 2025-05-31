// src/routes/avatarUploadRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tenantId = req.params.tenantId;
    if (!tenantId) {
      return cb(new Error("Tenant ID is missing in URL"));
    }
    // Save files into uploads/{tenantId}/profile
    const uploadPath = path.join(__dirname, "..", "uploads", tenantId, "profile");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `avatar_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Note: The route is defined relative to the mount point.
router.post("/:tenantId/avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const tenantId = req.params.tenantId;
  const newFileName = req.file.filename;
  // Construct a URL that points to the uploaded file.
  const avatarUrl = `/uploads/${tenantId}/profile/${newFileName}`;
  console.log("[DEBUG] Avatar file saved at:", req.file.path);
  console.log("[DEBUG] Avatar URL:", avatarUrl);
  return res.status(200).json({ avatarUrl });
});

module.exports = router;
