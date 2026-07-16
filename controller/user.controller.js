const { userModel } = require("../models/user.model");
const sendEmail = require("../utils/sendEmail");
const catchAsync = require("../utils/catchAsync");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AppError = require("../errors/AppError");

require("dotenv").config();

// FUNCTION SIGNUP
const signup = catchAsync(async (req, res, next) => {
  const {email, password, firstName} = req.body

  if (!email?.trim || !password?.trim() || !firstName?.trim) {
    return next(new AppError("All fields are required", 400));
  }

  const user = await userModel.findOne({email});

  if (user) {
    return next(new AppError("User with this email already exist", 400));
  }

  const newUser = new userModel({email, password, firstName})

  await newUser.save();

  res.status(201).json({
    status: "success",
    data: newUser,
    message: "Signup successful"
  });
});


// LOGIN FUNCTION
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return next(new AppError("Email and Password are required", 400));
  }

    const user = await userModel.findOne({email});
    if (!user) {
      return next(new AppError("No user with this email found", 400))
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid password", 401));
    }

    const token = jwt.sign({
      id: user._id,
      email: user.email,
      firstName: user.firstName
    },
    process.env.JWT_SECRET,
    {expiresIn: "1d" }
  );

    res.cookie("userToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production"? "None" : "Lax",
        maxAge: 24 * 60 * 60 * 1000,
    });

    try {
      await sendEmail({
        to: user.email,
        subject: "SKy Kiddies Successful Login",
        html: `
          <h2>Dear ${user.firstName}</h2>
          <p>You Have Loggedin successfully to Sky Kiddies on ${new Date().toLocaleString()}.</p>
          <p>please if you do not intitiate this action, contact our customer support as your account might have been compromised.</p>


          
          <p>Kind Regards,</p>
          <p>Sky Kiddies Team</p>
        `
      });
    }catch(err) {
      console.error("Login email failed:", err.message);
    }

    res.status(200).json({
      message: "Logged in successfully", 
      user,
      token
    });
});


// AUTHENTICATE USER
const getUser = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json(user);
  }catch (err) {
    console.log(err)
    return res.status(500).json({message: "Server Error"})
  }
}

const forgotPassword = async (req, res) => {
  const {email} = req.body
  try {
    const user =await userModel.findOne({email})

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  
      await user.save();
      
      const userUrl = process.env.USER_URL || "http://localhost:5174"
      const resetLink = `${userUrl}/reset-password/${resetToken}`
  
      try {
        sendEmail({
          to: user.email,
          subject: "Password Reset Request",
          html: `
            <h2>Password Reset</h2>
            <p>You requested to reset your password.</p>
            <p>Click the link below to continue:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link expires in 15 minutes.</p>
          `
        });
      }catch(emailError) {
        console.error("Error sending email:", emailError)
        return res.status(500).json({
          status: "fail",
          message: "Could not send the reset email link. Please try again later"
        })
      }
    }

    return res.status(200).json({message: "Reset password link has been sent to your email"})

  }catch(err) {
    return res.status(500).json({message: "Server Error"})
  }
}

const resetPassword = async (req, res) => {
  const { token } = req.params

  const {newPassword} = req.body
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  try {
    const user = await userModel.findOne({resetPasswordToken: hashedToken, resetPasswordExpires: {$gt: Date.now()}});

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Successful",
        html: `
          <h2>Dear ${user.firstName}</h2>
          <p>Your password has been successfully reset</p>
          <p>if you did not initiate this action please contact our support team immediatelly for your account might have been compromized</p>

          <b>Kind Regards</b>
          <p>Sky Kiddies</p>
        `
      })
    }catch (emailError) {
      console.log(emailError)
    }

    return res.status(200).json({message: "password reset successfully"});
  }catch(err) {
    console.log(err)
    return res.status(500).json({message: "Server Error"})
  }
}

const logOut = (req, res) => {
  res.clearCookie("userToken", {
    httpOnly: true,
    secure: true, // true on Render
    sameSite: "None"
  });

  return res.status(200).json({ message: "Logged out Successfully" });
};

module.exports = { signup, login, logOut, getUser, forgotPassword, resetPassword }