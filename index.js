const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();

const { app, allowedOrigin } = require("./app");
const socketServer = require("./sockets/socket.config");

const server = http.createServer(app); 

// Handle Global UNHANDLED REJECTION
// [ 1)Synchronous
process.on("uncaughtException", err=> {
  console.error(`Error Name: ${err.name}, Error Message: ${err.message}`);
  process.exit(1);
});

// 2)Asynchronous
process.on("unhandledRejection", (err)=> {
  console.error(`Error Name: ${err.name}, Error Message: ${err.message}`);
  console.log("UNHANDLED REJECTION! Shutting down server.....");

    server.close(()=> {
      process.exit(1);
    });
});
// ]

// io server connection
socketServer(server, allowedOrigin);

// Database connection
mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("mongodb connected successfully");
});

// Server connection
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`)
});
