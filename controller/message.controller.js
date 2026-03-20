const messageModel = require("../models/message.models");
const { adminModel } = require("../models/admin.model")

const getUserChats = async (req, res) => {
  console.log(req.user)
  try {
    const adminId  = req.user.id;
    console.log(adminId)

    const messages = await messageModel.find({receiver: adminId}).populate("sender");
    // console.log(messages)
    const map = new Map();

messages.forEach(msg => {
  if (!msg.sender) return; // skip if null

  const senderId = msg.sender._id.toString();

  if (!map.has(senderId)) {
    map.set(senderId, msg.sender);
  }
});

    const users = Array.from(map.values());

    return res.status(200).json({users});
  }catch(err) {
    console.log(err)
    return res.status(500).json({message: "Failed to fetch chats"})
  }
}

const getAdmin = async (req, res) => {
  try {
    const admin = await adminModel.findOne({role: "admin"})

    if (!admin) {
      return res.status(404).json({message: "Admin not found"})
    }

    return res.status(200).json(admin)
  }catch(err) {
    console.log(err)
    return res.status(500).json({message: "Server Error"})
  }
}

module.exports = { getUserChats, getAdmin }