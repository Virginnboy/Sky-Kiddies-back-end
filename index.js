const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const adminRoute = require("./routes/admin.routes");
const productRoute = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const app = express()



// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: ["http://localhost:5173", "http://localhost:5174", "https://sky-kiddies-admin.onrender.com"], credentials: true}));

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

app.listen(PORT, ()=> console.log(`server running on port ${PORT}`))