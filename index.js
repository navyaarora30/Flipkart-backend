require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const Product = require("./models/Product");
const { router: authRoutes, authenticateJWT } = require("./auth");
const cartRoutes = require("./cart");

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

// Connect MongoDB

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

    console.log("❌ MongoDB connection error:", err);
  });

// Routes
app.use("/auth", authRoutes); // For auth-related routes
app.use("/", cartRoutes); // All cart routes like /cart/add, /cart/:userId/item/:productId

// Products route - GET all
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "There is internal server error" });
  }
});

// Product route - GET by ID
app.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "The item you were searching for does not exist",
      });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Root route - health check
app.get("/", (req, res) => {
  res.send("Flipkart Backend API is running!");
});

// Start server
app.listen(8080, () => {
  console.log("Server is running on port 8080");

});
