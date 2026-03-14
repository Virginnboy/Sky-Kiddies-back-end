const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// /new storage for order receipts
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "orders",
  allowed_formats: ["jpg", "png", "webp"]
});

const orderUpload = multer({ storage });

module.exports = orderUpload;