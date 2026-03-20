const { adminModel } = require("../models/admin.model");
const jwt = require("jsonwebtoken")
require("dotenv").config();

const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;

    if (!token) {
      return res.status(401).json({message: "Admin not authenticated"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await adminModel.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({message: "Admin not found" });
    }

    req.user = admin;
    next();

  }catch (err) {
    console.log(err);
    return res.status(500).json({message: "Server error"});
  }
};

module.exports = protectAdmin