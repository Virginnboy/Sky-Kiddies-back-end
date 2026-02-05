const { adminModel } = require("../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();

// FUNCTION SIGNUP
const signup =(req, res)=>{
  const {email, password, firstName} = req.body

  adminModel.findOne({email})
  .then((existingEmail)=>{
    if (existingEmail) {
      return res.status(409).json({message: "User with this email already exist"})
    }
    let newAdmin = new adminModel({email, password, firstName})

    return newAdmin.save()
  })
    .then(()=>{
    return res.status(201).json({message: "sign up successfully"})
  }).catch((error)=>{
    console.log(error)
    return res.status(500).json({message: "sign up failed, An error occured"})
  })
}

// FUNCTION LOGIN
const login =(req, res)=> {
  const {email, password} = req.body
  adminModel.findOne({email})
  .then((admin)=>{
    if (!admin) {
      return res.status(401).json({message: "No user with this email found"})
    }

    bcrypt.compare(password, admin.password)
    .then((isMatch)=>{
      if (!isMatch) {
        return res.status(403).json({message: "invalid password"})
      }

      const token = jwt.sign({
        id: admin._id, firstName: admin.firstName,  email: admin.email, role: admin.role},
        process.env.JWT_SECRET,
        {expiresIn: 24 * 60 * 60 * 1000}
      );


      res.cookie("token", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 24 * 60 * 60 * 1000
      });

      return res.status(200).json(
        {message: "Login successfuly", user: admin}
      );

    }).catch((err)=>{
      console.log("bcrypt error", err)
      return res.status(500).json({message: "Server error"})
    });

  }).catch((err)=>{
    console.error("Server error", err)
    return res.status(500).json({message: "Server error"})
  });
};

// FUNCTION FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(409).json({ message: "No user found with the email provided" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save token and expiry in DB
    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await admin.save();

    // 4️⃣ Create reset link
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Send email
    await sendEmail({
      to: admin.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to continue:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `
    });

    res.status(200).json({ message: "Password reset link sent to your registered email" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", err });
  }
};

// FUNCTION RESET PASSWORD
const resetPassword = async(req, res)=> {
  const { token } = req.params
  const { newPassword } = req.body
  console.log(token)
  console.log(newPassword)
  
  // Hash token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  
  try {
    const admin = await adminModel.findOne({resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now()}});
    
    if (!admin) {
      return res.status(401).json({message: "Unathorized! Token expired"});
    }

    admin.password = newPassword
    admin.resetPasswordToken = undefined
    admin.resetPasswordExpires = undefined 
    
    await admin.save();

    return res.status(200).json({message: "Password reset successfully! Login now"})

  } catch (err) {
    console.log(err);
    return res.status(500).json({message: "Server error"})
  }
};

// FUNCTION LOGOUT USER
const logOut = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax"
  });

  return res.status(200).json({message: "Logged out Successfully"});
};

const getAuthenticated = async (req, res)=> {
  const user = req.user;

  return res.status(200).json({authenticated: true, user});
};


module.exports = { signup, login, forgotPassword, logOut, resetPassword, getAuthenticated };