const messageModel = require("../models/message.models");

const onlineUsers = new Set();
const activeChats = new Map();

const socketSetup = (io) => {
  io.on("connection", async(socket) => {
    const userId = socket.user.id;

    onlineUsers.add(userId);
    socket.join(userId);

    console.log("User connected:", userId);

// UPDATE OLD MESSAGE 
    try {
      const undeliveredMessage = await messageModel.find({
        receiver: userId,
        status: "sent"
      })

      for ( let msg of undeliveredMessage ) {
        msg.status = "delivered"

        await msg.save();

        io.to(msg.sender.toString()).emit("message_status_update", msg);
        io.to(msg.receiver.toString()).emit("message_status_update", msg);
      }
    }catch(err) {
        console.log(err)
      }

// JOIN CHAT (Track active conversation)
    socket.on("join_chat", ({otherUserId})=> {
      activeChats.set(userId, otherUserId);

      console.log("Joined users:", activeChats)
    });

// LEAVE CHAT
    socket.on("leave_chat", ()=> {
      activeChats.delete(userId)

      console.log(`User ${userId} left chat`, activeChats);
    })

// SEND NEW MESSAGE
    socket.on("send_message", async (data) => {
      try {
        const senderId = socket.user.id;
        const receiverId = data.receiver

        const { senderModel, receiver, receiverModel, message } = data;

        if (!receiver || !message?.trim()) {
          return;
        }

        let status = "sent" 

        if (onlineUsers.has(receiverId)) {
          const isInChat = activeChats.get(receiverId) === senderId;
          console.log("Is in chat:", isInChat)

          status = isInChat ? "read" : "delivered"
        }

        const messageDoc = await messageModel.create({
          sender: senderId, 
          senderModel,
          receiver,
          receiverModel,
          message,
          status
        });

        // send to receiver
        io.to(receiver).emit("receive_message", messageDoc);

        // send back to sender
        socket.emit("receive_message", messageDoc);

// EMIT STATUS UPDATE
        io.to(senderId.toString()).emit("message_status_update", messageDoc);
        io.to(receiverId.toString()).emit("message_status_update", messageDoc);

      }catch (err) {
        console.log(err);
      }
    });

    // MARK AS READ FOR OLD MESSAGES
    socket.on("mark_as_read", async ({senderId})=> {
      try {
        const unreadmessages = await messageModel.find({
          sender: senderId,
          receiver: userId,
          status: "delivered"
        });

        await messageModel.updateMany({
          sender: senderId,
          receiver: userId,
          status: "delivered"
        },
        {
          $set: {status: "read"}
        }
      );

      for (let msg of unreadmessages) {
        const updatedmsg = {
          ...msg.toObject(),
          status: "read"
        }
        // console.log("Read Messages:",updatedmsg)
        io.to(msg.sender.toString()).emit("message_status_update", updatedmsg);
        io.to(msg.receiver.toString()).emit("message_status_update", updatedmsg);
      }

      }catch (err) {
        console.log(err)
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      activeChats.delete(userId);
      console.log("User disconnected", userId);
    });
  });
};

module.exports = socketSetup;