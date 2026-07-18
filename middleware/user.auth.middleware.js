const { userModel } = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../errors/AppError");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const protectUser = catchAsync(async (req, res, next) => {
    const token = 
    req.cookies?.userToken || 
    (req.headers.authorization && req.headers.authorization?.split(" ")[1]);

    if (!token) {
      return next(new AppError("User authentication required", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return next(new AppError("Invalid or expired authentication session", 401));
    }

    req.user = user;

    next();
});

module.exports = protectUser;