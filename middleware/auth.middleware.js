const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = (req, res, next)=> {
  console.log("Authorization Header:", req.headers.authorization);
  console.log("Cookies:", req.cookies);
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).json({message: "Not authenticated"})
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=> {
    if (err) {
      return res.status(401).json({message: "Session expired"});
    }

    req.user = decoded;
    // console.log(req.user)
    next();
  })
    };

module.exports = protect;