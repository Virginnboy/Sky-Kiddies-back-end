const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true
      },

      quantity: { type: Number, required: true }
    }
  ],

  totalPrice: { type: Number, required: true },

  shippingAddress: {
    fullName: {type: String, required: true},
    address: {type: String, required: true},
    phone: {type: String, required: true},
    receipt: {type: String, required: true},
  },

  paymentMethod: {type: String, required: true},

  status: { type: String, default: "Pending" },

  orderNumber: {type: String, required: true, unique: true}

}, { timestamps: true })

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;