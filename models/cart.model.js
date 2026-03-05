const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: false
  },

  items: [
    {
      product: {
        type:mongoose.Schema.Types.ObjectId, 
        ref: "Products", 
        required: true 
      },
      quantity: {
        type: Number, 
        default: 1, 
        min: 1
      }
    }
  ],
  sessionId: {
    type: String, 
    required: false
  }
}, 
{timestamps: true});

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;