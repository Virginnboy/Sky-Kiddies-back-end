const express = require("express");
const { signup, login, logOut, getUser, forgotPassword, resetPassword } = require("../controller/user.controller");
const { fetchProduct, fetchProductDetails } = require("../controller/product.controller"); 
// const protect = require("../middleware/auth.middleware");
const protectUser = require("../middleware/user.auth.middleware");
const  orderUpload  = require("../middleware/orderUpload.middleware");
const { fetchAccountDetails } = require("../controller/payment.controller");
const { placeOrder, fetchUserOrder } = require("../controller/order.controller");
const { getAdmin, fetchAdminMessages } = require("../controller/message.controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", protectUser, logOut);
router.get("/products", fetchProduct);
router.get("/product-details/:id", fetchProductDetails);
router.get("/me", protectUser, getUser);
router.get("/fetch-account", fetchAccountDetails);
router.post("/place-order", protectUser, orderUpload.single("photo"), placeOrder);
router.get("/fetch-user-order", protectUser, fetchUserOrder);
router.get("/get-admin", getAdmin);
router.get("/fetch_messages/:adminId", protectUser, fetchAdminMessages);

module.exports = router;