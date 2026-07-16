const multer = require("multer");
const cloudinary = require("../config/cloudinary.config")
const { CloudinaryStorage } = require("multer-storage-cloudinary");


const uploadFile = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    folder,
    allowed_formats: [ "jpg", "png", "webp"]
  });

  return multer({ storage });
};

module.exports = uploadFile;