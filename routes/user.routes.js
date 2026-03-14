const express = require("express");
const { signup, login, logOut, getUser, forgotPassword, resetPassword } = require("../controller/user.controller");
const { fetchProduct, fetchProductDetails } = require("../controller/product.controller"); 
const protect = require("../middleware/auth.middleware");
const  orderUpload  = require("../middleware/orderUpload.middleware");
const { fetchAccountDetails } = require("../controller/payment.controller");
const { placeOrder } = require("../controller/order.controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", protect, logOut);
router.get("/products", fetchProduct);
router.get("/product-details/:id", fetchProductDetails);
router.get("/me", protect, getUser);
router.get("/fetch-account", fetchAccountDetails)
router.post("/place-order", protect, orderUpload.single("photo"), placeOrder);

module.exports = router;