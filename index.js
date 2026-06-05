const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const socketSetup = require("./sockets/socket");
const verifySocketToken = require("./sockets/socket.auth.middleware");

const messageModel = require("./models/message.models");

const app = express();

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
io.use(verifySocketToken);

// web socket connection
socketSetup(io)

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("API is running");
});

// Routes
app.use("/admin", adminRoute);
app.use("/admin", productRoute);
app.use("/admin", orderRoutes);
app.use("/user", userRoutes);
app.use("/user", productRoutes);
app.use("/cart", cartRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("mongodb connected successfully");
  const PORT = process.env.PORT || 5000
  
  // Server connection
  server.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`)
  });
}).catch(err=> console.log(err))
