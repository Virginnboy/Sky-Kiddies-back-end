const express = require("express");
const { signup, login, forgotPassword, logOut, resetPassword, getAuthenticated } = require("../controller/admin.controller");
// const protect = require("../middleware/auth.middleware");
const protectAdmin = require("../middleware/admin.auth.middleware");
const { createBankAccount, fetchAccountDetails, fetchAccountById, editAccountDetails } = require("../controller/payment.controller");
const { getUserChats } = require("../controller/message.controller");
const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logOut);
router.post("/add-account", protectAdmin, createBankAccount);
router.patch("/edit-account/:accountId", protectAdmin, editAccountDetails);
router.get("/fetch-account", fetchAccountDetails);
router.get("/get-bank-details/:accountId", protectAdmin, fetchAccountById);
router.get("/auth-check", protectAdmin, getAuthenticated);
router.get("/chats", protectAdmin, getUserChats);

module.exports = router;