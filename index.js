const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const adminRoute = require("./routes/admin.routes");
const productRoute = require("./routes/product.routes");

const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: "http://localhost:5173", credentials: true}))

// Routes
app.use("/admin", adminRoute);
app.use("/admin", productRoute);

// Database
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("mongodb connected successfully");
}).catch(err=> console.error(err))

const PORT = process.env.PORT

app.listen(PORT, ()=> console.log(`server running on port ${PORT}`))