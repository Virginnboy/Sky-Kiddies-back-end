const express = require("express");
const { signup, login, logOut, getUser } = require("../controller/user.controller");
const { fetchProduct } = require("../controller/product.controller"); 
const protect = require("../middleware/auth.middleware");
const { fetchAccountDetails } = require("../controller/payment.controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protect, logOut);
router.get("/products", fetchProduct);
router.get("/me", protect, getUser);
router.get("/fetch-account", fetchAccountDetails)

module.exports = router;