const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = (req, res, next)=> {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).json({message: "Not authenticated"})
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=> {
    if (err) {
      return res.status(401).json({message: "Session expired"});
    }

    req.user = decoded;
    next();
  })
    };

module.exports = protect;