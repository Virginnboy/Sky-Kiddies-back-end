const messageModel = require("../models/message.models");
const { adminModel } = require("../models/admin.model");

const getUserChats = async (req, res) => {
  try {
    const adminId  = req.user?.id;

    const chats = await messageModel.find({receiver: adminId}).populate("sender");

    const map = new Map();

  chats.forEach(msg => {
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

const getUserMessages = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const userId = req.params?.userId;
    const messages = await messageModel.find({
      $or: [
        { sender: userId, receiver: adminId},
        { sender: adminId, receiver: userId}
      ]
    })
    .populate("sender")
    .sort({ createdAt: 1 });

    console.log(messages);

    return res.status(200).json({messages});

  }catch (err) {
    console.log(err)
    return res.status(500).json({message: "Server ERR"})
  }
}

const fetchAdminMessages = async (req, res) => {
  try {
    const adminId = req?.params?.adminId;
    const userId = req?.user?.id;
    console.log("user id", userId);
    console.log("Admin ID", adminId);

    if (!adminId) {
      return res.status(400).json({ message: "Admin not authenticated" });
    }

    const messages = await messageModel.find({
      $or: [
        { sender: userId, receiver: adminId},
        { sender: adminId, receiver: userId}
      ]
    }).populate("sender").sort({createdAt: 1});

    return res.status(200).json({messages});

  }catch (err) {
    console.log(err)
    return res.status(500).json({message: "Server ERR! Failed to fetch messages"})
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

module.exports = { getUserChats, getAdmin, getUserMessages, fetchAdminMessages }