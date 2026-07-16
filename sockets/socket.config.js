const { Server } = require("socket.io");

const verifySocketToken = require("../sockets/socket.auth.middleware");
const socketSetup = require("../sockets/socket");
const { allowedOrigin } = require("../app");

const socketServer = (server, allowedOrigin) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigin, 
      credentials: true
    },
  });

  io.use(verifySocketToken);

  socketSetup(io);

  return io
};

module.exports = socketServer;