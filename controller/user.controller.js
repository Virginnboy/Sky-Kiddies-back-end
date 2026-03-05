const { userModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config();

const signup = async (req, res) => {
  const {email, password, firstName} = req.body
  console.log(req.body)
  try {
  const user = await userModel.findOne({email});

  if (user) {
    return res.status(409).json({message: "User with this email already exist"});
  }

  const newUser = new userModel({email, password, firstName})

  await newUser.save();

  res.status(201).json({message: "Signup successful"})
  
  }catch (err) {
    console.log(err)
    return res.status(500).json({message: "Server error"})
  }
}

const login = async (req, res) => {
  const { email, password } = req.body 
  try {
    const user = await userModel.findOne({email});
    if (!user) {
      return res.status(401).json({message: "User not found"})
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({message: "Invalid Password"})
    }

    const token = jwt.sign({
      id: user._id,
      email: user.email,
      firstName: user.firstName
    },
    process.env.JWT_SECRET,
    {expiresIn: "1d" }
  );

    res.cookie("token", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({message: "Logged in successfully", user, token})

  } catch (err) {
    console.log(err)
    return res.status(500).json({message: "Server Error"});
  }
} 

const getUser = async (req, res) => {
  const userId = req.user.id
  try {
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({message: "Unauthorized! user not found"})
    }

    return res.status(200).json(user)
  }catch (err) {
    console.log(err)
    return res.status(500).json({message: "Server Error"})
  }
}

const logOut = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  return res.status(200).json({ message: "Logged out Successfully" });
};

module.exports = { signup, login, logOut, getUser }