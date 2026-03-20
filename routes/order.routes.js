const express = require("express");
const { fetchOrders, fetchOrderDetails, confirmOrder } = require("../controller/order.controller");
const protectAdmin = require("../middleware/admin.auth.middleware");
const router = express.Router();

router.get("/orders", fetchOrders);
router.get("/order-details/:orderId", fetchOrderDetails);
router.patch("/confirm-order/:orderId", protectAdmin, confirmOrder)


module.exports = router