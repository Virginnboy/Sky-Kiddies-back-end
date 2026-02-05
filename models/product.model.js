const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {type: String, required: true, trim: true},
  description: {type: String, required: true, trim: true},
  price: {type: Number, required: true, min: 0},
  quantity: {type: Number, required: true, min: 0},
  images: [{type: String, required: true}],
},
{timestamps: true}
);

const productModel = mongoose.model("Products", productSchema);

module.exports = productModel;