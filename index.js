require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Route files
const { router: authRoutes } = require("./auth");
const cartRoutes = require("./cart");
const productRoutes = require("./routes/product"); // 💡 Import product routes

// Use routes
app.use("/api", authRoutes); // /api/auth/signup, /api/auth/login
app.use("/api", cartRoutes); // /api/cart/add, /api/cart/:userId/item/:productId
app.use("/api", productRoutes); // /api/products, /api/products/:id

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Default route (optional)
app.get("/", (req, res) => {
  res.send("Flipkart Clone Backend is Running");
});

// Start server
app.listen(8080, () => {
  console.log("🚀 Server is running on http://localhost:8080");
});
