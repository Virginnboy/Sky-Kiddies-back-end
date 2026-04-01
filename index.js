const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const jwt = require("jsonwebtoken")

const messageModel = require("./models/message.models");

const app = express();
app.set("trust proxy", 1);

const adminRoute = require("./routes/admin.routes");
const productRoute = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const server = http.createServer(app);

const allowedOrigin = [
      "http://localhost:5173", 
      "http://localhost:5174", 
      "https://sky-kiddies-admin.onrender.com", 
      "https://sky-kiddies-client-end.onrender.com"
    ]

    // web socket io server and cors origin
const io = new Server(server, {
  cors: {
    origin: allowedOrigin
  }
});

// web socket middleware 
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Not authenticated"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Session expired"));
    }

    socket.user = decoded; // attach user info
    next();
  });
});

// web socket connection
io.on("connection", (socket)=> {
  // console.log("User connected", socket.user.id);
  
  socket.join(socket.user.id);

  socket.on("send_message", async (data) => {
    // console.log(data)
    const message = await messageModel.create(data);
    // console.log(message)
    io.to(data.receiver).emit("receive_message", message);
    io.to(data.sender).emit("receive_message", message);
  });
  
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.user.id);
  });
});

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors(
  {
    origin: allowedOrigin,
    credentials: true
  }
));

app.get("/", (req, res) => {
  res.send("API is running");
});

// Routes
app.use("/admin", adminRoute);
app.use("/admin", productRoute);
app.use("/admin", orderRoutes);
app.use("/user", userRoutes);
app.use("/cart", cartRoutes);

// Database
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("mongodb connected successfully");
}).catch(err=> console.log(err))

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`)
});