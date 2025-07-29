require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const Product = require("./models/Product");
const { router: authRoutes } = require("./auth"); // ✅ from root-level auth.js
const cartRoutes = require("./cart");
const productRoutes = require("./routes/product");

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(bodyParser.json());

// ✅ Route registrations
app.use("/api", authRoutes); // /api/signup & /api/login
app.use("/api", cartRoutes); // /api/cart/...
app.use("/api", productRoutes); // /api/products, /api/product/:id

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🛒 Flipkart Backend API is running!");
});

// ✅ Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
