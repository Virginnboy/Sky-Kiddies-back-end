const express = require("express");
const { signup, login, forgotPassword, logOut, resetPassword, getAuthenticated } = require("../controller/admin.controller");
const protect = require("../middleware/auth.middleware");
const { createBankAccount, fetchAccountDetails, fetchAccountById, editAccountDetails } = require("../controller/payment.controller")
const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logOut);
router.post("/add-account", protect, createBankAccount);
router.patch("/edit-account/:accountId", protect, editAccountDetails);
router.get("/fetch-account", fetchAccountDetails);
router.get("/get-bank-details/:accountId", protect, fetchAccountById);
router.get("/auth-check", protect, getAuthenticated);

module.exports = router;