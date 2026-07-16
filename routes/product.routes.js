const express = require("express");
const  { createProduct, fetchProduct, fetchProductDetails, deleteProduct, editProduct }  = require("../controller/product.controller");
const protectAdmin = require("../middleware/admin.auth.middleware");
const uploadFile = require("../middleware/uploadFile.middleware");

const router = express.Router();

const uploadProduct = uploadFile("products")

router.post("/uploadProduct", protectAdmin, uploadProduct.array("images", 10), createProduct);
router.get("/products", fetchProduct);
router.get("/product-details/:id", fetchProductDetails);
router.delete("/delete-product/:id", protectAdmin, deleteProduct);
router.patch("/edit-product/:id", protectAdmin, uploadProduct.array("images", 10 ), editProduct);

module.exports = router;