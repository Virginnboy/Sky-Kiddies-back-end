const express = require("express");
const { addToCart, fetchCart, removeCart, updateQuantity } = require("../controller/cart.controller");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/add", protect, addToCart)
router.get("/fetch-cart", protect, fetchCart)
router.delete("/remove/:id", protect, removeCart)
router.patch("/update/:id", protect, updateQuantity)

module.exports = router; 