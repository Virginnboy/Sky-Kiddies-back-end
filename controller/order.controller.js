const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const AppError = require("../errors/AppError");
const sendEmail = require("../utils/sendEmail");
const catchAsync = require("../utils/catchAsync");


const placeOrder = catchAsync(async (req, res, next) => {
    const userId = req.user.id
    const { fullName, address, phone, paymentMethod } = req.body
    
    if (!req.file) {
      return next(new AppError("Payment receipt requred", 400));
    }
    const receipt = req.file.path

    if (!fullName?.trim() || !address.trim() || !phone.trim() || !paymentMethod) {
      return next(new AppError("All input fields are required", 400))
    }

    if (phone.length < 11 || phone.length > 14) {
      return next(new AppError("Invalid phone number", 400));
    }

    const cart = await cartModel.findOne({user:userId}).populate("items.product")

    if(!cart || cart.items.length === 0) {
      return next(new AppError("Cart is empty", 404));
    }

    const cartSummarry = cart.items.reduce((total, item)=> {
      return total + item.product.price * item.quantity
    },0);

    const orderNumber = `SKY-${Date.now()}`;

    const order = new orderModel({
      user: userId,
      items: cart.items,
      totalPrice: cartSummarry,
      orderNumber,
      shippingAddress: {
        fullName,
        address,
        phone,
        receipt
      },
      paymentMethod
    });

    await order.save();

    try {
      sendEmail({
        to: req.user.email,
        subject: "Sky Kiddies Order Received",
        html: `
          <h2>Hello ${fullName}</h2>

          <p>Your order has been received.</p>

          <p><strong>Order Number:</strong> ${orderNumber}</p>

          <p>Your order is currently <b>PENDING</b> while we verify your payment.</p>

          <p>Once payment is confirmed, your order status will be updated.</p>

          <p>Thank you for shopping with Sky Kiddies.</p>
        `
      });
    }catch(emailError) {
      console.log(emailError);
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      status: "Success",
      message: "Order placed successfully", 
      data: order
    });
});

const fetchOrders = catchAsync(async (req, res, next) => {
  const order =await orderModel.find()
  .populate("user", "email firstName")
  .populate("items.product", "price title").sort({createdAt: -1})

  return res.status(200).json({
    status: "Success",
    order
  });
});

const fetchOrderDetails = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await orderModel.findById(orderId)
  .populate("user", "email firstName")
  .populate("items.product")

  if(!order) {
    return next(new AppError("Order Not Found", 404));
  }

  return res.status(200).json({
    status: "Success",
    order
  });
});

const confirmOrder = catchAsync(async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await orderModel.findById(orderId).populate("user", "firstName email")
    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    if (order.status === "Confirmed") {
      return next(new AppError("Order has already been confimed", 400));
    }

    order.status = status;

    await order.save()

    try{
      await sendEmail({
        to: order.user.email,
        subject: "Sky Kiddies Order Confirmed",
        html: `
          <h2>Dear ${order.user.firstName}</h2>
          <p>Your order <strong>${order.orderNumber}</strong> has been confirmed!</p>
          <p>We have verified your payment and your order is now being processed.</p>
          <p>Thank you for shopping with Sky Kiddies.</p>
        `
      });
    }catch (emailError) {
      console.log("Error sending confirmation email:", emailError)
    }

    return res.status(200).json({
      status: "Success",
      message: "Order has been confirmed", 
      order
    });
});

const fetchUserOrder = catchAsync(async (req, res, next) => {
    const userId = req.user.id

    const userOrder = await orderModel.find({user: userId}).populate("items.product", "title price");

    if (!userOrder) {
      return next(new AppError("Order not found", 404));
    }

    return res.status(200).json({userOrder})
  });

module.exports = { placeOrder, fetchOrders, fetchOrderDetails, confirmOrder, fetchUserOrder }