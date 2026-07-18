const express = require("express");
const cors = require("cors")
const cookieParser = require("cookie-parser");

const AppError = require("./errors/AppError");
const globalErrorHandler = require("./errors/globalErrorHandler");

const adminRoute = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const productRoute = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();
const allowedOrigin = [
  "http://localhost:5173", 
  "http://localhost:5174", 
  "https://sky-kiddies-admin.onrender.com", 
  "https://sky-kiddies-client-end.onrender.com"
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigin.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked CORS origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res)=> {
  res.send("API is running");
});

// Routes
app.use("/admin", adminRoute);
app.use("/admin", productRoute);
app.use("/admin", orderRoutes);
app.use("/user", userRoutes);
app.use("/cart", cartRoutes);

// Ivalid Routes Middleware Handler
app.use((req, res, next)=> {
  const err = new AppError(`Cant find ${req.originalUrl} on this server`, 404);
  console.log(err);

  next(err);
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

module.exports = { app, allowedOrigin };