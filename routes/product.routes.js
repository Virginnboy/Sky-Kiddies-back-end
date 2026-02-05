const express = require("express");
const  { createProduct, fetchProduct, fetchProductDetails, deleteProduct, editProduct }  = require("../controller/product.controller");
const protect = require("../middleware/auth.middleware");
const upload = require("../middleware/multer.middleware");

const router = express.Router();

router.post("/uploadProduct", protect, upload.array("images", 10), createProduct);
router.get("/products", protect, fetchProduct);
router.get("/product-details/:id", protect, fetchProductDetails);
router.delete("/delete-product/:id", protect, deleteProduct);
router.patch("/edit-product/:id", protect, upload.array("images", 10 ), editProduct);

module.exports = router;