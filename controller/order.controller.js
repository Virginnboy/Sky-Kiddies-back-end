const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const sendEmail = require("../utils/sendEmail");


const placeOrder = async (req, res) => {

  try {
    const userId = req.user.id
    const { fullName, address, phone, paymentMethod } = req.body
    
    if (!req.file) {
      return res.status(400).json({message: "Payment receipt requred"});
    }
    const receipt = req.file.path

    if (!fullName?.trim() || !address.trim() || !phone.trim() || !paymentMethod) {
      return res.status(400).json({message: "All input fields are required"})
    }

    if (phone.length < 11 || phone.length > 14) {
      return res.status(400).json({message: "Invalid phone number"})
    }

    const cart = await cartModel.findOne({user:userId}).populate("items.product")

    if(!cart || cart.items.length === 0) {
      return res.status(404).json({message: "Cart is empty"})
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
      await sendEmail({
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
      console.log(emailError)
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({message: "Order placed successfully", order})

  }catch(err) {
    console.log(err)
    return res.status(500).json({message: "Server Error"})
  }
}

const fetchOrders = async (req, res) => {
  try {
    const order =await orderModel.find()
    .populate("user", "email firstName")
    .populate("items.product", "price title")


    return res.status(200).json({order});

  }catch(err) {
    console.log(err)
    return res.status(500).json({message: "Server ERROR"})
  }
}

const fetchOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId)
    .populate("user", "email firstName")
    .populate("items.product")

    if(!order) {
      return res.status(404).json({message: "Order Not Found"})
    }

    return res.status(200).json({order});

  }catch(err) {
    console.log(err) 
    return res.status(500).json({message: "Server ERROR"})
  }
}

const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await orderModel.findById(orderId).populate("user", "firstName email")
    if (!order) {
      return res.status(404).json({message: "Order not found"});
    }

    if (order.status === "Confirmed") {
      return res.status(400).json({message: "Order has already been confimed"});
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

    return res.status(200).json({message: "Order has been confirmed", order});

  }catch (err) {
    console.log(err)
    return res.status(500).json({message: "Server ERROR"})
  }
}


module.exports = { placeOrder, fetchOrders, fetchOrderDetails, confirmOrder }