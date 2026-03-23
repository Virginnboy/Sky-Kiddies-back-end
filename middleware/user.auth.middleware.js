const { userModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const protectUser = async (req, res, next) => {
  try {
    const token = 
    req.cookies?.userToken || 
    (req.headers.authorization && req.headers.authorization?.split(" ")[1]);

    if (!token) {
      return res.status(401).json({message: "User not authenticated"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json("User not found");
    }

    req.user = user;

    next()
  }catch (err) {
    console.log(err) 
    return res.status(500).json({message: "Server error"});
  }
}

module.exports = protectUser