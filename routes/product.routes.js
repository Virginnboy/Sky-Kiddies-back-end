const express = require("express");
const  { createProduct, fetchProduct, fetchProductDetails, deleteProduct, editProduct }  = require("../controller/product.controller");
const protectAdmin = require("../middleware/admin.auth.middleware");
const upload = require("../middleware/multer.middleware");

const router = express.Router();

router.post("/uploadProduct", protectAdmin, upload.array("images", 10), createProduct);
router.get("/products", fetchProduct);
router.get("/product-details/:id", fetchProductDetails);
router.delete("/delete-product/:id", protectAdmin, deleteProduct);
router.patch("/edit-product/:id", protectAdmin, upload.array("images", 10 ), editProduct);

module.exports = router;