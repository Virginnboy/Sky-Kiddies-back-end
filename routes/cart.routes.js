const express = require("express");
const { addToCart, fetchCart, removeCart, updateQuantity } = require("../controller/cart.controller");
const protectUser = require("../middleware/user.auth.middleware");

const router = express.Router();

router.post("/add", protectUser, addToCart)
router.get("/fetch-cart", protectUser, fetchCart)
router.delete("/remove/:id", protectUser, removeCart)
router.patch("/update/:id", protectUser, updateQuantity)

module.exports = router; 