const { adminModel } = require("../models/admin.model");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/sendEmail");
const AppError = require("../errors/AppError");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

// FUNCTION SIGNUP
const signup =catchAsync(async(req, res, next)=>{
  const { email, password, firstName } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return next(new AppError("email or password required", 400));
  }

  const existingEmail = await adminModel.findOne({email});

  if (existingEmail) {
    return next(new AppError("user with this email already exist", 400));
  }

  const newUser = await adminModel.create({
    email,
    password,
    firstName
  });

  res.status(201).json({
    status: "success",
    message: "Created successfully",
    data: newUser
  })
});

// FUNCTION LOGIN
const login =catchAsync(async(req, res, next)=> {
  const {email, password} = req.body

  if (!email?.trim() || !password?.trim()) {
  return next(new AppError("Email and password are required", 400));
}

  const user = await adminModel.findOne({email}).select("+password");

  if (!user) {
    return next(new AppError("User does not exist please signup to continue", 401));
  }

  if (user.role !== "admin") {
    return res.status(401).json({message: "Only admin is allowed to use this route"})
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new AppError("Invalid Password", 403));
  }

  const token = jwt.sign({
    id: user._id, 
    firstName: user.firstName,  
    email: user.email, 
    role: user.role
  },
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
  );


  res.cookie("adminToken", token, {
    httpOnly: true,
    secure: true, // true on Render
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
      message: "Login successfuly", 
      user, 
      token
    });
});

// FUNCTION FORGOT PASSWORD
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const admin = await adminModel.findOne({ email });

  if (!admin) {
    return res.status(200).json({
      status: "success",
      message: "If this email exists, a reset link has been sent"
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Save token and expiry in DB
  admin.resetPasswordToken = hashedToken;
  admin.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await admin.save();

  // 4️⃣ Create reset link
  const adminUrl = process.env.ADMIN_URL || "http://localhost:5173";
  const resetLink = `${adminUrl}/reset-password/${resetToken}`;

  // Send email
  try {
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

    res.status(200).json({ 
      status: "success",
      message: "If this email exists, a reset link has been sent" 

    });
  }catch (emailError) {
    console.log("Error sending email", emailError);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save({ validateBeforeSave: false });

    return next(new AppError("Could not send reset email. please try again later", 500));
  }
});

// FUNCTION RESET PASSWORD
const resetPassword = catchAsync(async(req, res, next)=> {
  const { token } = req.params
  const { newPassword } = req.body
  
  // Hash token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  
  const admin = await adminModel.findOne({resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now()}});
  
  if (!admin) {
    return next(new AppError("Unathorized! Token expired", 401));
  }

  admin.password = newPassword
  admin.resetPasswordToken = undefined
  admin.resetPasswordExpires = undefined 
  
  await admin.save();

  try {
    await sendEmail({
      to: admin.email,
      subject: "Password Reset Successful",
      html: `
        <h2>Dear ${admin.firstName}</h2>
        <p>Your password has been successfully reset</p>
        <p>if you did not initiate this action please contact our support team immediatelly for your account might have been compromized</p>

        <b>Kind Regards</b>
        <p>Sky Kiddies</p>
      `
    });

  }catch (emailError) {
    console.log(emailError);
  }
  
  res.status(200).json({
    status: "success",
    message: "Password reset successfully! Login now"
  });
});


// FUNCTION LOGOUT USER
const logOut = (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: true, // true on Render
    sameSite: "None"
  });

  return res.status(200).json({message: "Logged out Successfully"});
};

const getAuthenticated = async (req, res)=> {
  const user = req.user;

  return res.status(200).json({authenticated: true, user});
};


module.exports = { signup, login, forgotPassword, logOut, resetPassword, getAuthenticated };