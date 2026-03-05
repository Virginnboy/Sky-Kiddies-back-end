const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
      quantity: Number,
      price: Number
    }
  ],

  totalAmount: Number,

  paymentMethod: {
    type: String,
    default: "Bank Transfer"
  },

  paymentReceipt: {
    type: String // Cloudinary URL
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Rejected"],
    default: "Pending"
  },

  orderStatus: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered"],
    default: "Processing"
  }

}, { timestamps: true });

