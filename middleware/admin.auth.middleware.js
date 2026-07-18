const { adminModel } = require("../models/admin.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../errors/AppError");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const protectAdmin = catchAsync(async (req, res, next) => {
    const token = req.cookies?.adminToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new AppError("Admin authentication required", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await adminModel.findById(decoded.id);

    if (!admin) {
      return next(new AppError("Invalid or expired authentication session", 401));
    }

    req.user = admin;
    next();
});

module.exports = protectAdmin;