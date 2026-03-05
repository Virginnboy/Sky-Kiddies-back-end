const mongoose = require("mongoose");

const bankDetailsSchema = new mongoose.Schema({
  accountName: { type: String, required: true},
  accountNumber: {type: String, required: true},
  accountType: { 
    type: String, 
    enum: ["Savings", "Current"],
    required: true},
  bankName: { type: String, required: true},
}, {timestamps: true});

const bankDetailsModel = mongoose.model("BankDetails", bankDetailsSchema)

module.exports = bankDetailsModel