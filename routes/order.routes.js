const express = require("express");
const { fetchOrders, fetchOrderDetails, confirmOrder } = require("../controller/order.controller");
const router = express.Router();

router.get("/orders", fetchOrders);
router.get("/order-details/:orderId", fetchOrderDetails);
router.patch("/confirm-order/:orderId", confirmOrder)


module.exports = router