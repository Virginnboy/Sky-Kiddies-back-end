const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "senderModel",
  },
  senderModel: {
    type: String,
    required: true,
    enum: [ "User", "Admin" ]
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "receiverModel",
  },
  receiverModel: {
    type: String,
    required: true,
    enum: [ "User", "Admin" ]
  },

  message: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: [ "sent", "delivered", "read"],
    default: "sent"
  }
}, {timestamps: true});

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel