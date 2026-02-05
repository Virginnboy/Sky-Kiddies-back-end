const express = require("express");
const { signup, login, forgotPassword, logOut, resetPassword, getAuthenticated } = require("../controller/admin.controller");
const router = express.Router();
const protect = require("../middleware/auth.middleware");


router.post("/signup", signup)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)
router.post("/logout", logOut)
router.get("/auth-check", protect, getAuthenticated)

module.exports = router;